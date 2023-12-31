from flask import Blueprint, request, jsonify
from utilities.cohere_apis import CoHere
from utilities.Firebase.firebase_config import auth, db
from user_serve import answerUserQuestion, add_human_text, add_bot_text
import uuid

#
import user_serve
import time
#

apis = Blueprint('apis', __name__, url_prefix='/apis')

@apis.get('/testing')
def hello():
    return "<p>Hello, World!</p>"


@apis.post('/getHistoricalChat')
def getHistoricalChat():
    json_dict = request.get_json()

    try:
        uid = json_dict['uid']
        auth.get_user(uid)
    except:
        return 'Cannot find user id', 404

    all_user_chat = db.reference(f"/{uid}/chats").get()

    history_chats = []
    if all_user_chat:
        for key, value in all_user_chat.items():
            history_chats.insert(0, {
                "chatID": key,
                "chatName": value["chatName"],
                "createTime": value["createTime"]
            })

    return jsonify({
        'listHistoricalChats': history_chats
    })


@apis.post('/loadChat')
def loadChat():
    json_dict = request.get_json()

    try:
        uid = json_dict['uid']
        auth.get_user(uid)
    except:
        return 'Cannot find user id', 404

    try:
        chat_id = json_dict['chatID']

        user_chat = db.reference(
            f"/{uid}/chats/{chat_id}/conversation").get()
        user_chat = list(user_chat.values())

        return jsonify({
            'userChat': user_chat
        })
    except:
        return 'No chat found', 400
    
@apis.post('/loadProcess')
def loadProcess():
    json_dict = request.get_json()

    try:
        uid = json_dict['uid']
        auth.get_user(uid)
    except:
        return 'Cannot find user id', 404

    try:
        chat_id = json_dict['chatID']
        chat_ref = db.reference(f"/{uid}/chats/{chat_id}")

        while(True):
            user_chat = chat_ref.child('conversation').get()
            user_chat = list(user_chat.values())

            if len(user_chat) % 2 == 0:
                time.sleep(1)
            else:
                break
            

        return jsonify({
            'userChat': user_chat
        })
    except:
        return 'No chat found', 400


@apis.post('/createChat')
def create_chat():
    json_dict = request.get_json()

    try:
        uid = json_dict['uid']
        auth.get_user(uid)
    except:
        return 'Cannot find user id', 404

    try:
        chat_name = json_dict['chatName']
        
        uid1 = uuid.uuid1()

        id = f'{uid1.time}-{uid1.node}'

        chat_ref = db.reference(f"/{uid}/chats/{id}")

        create_time = time.ctime(time.time())

        chat_ref.child('chatName').set(chat_name)

        chat_ref.child('createTime').set(create_time)

        chat_ref.child('conversation').push({
            'message': 'Hello! What can I help you?',
            'time': create_time
        })

        chat_ref.child('summarized').push('Cohere: Hello! What can I help you?')

        return jsonify({
            'chatID': id,
            'chatName': chat_name,
            'createTime': create_time
        })
    except Exception as error:
        print(error)
        return 'Cannot add chats', 504


@apis.post('/renameChat')
def rename_chat():
    json_dict = request.get_json()

    try:
        uid = json_dict['uid']
        auth.get_user(uid)
    except:
        return 'Cannot find user id', 404

    try:
        chat_id = json_dict['chatID']
        new_chat_name = json_dict['newChatName']

        if not db.reference(f"/{uid}/chats/{chat_id}/chatName").get():
            return 'No chat found', 400

        db.reference(f"/{uid}/chats/{chat_id}").update({
            'chatName': new_chat_name
        })

        return jsonify({
            "code": 200,
        })
    except Exception as error:
        print(error)
        return 'Cannot rename the chat', 504


@apis.post('/deleteChat')
def detele_chat():
    json_dict = request.get_json()

    try:
        uid = json_dict['uid']
        auth.get_user(uid)
    except:
        return 'Cannot find user id', 404

    try:
        chat_id = json_dict['chatID']

        db.reference(f"/{uid}/chats/{chat_id}").delete()

        return jsonify({
            "code": 200,
        })
    except Exception as error:
        print(error)
        return 'Cannot delete the chat', 504


@apis.get('/models')
def get_models_name():
    co = CoHere(None)
    return co.get_models()


@apis.post('/question')
def ask_question():
    json_dict = request.get_json()

    try:
        uid = json_dict['uid']
        auth.get_user(uid)
    except:
        return 'Cannot find user id', 404

    try:
        chat_id = json_dict['chatID']
        chat_ref = db.reference(f"/{uid}/chats/{chat_id}")

        if not chat_ref.child('chatName').get():
            return 'No chat found', 404
        
        
        model = json_dict['model'] if 'model' in json_dict.keys() else ""
        
        question_time = time.time()

        question = json_dict['question']

        answer, answer_time = answerUserQuestion(uid, chat_id, question, model, chat_ref, question_time)

        question_time = time.ctime(question_time)

        if answer == 400:
            return "Two question at the same time!", 400
        
        if answer != None:
            return jsonify({
                'answer': answer,
                'questionTime': question_time,
                'answerTime': answer_time
            })
        else: 
            return jsonify({
                'answer': 'Cannot answer the question right now',
                'questionTime': question_time,
                'answerTime': answer_time
            })

    except Exception as error:
        print(error)
        return f'Unexpected error: {error}', 500

@apis.get('/status')
def get_status():
    return {
        'time': time.ctime(time.time()),
        'waiting': {
            'len': len(user_serve.wait_list),
            'users': user_serve.wait_list
        },
        'processing': {
            'len': len(user_serve.process_list),
            'users': user_serve.process_list
        }
    }