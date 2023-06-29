from flask import Flask, request, jsonify
from firebase_admin import auth

import user_process
from user_process import user_waiting_list, api_keys, task_done, cred_obj, default_app, ref, process_main

from queue import Queue
from threading import Thread
import time

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
    user_process.task_done = True
    t.join()