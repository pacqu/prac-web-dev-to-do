import requests
from flask import Flask, redirect, render_template, request, url_for, session
app = Flask(__name__)

@app.route("/",methods=["GET","POST"])
def home():
    if request.method == "POST":
        submit_type = request.form['submit']
        if (submit_type == 'register'):
            username = request.form['username']
            print username
            #register_res = requests.post('https://hunter-todo-api.herokuapp.com/auth')
        elif (submit_type == 'login'):
            username = request.form['username']
            print username
            #login_res = requests.post('https://hunter-todo-api.herokuapp.com/auth')
        #print submit_type
        #r = requests.get('https://hunter-todo-api.herokuapp.com/user')
        #print r.text
    return render_template("home.html")

if __name__ == '__main__':
    app.debug = True
    app.run(host='localhost',port=5000)
