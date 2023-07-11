import firebase_admin
from firebase_admin import auth
from firebase_admin import db

cred_obj = firebase_admin.credentials.Certificate('./utilities/Firebase/cohere_firebase_config.json')
default_app = firebase_admin.initialize_app(cred_obj, {
	'databaseURL':'https://coherechatbot-default-rtdb.asia-southeast1.firebasedatabase.app/'
	})


