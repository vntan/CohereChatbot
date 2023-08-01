Docker:  
* Run: docker compose up -d
* Quit: docker compose down  

Run locally:
* In ./FE/package.json change  "proxy": "http://back-end:5000" to "proxy": "http://127.0.0.1:5000"
* cd FE / npm start
* cd BE / python main.py
