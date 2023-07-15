# Cohere Chatbot Project

Here is BE folder

# Callable API 

### 1. /getHistoricalChat
URL: /getHistoricalChat  
Method: POST  
Description: Get all of user's historical chat names  
Data Request: {  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"uid": User's ID  
}  
Return Value: {  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"listHistoricalChats": array contains user's historical chat names and ids  
}  
Error Code:  
404: Cannot find user id  


### 2. /loadChat
URL: /loadChat  
Method: POST  
Description: Get one chat messages base on chat name  
Data Request: {  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"uid": User's ID,  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"chatID": Chat ID  
}  
Return Value: {  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"userChat": array contains user's chat  
}  
Error Code:  
400: Cannot find chat with requested chat ID  
404: Cannot find user id   


### 3. /createChat
URL: /createChat  
Method: POST  
Description: Create a chat base on chat name  
Data Request: {  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"uid": User's ID,  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"chatName": Chat name  
}  
Return Value: {  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"chatID": Chat ID,  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"newChat": First message of a chat  
}  
Error Code:   
404: Cannot find user id  
504: Cannot create chat

### 4. /question
URL: /question  
Method: POST  
Description: Questioning Cohere  
Data Request: {  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"uid": User's ID,  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"chatID": Chat ID,  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"question": Question  
}  
Return Value: {  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"answer": Cohere response 
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"questionTime": Server get question time,
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"answerTime": Cohere answered question time 
}  
Error Code:  
400: Cannot find chat with requested chat ID  
404: Cannot find user id  
504: Server is overloaded  


### 5. /renameChat
URL: /renameChat  
Method: POST  
Description: Deleta a chat base on chat name  
Data Request: {  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"uid": User's ID,  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"chatID": Chat ID,  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"newChatName": New chat name  
}  
Return Value: {  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"code": 200 (successfully renamed)  
}  
Error Code:  
400: Cannot find chat with requested chat ID  
404: Cannot find user id   
504: Cannot rename the chat


### 6. /deleteChat
URL: /deleteChat  
Method: POST  
Description: Delete a chat base on chat name  
Data Request: {  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"uid": User's ID,  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"chatName": Chat name  
}  
Return Value: {  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"code": 200 (successfully deleted)  
}  
Error Code:  
404: Cannot find user id  
504: Cannot delete the chat