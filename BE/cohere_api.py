from flask import Flask, request, jsonify
import cohere
import hashlib
import firebase_admin
from firebase_admin import auth
from firebase_admin import db

from queue import Queue
import uuid
from threading import Thread
import time

profile_dict = {}
waiting_list = []

process_queue = []

is_process = False

system_status = 'free'

task_done = False

cred_obj = firebase_admin.credentials.Certificate('./coherechatbot.json')
default_app = firebase_admin.initialize_app(cred_obj, {
	'databaseURL':'https://coherechatbot-default-rtdb.asia-southeast1.firebasedatabase.app/'
	})

ref = db.reference("/")

def add_bot_text(text):
    return 'Cohere: ' + text

def add_human_text(text):
    return 'You: ' + text

def clean_text(text):
    return text.strip()

def cut_answer(text):
    index = text.find('You:')
    if index != -1:
        return text[:index]
    else:
        return text
    
def delete_indicator(text):
    return text.replace("You: ", "").replace("Cohere: ", "")

class CoHere:
    def __init__(self, api_key):
        self.co = cohere.Client(f'{api_key}')

    def count_token(self, text):
        return len(self.co.tokenize(text=text))

    def asked(self, question, conv_dict, max_tokens=500, temp=0):
        question_message = add_human_text(question)
        
        conv_list = list(conv_dict.values())
        conv_list = conv_list + [question_message]

        prompt = ('\n'.join(conv_list) + '\nCohere:')

        summarized = False
        
        if self.count_token(prompt) > 3200:
            summarized = True

            back_size = (int)(len(conv_list)/7)
            if back_size % 2 == 0:
                back_size += 1
            if back_size < 3:
                back_size = 3

            c_list = conv_list[:-back_size]
            summary_list = []
            for i in range(len(c_list)):
                if 'Cohere:' in c_list[i]:
                    summary_list.append(c_list[i])
            for i in range(len(summary_list)):
                summary_list[i] = summary_list[i].replace('Cohere:','')

            summary_text = self.summarize('\n'.join(summary_list), temp=0).summary
            summary_text = add_bot_text(clean_text(summary_text))

            conv_list = [summary_text] + conv_list[-back_size:]

            prompt = ('\n'.join(conv_list) + '\nCohere:')


        answer = self.co.generate(
              model='command-nightly',
              prompt=prompt,
              max_tokens=max_tokens,
              temperature=temp).generations[0].text
        answer = cut_answer(answer)
        
        conv_list.append(add_bot_text(clean_text(answer)))

        return summarized, conv_list, clean_text(answer)
    
    def summarize(self, conserv, temp=0, command=''):
        return self.co.summarize(text=conserv,
                                 format='paragraph',
                                 temperature=temp,
                                 additional_command=command)


api_key = 't7PsmTR4WNiJDsYIGaUqzK8XFF2M8EAdxDNXtHqk'

cohere_bot = CoHere(api_key)

def process_overload():
    global profile_dict

    global waiting_list

    while len(waiting_list) != 0:
        id = waiting_list.pop(0)
        profile_dict[id]['code'] = 504
        profile_dict[id]['time'] = time.time()
        profile_dict[id]['status'] = True

def get_process_1(wait_list):
    global process_queue

    global waiting_list

    while len(wait_list) != 0:
        uid = wait_list.pop(0)
        process_queue.append(uid)
        waiting_list.remove(uid)

def sort_users(wait_list):
    global profile_dict

    new_wait_list = []
    user_list = []
    user_dict = {}

    for id in wait_list:
        uid = profile_dict[id]['data']['uid']

        if uid not in user_list:
            user_list.append(uid)
            user_dict[uid] = []

        user_dict[uid].append(id)

    while len(user_list) != 0:
        del_list = []
        for uid in user_list:
            new_wait_list.append(user_dict[uid].pop(0))
            if len(user_dict[uid]) == 0:
                del_list.append(uid)

        for uid in del_list:
            user_list.remove(uid)

    return new_wait_list

def get_process_2(wait_list):
    global process_queue

    new_wait_list = sort_users(wait_list)

    while len(new_wait_list) != 0:
        uid = new_wait_list.pop(0)
        process_queue.append(uid)
        waiting_list.remove(uid)

def get_process_3(wait_list, max_users):
    global system_status

    global process_queue

    new_wait_list = sort_users(wait_list)

    num_user_accepted = max_users - len(process_queue)

    for _ in range(num_user_accepted):
        uid = new_wait_list.pop(0)
        process_queue.append(uid)
        waiting_list.remove(uid)

    system_status = 'overload'
    
