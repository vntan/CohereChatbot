from flask import Flask, request, jsonify
from cohere_class import CoHere
import hashlib
import firebase_admin
from firebase_admin import auth
from firebase_admin import db

from queue import Queue
import uuid
from threading import Thread
import time


user_waiting_list = {
    'user_queue': [],
    'users': {}
}

api_keys = [
    {"key": "t7PsmTR4WNiJDsYIGaUqzK8XFF2M8EAdxDNXtHqk", 
     'count': 5, 'ttlc': -1,
     'estimateGeneration': 5000, 'ttlg': -1}, 
     {"key": "l7WbJRkNdyQWee0Qxmrey2ZOLsyXrFilU9fxKgVq", 
     'count': 5, 'ttlc': -1,
     'estimateGeneration': 5000, 'ttlg': -1}
]

task_done = False

cred_obj = firebase_admin.credentials.Certificate('./coherechatbot.json')
default_app = firebase_admin.initialize_app(cred_obj, {
	'databaseURL':'https://coherechatbot-default-rtdb.asia-southeast1.firebasedatabase.app/'
	})

ref = db.reference("/")
   
def delete_indicator(text):
    return text.replace("You: ", "").replace("Cohere: ", "")

def fill_slot(user_waiting_list, temp_queue, result, max_users):
    for user in temp_queue:
        user_str = user.split('-')
        userID = user_str[0]
        questionID = user_str[1]

        if user_waiting_list["users"][userID][questionID]["isServed"]:
            continue
            
        result.append({
            'userID': userID,
            'questionID': questionID,
            'data': user_waiting_list["users"][userID][questionID]["data"],
        })
        
        if len(result) == max_users: break

    return result

def add_user(user, result):
    user_str = user.split('-')
    userID = user_str[0]
    questionID = user_str[1]

    if user_waiting_list["users"][userID][questionID]["isServed"]:
        return result

    result.append({
        'userID': userID,
        'questionID': questionID,
        'data': user_waiting_list["users"][userID][questionID]["data"],
    })

    return result

def select_user_to_serve(user_waiting_list, max_users=5, time_limit=60, slot_limit=5, timeout=300):

    timeout_list = []

    result = []
    temp_queue = []
    num_del = 0

    for user in user_waiting_list["user_queue"]:
        if len(result) == max_users: break

        user_str = user.split('-')
        userID = user_str[0]
        questionID = user_str[1]

        if user_waiting_list["users"][userID][questionID]["isServed"]:
            continue

        if time.time() - user_waiting_list["users"][userID][questionID]['time'] > timeout:
            timeout_list.append({
                'userID': userID,
                'questionID': questionID,
                'data': user_waiting_list["users"][userID][questionID]["data"],
            })
            continue

        list_user_str = ''
        for process_user in result:
            list_user_str += process_user['userID']
            list_user_str += ' '
        print(list_user_str)

        if userID in list_user_str:
            temp_queue.append(user)
            if len(temp_queue) > slot_limit:
                result = add_user(temp_queue.pop(0), result)
            continue
        else:
            for waited_user in temp_queue:
                waited_user_str = waited_user.split('-')
                waited_userID = waited_user_str[0]
                waited_questionID = waited_user_str[1]

                if user_waiting_list["users"][waited_userID][waited_questionID]["isServed"]:
                    continue

                time_delta = user_waiting_list["users"][userID][questionID]["time"] - \
                                user_waiting_list["users"][waited_userID][waited_questionID]["time"]
                
                if time_delta > time_limit and len(result) < max_users:
                    result.append({
                        'userID': waited_userID,
                        'questionID': waited_questionID,
                        'data': user_waiting_list["users"][waited_userID][waited_questionID]["data"],
                    })
                    num_del += 1
                else: break

        if len(result) == max_users: break

        result.append({
            'userID': userID,
            'questionID': questionID,
            'data': user_waiting_list["users"][userID][questionID]["data"],
        })
    
    if len(result) < max_users:
        for _ in range(num_del):
            temp_queue.pop(0)
        result = fill_slot(user_waiting_list, temp_queue, result, max_users)

    return result, timeout_list

