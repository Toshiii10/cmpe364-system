from flask import Flask
app = Flask(__name__)

@app.route("/")
def home():
    return "CMPE 364 backend is running."