'''
Xử lí tuần tự FIFO các user trong process_queue
'''
def process():
    global task_done
    global system_status

    global profile_dict

    global process_queue

    while True:
        if task_done: 
            break

        if len(process_queue) != 0:
            try:
                id = process_queue[0]

                json_dict = profile_dict[id]['data']

                uid = json_dict['uid']
                chat_name = json_dict['chat name']
                chat_ref = ref.child(uid).child('chat').child(chat_name)

                question = json_dict['question']

                conv_dict = chat_ref.child('summarized conversation').get()

                summarized, conv_list, answer = cohere_bot.asked(question, conv_dict)

                chat_ref.child('conversation').push(delete_indicator(conv_list[-2]))
                chat_ref.child('conversation').push(delete_indicator(conv_list[-1]))

                if summarized:
                    chat_ref.child('summarized conversation').delete()
                    
                    for i in range(len(conv_list)):
                        chat_ref.child('summarized conversation').push(conv_list[i])
                
                else: 
                    chat_ref.child('summarized conversation').push(conv_list[-2])
                    chat_ref.child('summarized conversation').push(conv_list[-1])

                process_queue.pop(0)

                profile_dict[id]['answer'] = answer
                profile_dict[id]['code'] = 200
                profile_dict[id]['time'] = time.time()
                profile_dict[id]['status'] = True
            except Exception as error:
                print(error)
                time.sleep(50)
                continue

        else:
            time.sleep(1)

    print("Terminate process")
    
'''
Điều chỉnh biến system_status:
"free": hàm check_wait_list sẽ lần lượt xem xét và đưa user vào process_queue
"overload": server quá tải
'''
def set_system_status():
    global system_status

    global process_queue

    if len(process_queue) <= 5:
        system_status = 'free'

'''
Việc chọn tác vụ sẽ phụ thuộc vào biến system_status và
tổng user trong wait_list và process_queue
'''
def check_waiting_list(sleep_time, max_users):
    global task_done

    global system_status

    global waiting_list
    global process_queue

    while True:
        if task_done: 
            break

        time.sleep(sleep_time)
        set_system_status()

        if system_status == 'overload':
            process_overload()
            continue

        wait_list = waiting_list.copy()

        if len(wait_list) == 0:
            continue

        if len(wait_list) + len(process_queue) < 3:
            get_process_1(wait_list)
        elif len(wait_list) + len(process_queue) <= max_users:
            get_process_2(wait_list)
        elif len(wait_list) + len(process_queue) > max_users:
            get_process_3(wait_list, max_users)

    print("Terminate check waiting list")
    

'''
Một user đã được xử lí nhưng vẫn nằm trong hệ thống quá 5s --> xoá user
'''
def cleaner():
    global profile_dict

    global task_done

    while True:
        if task_done:
            break
        time.sleep(5)

        clean_profile = []

        for key, value in profile_dict.items():
            if value['status'] == True and time.time() - value['time'] > 5:
                clean_profile.append(key)

        for profile in clean_profile:
            profile_dict.pop(profile)

    print("Terminate cleaner")

app = Flask(__name__)  

'''
get_chats
Dùng để lấy thông tin người dùng khi người dùng đăng nhập thành công (tất cả các đoạn chat)
Dữ liệu json cần truyền:
{
    "uid": "user_id"
}
Mã trả về:
* 200: Thành công lấy về tất cả đoạn chat
* 204: Tìm thấy user id nhưng không có đoạn chat nào được ghi nhận
* 404: Không tim thấy user id  
'''
@app.get('/get_chats')
def get_information():
    json_dict = request.get_json()
    uid = json_dict['uid']

    try: 
        auth.get_user(uid)
    except:
        return jsonify({
            'status code': 404,
            'message': 'Cannot find user id'
        })

    all_user_chat = ref.child(uid).child('chat').get()

    if all_user_chat:
        user_chats = {}
        for key, value in all_user_chat.items():
            user_chats[key] = list(value['conversation'].values())
        return jsonify({
            'status code': 200,
            'message': 'Got user information',
            'user chat': user_chats
        })
    else:
        return jsonify({
            'status code': 204,
            'message': 'No previous chat!'
        })


'''
/get_chat
Dùng để lấy một đoạn chat
Dữ liệu json cần truyền:
{
    "uid": "user_id",
    "chat name": "chat_name"
}
Lưu ý về "chat name" đã được đề cập ở /create_chat
Mã trả về: 
* 200: Thành công lấy về đoạn chat
* 400: Không tìm thấy đoạn chat có tên tương ứng
* 404: Không tim thấy user id  
'''
@app.get('/get_chat')
def get_chat():
    json_dict = request.get_json()
    uid = json_dict['uid']

    try: 
        auth.get_user(uid)
    except:
        return jsonify({
            'status code': 404,
            'message': 'Cannot find user id'
        })

    chat_name = json_dict['chat name']

    user_chat = ref.child(uid).child('chat').child(chat_name).child('conversation').get()

    if user_chat:
        user_chat = list(user_chat.values())
        return jsonify({
            'status code': 200,
            'message': 'Got user chat',
            'user chat': user_chat
        })
    else:
        return jsonify({
            'status code': 400,
            'message': 'No chat found',
        })
    

