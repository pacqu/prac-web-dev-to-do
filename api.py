import requests, jinja2
from flask import Flask, redirect, render_template, request, url_for, session

app = Flask(__name__)
app.secret_key = 't0-doN3'

@app.route("/",methods=["GET","POST"])
def home():
    if session.get('token', None):
        return redirect('/list')
    if request.method == "POST":
        submit_type = request.form['submit']
        username = request.form['username']
        #print username
        post_data = {'username':username}
        if (submit_type == 'register'):
            register_res = requests.post('https://hunter-todo-api.herokuapp.com/user', json=post_data)
            #print register_res.text
            if 'error' in register_res.json():
                return render_template("home.html", message=register_res.json()['error'])
        """
        elif (submit_type == 'login'):
            username = request.form['username']
            #print username
            post_data = {'username':username}
            #print post_data
        """
        login_res = requests.post('https://hunter-todo-api.herokuapp.com/auth', json=post_data)
        r = s.post('https://hunter-todo-api.herokuapp.com/auth', json=post_data)
        print r.text
        #print login_res.json()
        if 'error' in login_res.json():
            #print 'User does not exist'
            return render_template("home.html", message=login_res.json()['error'])
        session['token'] = login_res.json()['token']
        print session.get('token', None)
        return redirect('/list')
        #print submit_type
        #r = requests.get('https://hunter-todo-api.herokuapp.com/user')
        #print r.text
    return render_template("home.html")

@app.route("/list",methods=["GET","POST"])
def list():
    if session.get('token', None):
        todo_res = requests.get('https://hunter-todo-api.herokuapp.com/todo-item', cookies={'sillyauth': session.get('token', None).encode('ascii','ignore')})
        print todo_res.text
        return render_template("list.html")
    else:
        return redirect('/')

@app.route("/logout",methods=["GET","POST"])
def logout():
    if session.get('token', None):
        session.pop('token', None)
    return redirect('/')

if __name__ == '__main__':
    app.debug = True
    app.run(host='localhost',port=5000)
