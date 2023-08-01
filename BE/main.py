from flask import Flask, Blueprint
from app_apis import apis
import user_serve
from user_serve import serving_user
from queue import Queue
from threading import Thread

app = Flask(__name__)  


if __name__ == '__main__':
    q = Queue()
    t = Thread(target=serving_user, args=())
    t.start()
    app.register_blueprint(apis)
    app.run(debug=False, host='0.0.0.0', port='5000')   
    q.join()
    user_serve.finished_serve = True
    t.join()