'''
/create_chat
Dùng để tạo đoạn chat mới
Dữ liệu json cần truyền:
{
    "uid": "user_id",
    "chat name": "chat_name"
}
Lưu ý: "chat name" cần tránh những kí tự không được phép từ Firebase realtime database
"If you create your own keys, they must be UTF-8 encoded, can be a maximum of 768 bytes, 
and cannot contain ., $, #, [, ], /, or ASCII control characters 0-31 or 127. 
You cannot use ASCII control characters in the values themselves, either."
Mã trả về: 
* 200: Tạo đoạn chat thành công
* 400: Không thể tạo đoạn chat
* 404: Không tim thấy user id 
'''
@app.post('/create_chat')
def create_chat():
    json_dict = request.get_json()
    uid = json_dict['uid']

    try: 
        auth.get_user(uid)
    except:
        return jsonify({
            'status code': 404,
            'message': 'Cannot find user id'
        })
    
    chat_name = json_dict['chat name']

    all_chat_name = ref.child(uid).child('chat').get()
    if all_chat_name:
        all_chat_name = list(all_chat_name.keys())
    else:
        all_chat_name = []

    if chat_name in all_chat_name:
        return jsonify({
            'status code': 400,
            'message': 'Create failed',
        })
    
    chat_ref = ref.child(uid).child('chat').child(chat_name)

    chat_ref.child('conversation').push('Hello! What can I help you?')
    chat_ref.child('summarized conversation').push('Cohere: Hello! What can I help you?')

    return jsonify({
        'status code': 200,
        'message': 'Create completed',
        'new chat': 'Hello! What can I help you?'
    })


'''
/question
Dùng để hỏi cohere
{
    "uid": "user_id",
    "chat name": "chat_name",
    "question": "question"
}
Lưu ý về "chat name" đã được đề cập ở /create_chat
Mã trả về: 
* 200: Cohere trả lời thành công
* 400: Không tìm thấy đoạn chat có tên tương ứng
* 404: Không tim thấy user id  
* 504: Cohere không thể trả lời ngay lập tức
'''
@app.post('/question')
def ask_question():
    json_dict = request.get_json()

    uid = json_dict['uid']

    try: 
        auth.get_user(uid)
    except:
        return jsonify({
            'status code': 404,
            'message': 'Cannot find user id'
        })
    

    chat_name = json_dict['chat name']
    chat_ref = ref.child(uid).child('chat').child(chat_name)

    if not chat_ref.child('summarized conversation').get():
        return jsonify({
            'status code': 400,
            'message': 'Cannot find chat'
        })
    
    id = str(uuid.uuid4())
    
    profile = {
        'data': json_dict,
        'status': False,
        'time': time.time()
    }

    global profile_dict
    global waiting_list

    profile_dict[id] = profile.copy()
    waiting_list.append(id)

    while not profile_dict[id]['status']:
        time.sleep(1)

    profile_dict[id]['time'] = time.time()

    if profile_dict[id]['code'] == 200:
        return jsonify({
            'status code': 200,
            'message': 'Complete',
            'answer': profile_dict[id]['answer']
        })
        
    return jsonify({
            'status code': 504,
            'message': 'Server is overloaded',
        })


'''
/delete_chat
Dùng để xoá một đoạn hội thoại
Dữ liệu json cần truyền:
{
    "uid": "user_id",
    "chat name": "chat_name"
}
Lưu ý về "chat name" đã được đề cập ở /create_chat
Mã trả về: 
* 200: Xoá đoạn chat thành công
* 404: Không tim thấy user id 
'''
@app.delete('/delete_chat')
def detele_chat():
    json_dict = request.get_json()

    uid = json_dict['uid']

    try: 
        auth.get_user(uid)
    except:
        return jsonify({
            'status code': 404,
            'message': 'Cannot find user id'
        })
    

    chat_name = json_dict['chat name']

    ref.child(uid).child('chat').child(chat_name).delete()

    return jsonify({
        'status code': 200,
        'message': 'Delete completed',
    })

if __name__ == '__main__':
    q = Queue()
    t = Thread(target=check_waiting_list, args=(1,15))
    c = Thread(target=cleaner)
    p = Thread(target=process)
    t.start()
    p.start()
    c.start()
    app.run()
    q.join()
    task_done = True
    t.join()
    p.join()
    c.join()