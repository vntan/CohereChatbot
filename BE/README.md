# Cohere Chatbot Project

Here is BE folder

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
