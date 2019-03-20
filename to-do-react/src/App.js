import React, { Component } from 'react';
import Cookies from 'js-cookie';
import logo from './logo.svg';
import './App.css';
import './main.css';

const axios = require('axios');

class App extends Component {
  constructor(){
    super();
    this.state = {
      loggedIn: false,
      toDoList: []
    };
  }

  componentDidMount(){
    if (Cookies.get('token')){
      this.setState({loggedIn: true});
      this.getToDoList();
    }
  }

  handleSubmitRegisterInfo(){
    /* To-Do: Give user feedback that login is being attempted */
    let username = this.refs.username_entry.value;
    axios.post('https://hunter-todo-api.herokuapp.com/user', { username: username})
    .then(res => {
      axios.post('https://hunter-todo-api.herokuapp.com/auth', { username: username})
      .then(res => {
        this.refs.username_entry.value = "";
        if (res.data.token){
          Cookies.set('token', res.data.token);
          Cookies.set('username', username);
          this.setState({loggedIn: true, message: ""});
          this.getToDoList();
        }
        console.log(res);
      })
      .catch(err => {
        this.refs.username_entry.value = "";
        this.setState({message: "Login Failed! User doesn't exist"})
        console.log(err);
      })
    })
    .catch(err => {
      this.refs.username_entry.value = "";
      this.setState({message: "Registration Failed! User already exists"});
    })
  }

  handleSubmitLoginInfo(){
    /* To-Do: Give user feedback that login is being attempted */
    let username = this.refs.username_entry.value;
    axios.post('https://hunter-todo-api.herokuapp.com/auth', { username: username})
    .then(res => {
      this.refs.username_entry.value = "";
      if (res.data.token){
        Cookies.set('token', res.data.token);
        Cookies.set('username', username);
        this.setState({loggedIn: true, message: ""});
        this.getToDoList();
      }
      console.log(res);
    })
    .catch(err => {
      this.refs.username_entry.value = "";
      this.setState({message: "Login Failed! User doesn't exist"})
      console.log(err);
    })
  }

  getToDoList(){
    axios.get('https://hunter-todo-api.herokuapp.com/todo-item', { headers: {'sillyauth': Cookies.get('token')} })
    .then(res => {
      this.setState({
        toDoList: res.data
      })
      console.log(res.data);
    })
    .catch(err => {
      console.log(err);
    });
  }

  toggleComplete(taskId, completed){
    axios.put('https://hunter-todo-api.herokuapp.com/todo-item/' + taskId,
    {'completed': !completed},
    {headers: {
      'sillyauth': Cookies.get('token')
    }})
    .then(res => {
      this.getToDoList();
      console.log(res);
    })
    .catch(err => {
      console.log(err);
    });
  }

  handleDelete(taskId, completed){
    axios.delete('https://hunter-todo-api.herokuapp.com/todo-item/' + taskId,
    {headers: {
      'sillyauth': Cookies.get('token')
    }})
    .then(res => {
      this.getToDoList();
      console.log(res);
    })
    .catch(err => {
      console.log(err);
    });
  }

  handleNewTask(){
    /* To-Do: Give user feedback that login is being attempted */
    let task = this.refs.task_entry.value;
    axios.post('https://hunter-todo-api.herokuapp.com/todo-item',
    { content: task },
    {headers: { 'sillyauth': Cookies.get('token')} }
  )
    .then(res => {
      this.refs.task_entry.value = "";
      this.getToDoList();
      console.log(res);
    })
    .catch(err => {
      this.refs.task_entry.value = "";
      console.log(err);
    })
  }

  handleLogout(){
    Cookies.remove('token');
    Cookies.remove('username');
    this.setState({loggedIn: false, toDoList: []});

  }

  render() {
    let header = (<h1> To-Do List</h1>);
    let message = (<div> </div>)
    if (this.state.message) message = (<h5>{this.state.message}</h5>)
    let body = (<div>
      <input name="username" type="text" placeholder="username" ref="username_entry"></input>
      <br></br>
      <button type="button" name="submit" onClick={() => this.handleSubmitRegisterInfo()}>Register</button>
      <button type="button" name="submit" onClick={() => this.handleSubmitLoginInfo()}>Log In</button>
      {message}
    </div>);
    let logout;
    if (this.state.loggedIn){
      let toDoList = this.state.toDoList;
      header = (<h1> {Cookies.get('username')}{"'s"} To-Do List</h1>);
      if (toDoList.length){
        let toDoRows = toDoList.map((task,i) => {
          let completed = '';
          let content = task.content;
          let button = 'Done';
          if (task.completed){
            completed = 'X';
            content = (<s>{task.content}</s>);
            button = 'Undone';
          }
          return (
            <tr key={i}>
              <td>{completed}</td>
              <td>{content}</td>
              <td><button onClick={()=>this.toggleComplete(task.id, task.completed)}>{button}</button></td>
              <td><button onClick={()=>this.handleDelete(task.id, task.completed)}><i className="fa fa-trash"></i></button></td>
            </tr>);
        });
        let toDoTable = (
          <table>
            <thead>
              <tr>
                <th>Done?</th>
                <th>Task</th>
                <th></th>
              </tr>
            </thead>
            <tbody>{toDoRows}</tbody>
          </table>
        )
        let addTask = (
          <div>
            <h2>Add a new Task</h2>
            <input name="task" type="text" placeholder="Let's go to the Mall" ref="task_entry"></input> <br></br>
            <button type="button" name="submit" onClick={() => this.handleNewTask()}>Add Post</button>
            <br></br> <br></br>
          </div>
        )
        body = (
          <div>
          {toDoTable}
          {addTask}
          </div>
        )
      }
      else body = (<h3>Loading...</h3>)
      logout = (<button type="button" name="submit" onClick={()=>this.handleLogout()}>Logout</button>);
    }
    return (
      <div className="App">
        <div className="Container">
          {header}
          {body}
          {logout}
          <br></br>
        </div>
      </div>
    );
  }
}

export default App;
