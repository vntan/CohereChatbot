from flask import Flask, request, jsonify
from firebase_admin import auth

import user_process
from user_process import user_waiting_list, api_keys, task_done, cred_obj, default_app, ref, process_main

from queue import Queue
from threading import Thread
import time
import uuid

app = Flask(__name__)  

'''
URL: /getHistoricalChat
Method: POST
Description: Get all of user's historical chat names
Data Request: {
    "uid": User's ID
}
Return Value: {
    "listHistoricalChats": array contains user's historical chat names and ids
}
Error Code:
404: Cannot find user id
'''
@app.post('/getHistoricalChat')
def get_information():
    json_dict = request.get_json()
    uid = json_dict['uid']

    try: 
        auth.get_user(uid)
    except:
        return 'Cannot find user id', 404

    all_user_chat = ref.child(uid).child('chat').get()

    history_chats = []
    if all_user_chat:
        for key, value in all_user_chat.items():
            history_chats.append({
                "chatID": key,
                "chatName": value["chat name"]
            })

    history_chats.reverse()
    return jsonify({
        'listHistoricalChats': history_chats
    })
        

'''
URL: /getOneChat
Method: POST
Description: Get one chat messages base on chat ID
Data Request:
{
    "uid": User's ID,
    "chatID": Chat ID
}
Return Value: {
    "userChat": array contains user's chat
}
Error Code:
400: Cannot find chat with requested chat ID
404: Cannot find user id 
'''
@app.post('/getOneChat')
def get_chat():
    json_dict = request.get_json()
    uid = json_dict['uid']

    try: 
        auth.get_user(uid)
    except:
        return 'Cannot find user id', 404

    chat_id = json_dict['chatID']

    user_chat = ref.child(uid).child('chat').child(chat_id).child('conversation').get()

    if user_chat:
        user_chat = list(user_chat.values())
        return jsonify({
            'userChat': user_chat
        })
    else:
        return 'No chat found', 400
    

'''
URL: /createChat
Method: POST
Description: Create a chat base on chat name
Data Request:
{
    "uid": User's ID,
    "chatName": Chat name
}
Return Value: {
    "chatID": Chat ID,
    "newChat": First message of a chat
}
Error Code:
404: Cannot find user id 
'''
@app.post('/createChat')
def create_chat():
    json_dict = request.get_json()
    uid = json_dict['uid']

    try: 
        auth.get_user(uid)
    except:
        return 'Cannot find user id', 404
    
    chat_name = json_dict['chatName']

    chat_id = str(uuid.uuid1())
    
    chat_ref = ref.child(uid).child('chat').child(chat_id)

    chat_ref.child('chat name').set(chat_name)
    chat_ref.child('conversation').push('Hello! What can I help you?')
    chat_ref.child('summarized conversation').push('Cohere: Hello! What can I help you?')

    return jsonify({
        'chatID': chat_id,
        'newChat': 'Hello! What can I help you?'
    })


'''
URL: /question
Method: POST
Description: Questioning Cohere
Data Request:
{
    "uid": User's ID,
    "chatID": Chat ID,
    "question": Question
}
Return Value: {
    "answer": Cohere response
}
Error Code:
400: Cannot find chat with requested chat ID
404: Cannot find user id 
504: Server is overloaded
'''
@app.post('/question')
def ask_question():
    json_dict = request.get_json()

    uid = json_dict['uid']

    try: 
        auth.get_user(uid)
    except:
        return 'Cannot find user id', 404
    

    chat_id = json_dict['chatID']
    chat_ref = ref.child(uid).child('chat').child(chat_id)

    if not chat_ref.child('chat name').get():
        return 'Cannot find chat', 400
    
    
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
            'answer': profile['answer']
        })
        
    return 'Server is overloaded', 504


'''
URL: /renameChat
Method: POST
Description: Deleta a chat base on chat name
Data Request:
{
    "uid": User's ID,
    "chatID": Chat ID,
    "newChatName": New chat name
}
Return Value: {
    "code": 200 (successfully renamed)
}
Error Code:
400: Cannot find chat with requested chat ID
404: Cannot find user id 
'''
@app.post('/renameChat')
def rename_chat():
    json_dict = request.get_json()

    uid = json_dict['uid']

    try: 
        auth.get_user(uid)
    except:
        return 'Cannot find user id', 404
    
    chat_id = json_dict['chatID']
    chat_ref = ref.child(uid).child('chat').child(chat_id)

    if not chat_ref.child('chat name').get():
        return 'Cannot find chat', 400
    
    new_chat_name = json_dict['newChatName']

    chat_ref.child('chat name').set(new_chat_name)

    return jsonify({
        "code": 200,
    })


'''
URL: /deleteChat
Method: POST
Description: Deleta a chat base on chat name
Data Request:
{
    "uid": User's ID,
    "chatID": Chat ID
}
Return Value: {
    "code": 200 (successfully deleted)
}
Error Code:
404: Cannot find user id 
'''
@app.post('/deleteChat')
def detele_chat():
    json_dict = request.get_json()

    uid = json_dict['uid']

    try: 
        auth.get_user(uid)
    except:
        return 'Cannot find user id', 404
    

    chat_id = json_dict['chatID']

    ref.child(uid).child('chat').child(chat_id).delete()

    return jsonify({
        "code": 200,
    })

if __name__ == '__main__':
    q = Queue()
    t = Thread(target=process_main, args=())

    t.start()
    app.run()
    q.join()
    user_process.task_done = True
    t.join()