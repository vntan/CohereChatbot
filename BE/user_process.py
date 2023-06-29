from cohere_class import CoHere

import firebase_admin
from firebase_admin import auth
from firebase_admin import db
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

