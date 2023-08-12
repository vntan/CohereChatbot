from utilities.cohere_apis import CoHere
from threading import Thread
import time
from utilities.Firebase.firebase_config import auth, db

import os
from pathlib import Path
from dotenv import load_dotenv
import json

dotenv_path = Path('./.env')
load_dotenv(dotenv_path=dotenv_path)

API_KEY = os.getenv('API_KEY')
f = open(API_KEY)
api_keys = json.load(f)
f.close()

user_waiting_list = {
    'user_queue': [],
    'users': {},
    'user_id_chat': []
}

finished_serve = False

#
wait_list = {}
process_list = {}
#



def check_uid_chatID(uid, chatID):
    global user_waiting_list
    return f"{uid}-{chatID}" in user_waiting_list['user_id_chat']

def check_uid_chatID_quesTime(uid, chatID, question_time):
    global user_waiting_list
    for user_ques in user_waiting_list['user_id_chat']:
        if f"{uid}-{chatID}" in user_ques and float(user_ques.split('-')[3]) < question_time: # chat id = "uuid-time.time()"
            return True
    return False

def answerUserQuestion(uid, chatID, question, model, chat_ref, question_time):
    global user_waiting_list
    if check_uid_chatID(uid, chatID):
        return 400, time.ctime(time.time())
    user_waiting_list['user_id_chat'].append(f"{uid}-{chatID}-{str(question_time)}")
    time.sleep(0.5)
    if check_uid_chatID_quesTime(uid, chatID, question_time):
        user_waiting_list['user_id_chat'].remove(f"{uid}-{chatID}-{str(question_time)}")
        return 400, time.ctime(time.time())
    else:
        chat_ref.child('conversation').push({
            'message': question,
            'time': time.ctime(question_time)
        })
        chat_ref.child('summarized').push(add_human_text(question))
    


    profile = {
        'isServed': False,
        'data': {
            'uid': uid,
            'chatID': chatID,
            'question': question,
            'model': model
        },
        'status': False,
        'timeout': question_time
    }
    if uid not in user_waiting_list['users'].keys():
        user_waiting_list['users'][uid] = {}

    idQuestion = str(question_time)
    user_waiting_list["user_queue"].append(f"{uid}-{idQuestion}")
    user_waiting_list['users'][uid][idQuestion] = profile

    #
    wait_list[f"{uid}-{idQuestion}"] = {
        'uid': uid,
        'chatID': chatID,
        'question': question
    }
    #

    while not user_waiting_list['users'][uid][idQuestion]["status"]:
        time.sleep(1)

    profile = user_waiting_list['users'][uid][idQuestion].copy()
    num_questions = len(user_waiting_list['users'][uid].keys())
    if num_questions == 1: user_waiting_list['users'].pop(uid)
    else: user_waiting_list['users'][uid].pop(idQuestion)

    if profile['code'] == 200:
        user_waiting_list['user_id_chat'].remove(f"{uid}-{chatID}-{str(question_time)}")
        return profile['answer'], profile['answerTime']
    else: 
        answer_time = time.ctime(time.time())
        chat_ref.child('conversation').push({
            'message': 'Cannot answer the question right now',
            'time': answer_time
        })
        chat_ref.child('summarized').push(add_bot_text('Cannot answer the question right now'))
        user_waiting_list['user_id_chat'].remove(f"{uid}-{chatID}-{str(question_time)}")
        return None, time.ctime(time.time())


def delete_indicator(text):
    return text.replace("You: ", "").replace("Cohere: ", "")

def add_human_text(text):
    return 'You: ' + text

def add_bot_text(text):
    return 'Cohere: ' + text