'''
Đếm API key cho hiện có để process
'''
def processAPIKey():
    global api_keys

    APIs_available = []
    for key in api_keys:
        if key["count"] == 0 and key["ttlc"] == -1:
            key["ttlc"] = time.time()

        if key["count"] == 0 and key["ttlc"] != -1:
            delta = (time.time() -  key["ttlc"])
            if delta > 60:  
                key["ttlc"] = -1
                key["count"] = 5

        if key["estimateGeneration"] == 0 and key["ttlg"] == -1:
            key["ttlg"] = time.time()

        if key["estimateGeneration"] == 0 and key["ttlg"] != -1:
            delta = (time.time() -  key["ttlg"])
            if delta > 2592000:  
                key["ttlg"] = -1
                key["estimateGeneration"] = 5000
            
       
        if key["count"] > 0 and key["estimateGeneration"] > 0:
            APIs_available += [key["key"]] * min(key["count"], key["estimateGeneration"])
    return APIs_available

'''
Xử lí một user trong process_queue
'''
def processCohere(profile, key):
    global user_waiting_list, api_keys

    print("Process ---------------------", profile)
    try:
        uid = profile["userID"]
        questionid = profile["questionID"]
        user_waiting_list['users'][uid][questionid]["isServed"] = True
        user_waiting_list["user_queue"].remove(f"{uid}-{questionid}")

        json_dict = profile['data']
        chat_name = json_dict['chat name']
        chat_ref = ref.child(uid).child('chat').child(chat_name)

        question = json_dict['question']
        conv_dict = chat_ref.child('summarized conversation').get()

        cohere_bot = CoHere(key)
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

        for api in api_keys:
            if api["key"] == key: 
                api["count"] -= 1
                api["estimateGeneration"] -= 1

        user_waiting_list['users'][uid][questionid]['answer'] = answer
        user_waiting_list['users'][uid][questionid]['code'] = 200
        user_waiting_list['users'][uid][questionid]['status'] = True

    except Exception as error:
        print(error)
        time.sleep(10)

    print("Terminate process uid")

'''
Xử lí một user quá thời gian cho phép trong db
'''
def processTimeout(profile):
    global user_waiting_list

    print("Process timeout ---------------------", profile)
    uid = profile["userID"]
    questionid = profile["questionID"]
    user_waiting_list['users'][uid][questionid]["isServed"] = True
    user_waiting_list["user_queue"].remove(f"{uid}-{questionid}")
    user_waiting_list['users'][uid][questionid]['code'] = 504
    user_waiting_list['users'][uid][questionid]['status'] = True

    print("Terminate process uid timeout")

'''
Xử lí chính cho question
'''
def process_main():

    global task_done
    global user_waiting_list
    
    while True:
        if task_done: break

        #process the api keys
        api_keys = processAPIKey()
        
        if len(api_keys) == 0: 
            print('Relax Cohere API')
            time.sleep(1)
            continue

        
        max_users = len(api_keys)
        profiles_queue, timeout_queue = select_user_to_serve(user_waiting_list, max_users)

        process_thread = []
        for profile, key in zip(profiles_queue, api_keys):
            t = Thread(target=processCohere, args=(profile, key,))
            process_thread.append(t)
            t.start()

        for profile in timeout_queue:
            t = Thread(target=processTimeout, args=(profile,))
            process_thread.append(t)
            t.start()
        
        for process in process_thread:
            process.join()

    print("Terminate process main")
    

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
    
    
    profile = {
        'isServed': False,
        'data': json_dict,
        'status': False,
        'time': time.time()
    }

    global user_waiting_list
    
    if uid not in user_waiting_list['users'].keys():
        user_waiting_list['users'][uid] = {}

    idQuestion = str(time.time())
    user_waiting_list["user_queue"].append(f"{uid}-{idQuestion}")
    user_waiting_list['users'][uid][idQuestion] = profile

    while not user_waiting_list['users'][uid][idQuestion]["status"]:
        time.sleep(1)

    profile = user_waiting_list['users'][uid][idQuestion].copy()
    num_questions = len(user_waiting_list['users'][uid].keys())
    if num_questions == 1: user_waiting_list['users'].pop(uid)
    else: user_waiting_list['users'][uid].pop(idQuestion)

   


    if profile['code'] == 200:
        return jsonify({
            'status code': 200,
            'message': 'Complete',
            'answer': profile['answer']
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
    t = Thread(target=process_main, args=())

    t.start()
    app.run()
    q.join()
    task_done = True
    t.join()