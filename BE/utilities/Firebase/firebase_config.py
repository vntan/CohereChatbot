import firebase_admin
from firebase_admin import auth
from firebase_admin import db

import os
from pathlib import Path
from dotenv import load_dotenv

dotenv_path = Path('./.env')
load_dotenv(dotenv_path=dotenv_path)

DATABASE_URL = os.getenv('DATABASE_URL')
CERFTIFICATE = os.getenv('CERFTIFICATE')

cred_obj = firebase_admin.credentials.Certificate(CERFTIFICATE)
default_app = firebase_admin.initialize_app(cred_obj, {
	'databaseURL': DATABASE_URL
	})