def fill_slot(user_waiting_list, temp_queue, max_users, result, list_user_str):
    for user in temp_queue:
        user_str = user.split('-')
        userID = user_str[0]
        questionID = user_str[1]
        chatID = user_waiting_list["users"][userID][questionID]["data"]["chatID"]

        if user_waiting_list["users"][userID][questionID]["isServed"]:
            continue

        if f"{userID}-{chatID}" in list_user_str:
            continue

        result.append({
            'userID': userID,
            'questionID': questionID,
            'data': user_waiting_list["users"][userID][questionID]["data"],
        })
        list_user_str += f"{userID}-{chatID} "

        if len(result) == max_users:
            break

    return result


def add_user(user_waiting_list, user, result, list_user_str):
    user_str = user.split('-')
    userID = user_str[0]
    questionID = user_str[1]
    chatID = user_waiting_list["users"][userID][questionID]["data"]["chatID"]

    if user_waiting_list["users"][userID][questionID]["isServed"]:
        return result, list_user_str
    
    if f"{userID}-{chatID}" in list_user_str:
        return result, list_user_str

    result.append({
        'userID': userID,
        'questionID': questionID,
        'data': user_waiting_list["users"][userID][questionID]["data"],
    })
    list_user_str += f"{userID}-{chatID} "

    return result, list_user_str


def select_user_to_serve(user_waiting_list, max_users=5, time_limit=60, slot_limit=5, timeout=300):

    timeout_list = []

    result = []
    temp_queue = []

    list_user_str = ''

    for user in user_waiting_list["user_queue"]:
        if len(result) == max_users:
            break
        
        try:
            user_str = user.split('-')
            userID = user_str[0]
            questionID = user_str[1]
            model =  user_waiting_list["users"][userID][questionID]["data"]["model"]
            chatID = user_waiting_list["users"][userID][questionID]["data"]["chatID"]
        except:
            continue

        if user_waiting_list["users"][userID][questionID]["isServed"]:
            continue

        if time.time() - user_waiting_list["users"][userID][questionID]['timeout'] > timeout:
            timeout_list.append({
                'userID': userID,
                'questionID': questionID,
                'data': user_waiting_list["users"][userID][questionID]["data"],
            })
            continue


        if userID in list_user_str:
            temp_queue.append(user)
            if len(temp_queue) > slot_limit:
                result, list_user_str = add_user(user_waiting_list, temp_queue.pop(0), result, list_user_str)
            continue
        else:
            for waited_user in temp_queue:
                waited_user_str = waited_user.split('-')
                waited_userID = waited_user_str[0]
                waited_questionID = waited_user_str[1]
                waited_chatID = user_waiting_list["users"][waited_userID][waited_questionID]["data"]["chatID"]

                if user_waiting_list["users"][waited_userID][waited_questionID]["isServed"]:
                    continue

                if f"{waited_userID}-{waited_chatID}" in list_user_str:
                    temp_queue.remove(waited_user)
                    continue

                time_delta = user_waiting_list["users"][userID][questionID]["timeout"] - \
                    user_waiting_list["users"][waited_userID][waited_questionID]["timeout"]

                if time_delta > time_limit and len(result) < max_users:
                    result.append({
                        'userID': waited_userID,
                        'questionID': waited_questionID,
                        'data': user_waiting_list["users"][waited_userID][waited_questionID]["data"],
                    })
                    list_user_str += f"{waited_userID}-{waited_chatID} "
                    temp_queue.remove(waited_user)
                else:
                    break

        if len(result) == max_users:
            break

        result.append({
            'userID': userID,
            'questionID': questionID,
            'model': model,
            'data': user_waiting_list["users"][userID][questionID]["data"],
        })
        list_user_str += f"{userID}-{chatID} "

    if len(result) < max_users:
        result = fill_slot(user_waiting_list, temp_queue, max_users, result, list_user_str)

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
            delta = (time.time() - key["ttlc"])
            if delta > 60:
                key["ttlc"] = -1
                key["count"] = 5

        if key["estimateGeneration"] == 0 and key["ttlg"] == -1:
            key["ttlg"] = time.time()

        if key["estimateGeneration"] == 0 and key["ttlg"] != -1:
            delta = (time.time() - key["ttlg"])
            if delta > 2592000:
                key["ttlg"] = -1
                key["estimateGeneration"] = 5000

        if key["count"] > 0 and key["estimateGeneration"] > 0:
            APIs_available += [key] * \
                min(key["count"], key["estimateGeneration"])
    return APIs_available


