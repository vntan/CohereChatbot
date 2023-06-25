# Cohere Chatbot Project

Here is BE folder

# Các api có thể gọi  

### 1. /init
Dùng để lấy thông tin người dùng khi người dùng đăng nhập thành công (tất cả các đoạn chat)  
Dữ liệu json cần truyền: {"uid": "user_id"}  
Mã trả về:  
* 200: Thành công lấy về tất cả đoạn chat
* 204: Tìm thấy user id nhưng không có đoạn chat nào được ghi nhận
* 404: Không tim thấy user id  


### 2. /get_chat
Dùng để lấy một đoạn chat  
Dữ liệu json cần truyền: {"uid": "user_id", "chat name": "chat_name"}  
Lưu ý về "chat name" đã được đề cập ở /create_chat  
Mã trả về:  
* 200: Thành công lấy về đoạn chat
* 400: Không tìm thấy đoạn chat có tên tương ứng
* 404: Không tim thấy user id  


### 3. /create_chat
Dùng để tạo đoạn chat mới  
Dữ liệu json cần truyền: {"uid": "user_id", "chat name": "chat_name"}  
Lưu ý: "chat name" cần tránh những kí tự không được phép từ Firebase realtime database
"If you create your own keys, they must be UTF-8 encoded, can be a maximum of 768 bytes, 
and cannot contain ., $, #, [, ], /, or ASCII control characters 0-31 or 127. 
You cannot use ASCII control characters in the values themselves, either."  
Mã trả về:  
* 200: Tạo đoạn chat thành công
* 400: Không thể tạo đoạn chat
* 404: Không tim thấy user id    

### 4. /question
Dùng để hỏi cohere  
Dữ liệu json cần truyền: {"uid": "user_id", "chat name": "chat_name", "question": "question"}  
Lưu ý về "chat name" đã được đề cập ở /create_chat  
Mã trả về:  
* 200: Cohere trả lời thành công
* 400: Không tìm thấy đoạn chat có tên tương ứng
* 404: Không tim thấy user id  
* 504: Cohere không thể trả lời ngay lập tức

### 5. /delete_chat
Dùng để xoá một đoạn hội thoại  
Dữ liệu json cần truyền: {"uid": "user_id", "chat name": "chat_name"}  
Lưu ý về "chat name" đã được đề cập ở /create_chat  
Mã trả về:  
* 200: Xoá đoạn chat thành công
* 404: Không tim thấy user id  
