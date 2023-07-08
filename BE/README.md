# Cohere Chatbot Project

Here is BE folder

# Các api có thể gọi  

### 1. /getHistoricalChat
URL: /getHistoricalChat  
Method: POST  
Description: Get all of user's historical chat names  
Data Request: {  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"uid": User's ID  
}  
Return Value: {  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"listHistoricalChats": array contains user's historical chat names  
}  
Error Code:  
404: Cannot find user id  


### 2. /getOneChat
URL: /getOneChat  
Method: POST  
Description: Get one chat messages base on chat name  
Data Request: {  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"uid": User's ID,  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"chatName": Chat name  
}  
Return Value: {  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"userChat": array contains user's chat  
}  
Error Code:  
400: Cannot find chat with requested chat name  
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
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"newChat": First message of a chat  
}  
Error Code:  
400: Cannot create with requested chat name  
404: Cannot find user id  

### 4. /question
URL: /question  
Method: POST  
Description: Questioning Cohere  
Data Request: {  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"uid": User's ID,  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"chatName": Chat name,  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"question": Question  
}  
Return Value: {  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"answer": Cohere response  
}  
Error Code:  
400: Cannot find chat with requested chat name  
404: Cannot find user id   
504: Server is overloaded  

### 5. /deleteChat
URL: /deleteChat  
Method: DELETE  
Description: Deleta a chat base on chat name  
Data Request: {  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"uid": User's ID,  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"chatName": Chat name  
}  
Return Value: {  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"code": 200 (successfully deleted)  
}  
Error Code:  
404: Cannot find user id  