'''
Xử lí một user trong process_queue
'''

#
def move_user(uid, questionid):
    global wait_list, process_list

    process_list[f"{uid}-{questionid}"] = wait_list[f"{uid}-{questionid}"].copy()
    wait_list.pop(f"{uid}-{questionid}", None)


def del_user(uid, questionid):
    global process_list
    process_list.pop(f"{uid}-{questionid}", None)
#

def processCohere(profile, key):
    global user_waiting_list, api_keys

    print("Process ---------------------", profile)
    try:
        uid = profile["userID"]
        questionid = profile["questionID"]
        model = profile["model"]
        user_waiting_list['users'][uid][questionid]["isServed"] = True
        user_waiting_list["user_queue"].remove(f"{uid}-{questionid}")

        #
        move_user(uid, questionid)
        #

        json_dict = profile['data']
        chat_id = json_dict['chatID']


        chat_ref = db.reference(f"/{uid}/chats/{chat_id}")

        conv_dict = chat_ref.child('summarized').get()

       
        cohere_bot = CoHere(key['key'])
        summarized, conv_list, answer, answer_time = cohere_bot.asked(conv_dict, model=model, key=key)

        #
        print("Done answering", time.ctime(time.time()))
        #

        if chat_ref.child('chatName').get():
            chat_ref.child('conversation').push({
                'message': delete_indicator(conv_list[-1]),
                'time': answer_time
            })

            if summarized:
                chat_ref.child('summarized').delete()
                for i in range(len(conv_list)):
                    chat_ref.child('summarized').push(conv_list[i])
            else:
                chat_ref.child('summarized').push(conv_list[-1])

        

        for api in api_keys:
            if api["key"] == key:
                api["count"] -= 1
                api["estimateGeneration"] -= 1


        user_waiting_list['users'][uid][questionid]['answer'] = answer
        user_waiting_list['users'][uid][questionid]['answerTime'] = answer_time
        user_waiting_list['users'][uid][questionid]['code'] = 200
        user_waiting_list['users'][uid][questionid]['status'] = True

    except Exception as error:
        print(error)
        user_waiting_list['users'][uid][questionid]['code'] = 504
        user_waiting_list['users'][uid][questionid]['status'] = True


    #
    del_user(uid, questionid)
    #
    
    print("Terminate process uid")

'''
Xử lí một user quá thời gian cho phép trong db
'''
#
def del_timeout_user(uid, questionid):
    global wait_list
    wait_list.pop(f"{uid}-{questionid}", None)
#

def processTimeout(profile):
    global user_waiting_list

    print("Process timeout ---------------------", profile)
    uid = profile["userID"]
    questionid = profile["questionID"]
    user_waiting_list['users'][uid][questionid]["isServed"] = True
    user_waiting_list["user_queue"].remove(f"{uid}-{questionid}")
    user_waiting_list['users'][uid][questionid]['code'] = 504
    user_waiting_list['users'][uid][questionid]['status'] = True

    #
    del_timeout_user(uid, questionid)
    #
    print("Terminate process uid timeout")


'''
Xử lí chính cho question
'''


def serving_user():

    global finished_serve
    global user_waiting_list

    while True:
        if finished_serve:
            break

        # process the api keys
        api_keys = processAPIKey()

        if len(api_keys) == 0:
            print('Relax Cohere API')
            time.sleep(1)
            continue

        max_users = len(api_keys)
        profiles_queue, timeout_queue = select_user_to_serve(
            user_waiting_list, max_users)

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
