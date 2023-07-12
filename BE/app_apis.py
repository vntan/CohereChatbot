from flask import Blueprint, request, jsonify
from utilities.Firebase.firebase_config import auth, db
from user_serve import answerUserQuestion
import uuid

#
import user_serve
import time
#

apis = Blueprint('apis', __name__, url_prefix='/apis')


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
                "chatName": value["chatName"]
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


@apis.post('/createChat')
def create_chat():
    json_dict = request.get_json()

    try:
        uid = json_dict['uid']
        auth.get_user(uid)
    except:
        return 'Cannot find user id', 404

    try:
        chatName = json_dict['chatName']
        
        uid1 = uuid.uuid1()

        id = f'{uid1.time}-{uid1.node}'

        chat_ref = db.reference(f"/{uid}/chats/{id}")

        chat_ref.child('chatName').set(chatName)
        
        chat_ref.child('conversation').push('Hello! What can I help you?')
        chat_ref.child('summarized').push('Cohere: Hello! What can I help you?')

        return jsonify({
            'chatID': id,
            'chatName': chatName
        })
    except Exception as error:
        print(error)
        return 'Cannot add chats', 404


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
            raise Exception('Cannot find chat')

        db.reference(f"/{uid}/chats/{chat_id}").update({
            'chatName': new_chat_name
        })

        return jsonify({
            "code": 200,
        })
    except Exception as error:
        print(error)
        return 'Cannot rename the chat', 404


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
        return 'Cannot delete the chat', 404


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
            raise Exception('Cannot find chat')

        question = json_dict['question']
        answer = answerUserQuestion(uid, chat_id, question)
        
        if answer != None:
            return jsonify({
                'answer': answer
            })
        else: raise Exception('Cannot answer the question')

    except Exception as error:
        return str(error), 504

    # profile = {
    #     'isServed': False,
    #     'data': json_dict,
    #     'status': False,
    #     'time': time.time()
    # }

    # global user_waiting_list

    # if uid not in user_waiting_list['users'].keys():
    #     user_waiting_list['users'][uid] = {}

    # idQuestion = str(time.time())
    # user_waiting_list["user_queue"].append(f"{uid}-{idQuestion}")
    # user_waiting_list['users'][uid][idQuestion] = profile

    # while not user_waiting_list['users'][uid][idQuestion]["status"]:
    #     time.sleep(1)

    # profile = user_waiting_list['users'][uid][idQuestion].copy()
    # num_questions = len(user_waiting_list['users'][uid].keys())
    # if num_questions == 1: user_waiting_list['users'].pop(uid)
    # else: user_waiting_list['users'][uid].pop(idQuestion)

    # if profile['code'] == 200:
    #     return jsonify({
    #         'answer': profile['answer']
    #     })

    # return 'Server is overloaded', 504
@apis.post('/status')
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