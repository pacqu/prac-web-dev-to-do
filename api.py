import requests, jinja2, os
from flask import Flask, redirect, render_template, request, url_for, session

app = Flask(__name__)
app.secret_key = 't0-doN3'

@app.route("/",methods=["GET","POST"])
#Create a new user
#Log in as a user (no password required, just have someone type in their name)
def home():
    if session.get('token', None):
        return redirect('/list')

    if request.method == "POST":
        submit_type = request.form['submit']
        username = request.form['username']
        post_data = {'username':username}
        if (submit_type == 'register'):
            register_res = requests.post('https://hunter-todo-api.herokuapp.com/user', json=post_data)
            if 'error' in register_res.json():
                return render_template("home.html", message=register_res.json()['error'])
        login_res = requests.post('https://hunter-todo-api.herokuapp.com/auth', json=post_data)
        if 'error' in login_res.json() or 'token' not in login_res.json():
            #print 'User does not exist'
            if 'error' in login_res.json():
                return render_template("home.html", message=login_res.json()['error'])
            else:
                return render_template("home.html", message="An unexpected error has occured.")
        session['token'] = login_res.json()['token']
        session['username'] = username
        return redirect('/list')

    return render_template("home.html")

#See their item(s)
#Create new item(s)
@app.route("/list",methods=["GET","POST"])
def list():
    if session.get('token', None):
        if request.method == "POST":
            new_task = request.form['new_task']
            #print new_task
            post_data = {'content':new_task}
            new_task_res = requests.post('https://hunter-todo-api.herokuapp.com/todo-item', cookies={'sillyauth': session.get('token', None).encode('ascii','ignore')},json=post_data)
            #print new_task_res.json()
        todo_res = requests.get('https://hunter-todo-api.herokuapp.com/todo-item', cookies={'sillyauth': session.get('token', None).encode('ascii','ignore')})
        #print todo_res.json()
        return render_template("list.html", todo=todo_res.json(), username=session.get('username', None))
    else:
        return redirect('/')


#Mark item(s) as done
#TODO: Seperate routes for marking complete/incomplete to save time on first get
@app.route('/done/<id>', methods=["GET"])
def done(id):
    if session.get('token', None):
        #task_res = requests.get('https://hunter-todo-api.herokuapp.com/todo-item/' + id, cookies={'sillyauth': session.get('token', None).encode('ascii','ignore')})
        #print task_res.json()['completed']
        #post_data = {"completed": not(task_res.json()['completed'])}
        post_data = {"completed": True}
        #print post_data
        put_data = requests.put('https://hunter-todo-api.herokuapp.com/todo-item/' + id, cookies={'sillyauth': session.get('token', None).encode('ascii','ignore')},json=post_data)
        #print put_data.json()
        return redirect('/list')
    else:
        return redirect('/')

@app.route('/undone/<id>', methods=["GET"])
def undone(id):
    if session.get('token', None):
        #task_res = requests.get('https://hunter-todo-api.herokuapp.com/todo-item/' + id, cookies={'sillyauth': session.get('token', None).encode('ascii','ignore')})
        #print task_res.json()['completed']
        #post_data = {"completed": not(task_res.json()['completed'])}
        post_data = {"completed": False}
        #print post_data
        put_data = requests.put('https://hunter-todo-api.herokuapp.com/todo-item/' + id, cookies={'sillyauth': session.get('token', None).encode('ascii','ignore')},json=post_data)
        #print put_data.json()
        return redirect('/list')
    else:
        return redirect('/')

#Delete item(s) altogether
@app.route('/delete/<id>', methods=["GET"])
def delete(id):
    if session.get('token', None):
        delete_data = requests.delete('https://hunter-todo-api.herokuapp.com/todo-item/' + id, cookies={'sillyauth': session.get('token', None).encode('ascii','ignore')})
        #print delete_data.text
        return redirect('/list')
    else:
        return('/')

#Logout
@app.route("/logout",methods=["GET","POST"])
def logout():
    if session.get('token', None):
        session.pop('token', None)
        session.pop('username', None)
    return redirect('/')

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, threaded=True)
