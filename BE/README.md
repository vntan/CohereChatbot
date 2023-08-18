# Cohere Chatbot Project

Here is BE folder


# Set up backend
Go to .env file, modify these variable to run in your database/environment

### 1. DATABASE_URL
Firebase Realtime Database url, get when create Realtime Database project, detail [here](https://firebase.google.com/docs/database/admin/start)

### 2. CERFTIFICATE
Google Firebase private key **json** file, detail [here](https://firebase.google.com/docs/admin/setup#initialize_the_sdk_in_non-google_environments)

### 3. API_KEY
Link to api key **json** file.
File contain list of JSON object, each object follow this description:
[  
&nbsp;&nbsp;{  
&nbsp;&nbsp;&nbsp;&nbsp;"**key**": "Cohere personal API Trial key",  
&nbsp;&nbsp;&nbsp;&nbsp;"**count**": 5,  
&nbsp;&nbsp;&nbsp;&nbsp;"**ttlc**": -1,  
&nbsp;&nbsp;&nbsp;&nbsp;"**estimateGeneration**": 5000,  
&nbsp;&nbsp;&nbsp;&nbsp;"**ttlg**": -1  
&nbsp;&nbsp;},  
&nbsp;&nbsp;{  
&nbsp;&nbsp;&nbsp;&nbsp;...  
&nbsp;&nbsp;},  
&nbsp;&nbsp;...  
]  

Note:
* **Bold** name is fixed variable name, unchangable.
* Normal name is changable.

### 4. MODEL
Link to model **json** file.
File contain JSON object, following this description with **bold** name is fixed variable name:
{  
&nbsp;&nbsp;"Model name 1": {  
&nbsp;&nbsp;&nbsp;&nbsp;"**model_id**": {  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"Cohere personal API Trial key": "Model name when call Co.Generate",  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"Cohere personal API Trial key": "Model name when call Co.Generate",  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;...  
&nbsp;&nbsp;&nbsp;&nbsp;},  
&nbsp;&nbsp;&nbsp;&nbsp;"**model_max_tokens**": 4096  
&nbsp;&nbsp;},  
&nbsp;&nbsp;"Model name 2":  {  
&nbsp;&nbsp;&nbsp;&nbsp;...  
&nbsp;&nbsp;},  
&nbsp;&nbsp;...  
}  

Note:
* **Bold** name is fixed variable name, unchangable.
* Normal name is changable.


# Callable API 

### 1. /getHistoricalChat
URL: /getHistoricalChat  
Method: POST  
Description: Get all of user's historical chat names  
Data Request:  
{  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"uid": User's ID  
}  
Return Value:   
{  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"listHistoricalChats": Array contains user's historical chat names, ids and create time, each element in array will follow this format:  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"chatID": Chat ID,  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"chatName": Chat name,  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"createTime": Create chat time  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}  
}  
Error Code:  
404: Cannot find user id  


### 2. /loadChat
URL: /loadChat  
Method: POST  
Description: Get one chat messages base on chat ID  
Data Request:  
{  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"uid": User's ID,  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"chatID": Chat ID  
}  
Return Value:  
{  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"userChat": Array contains user's chat, each element in array will follow this format:  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"message": User/Bot message,  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"time": User question/Bot answer time  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}  
}  
Error Code:  
400: Cannot find chat with requested chat ID  
404: Cannot find user id   

### 3. /loadProcess
URL: /loadProcess  
Method: POST  
Description: Get one chat messages base on chat ID, waiting till get all message if Cohere is serving this chat.  
Data Request:  
{  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"uid": User's ID,  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"chatID": Chat ID  
}  
Return Value:  
{  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"userChat": Array contains user's chat, each element in array will follow this format:  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"message": User/Bot message,  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"time": User question/Bot answer time  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}  
}  
Error Code:  
400: Cannot find chat with requested chat ID  
404: Cannot find user id 

### 4. /models
URL: /models  
Method: GET  
Description: Get all the model name (currently support command-nightly and viet-cqa) 

Return Value:  
[  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Model name 1
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Model name 2
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;...
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Model name n

]  

### 5. /createChat
URL: /createChat  
Method: POST  
Description: Create a chat base on chat name  
Data Request:  
{  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"uid": User's ID,  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"chatName": Chat name  
}  
Return Value:  
{  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"chatID": Chat ID,  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"chatName": Chat name,  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"createTime": Create chat time 
}  
Error Code:   
404: Cannot find user id  
504: Cannot create chat

### 6. /question
URL: /question  
Method: POST  
Description: Questioning Cohere  
Data Request:  
{  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"uid": User's ID,  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"chatID": Chat ID,  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"question": Question,
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"model": Model use for answer,
}  
Return Value:  
{  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"answer": Cohere response  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"questionTime": Server get question time,  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"answerTime": Cohere answered question time   
}  
Error Code:  
400: Many question at the same time
404: Cannot find chat with requested chat ID or Cannot find user id  
500: Unexpected error


### 7. /renameChat
URL: /renameChat  
Method: POST  
Description: Deleta a chat base on chat name  
Data Request:  
{  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"uid": User's ID,  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"chatID": Chat ID,  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"newChatName": New chat name  
}  
Return Value:  
{  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"code": 200 (successfully renamed)  
}  
Error Code:  
400: Cannot find chat with requested chat ID  
404: Cannot find user id   
504: Cannot rename the chat


### 8. /deleteChat
URL: /deleteChat  
Method: POST  
Description: Delete a chat base on chat name  
Data Request:  
{  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"uid": User's ID,  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"chatName": Chat name  
}  
Return Value:  
{  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"code": 200 (successfully deleted)  
}  
Error Code:  
404: Cannot find user id  
504: Cannot delete the chat








