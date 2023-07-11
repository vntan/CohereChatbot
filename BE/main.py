from flask import Flask, Blueprint
from app_apis import apis
from user_serve import finished_serve, serving_user
from queue import Queue
from threading import Thread

app = Flask(__name__)  


if __name__ == '__main__':
    # q = Queue()
    t = Thread(target=serving_user, args=())
    t.start()
    app.register_blueprint(apis)
    app.run(debug=True)   
    finished_serve = True
    t.join()