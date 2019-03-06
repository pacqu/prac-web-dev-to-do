import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import './main.css';

const axios = require('axios');

class App extends Component {
  constructor(){
    super();
    this.state = {
      loggedIn: false,
    };
  }

  componentDidMount(){
    axios.get('/loggedIn')
    .then(res => {
      if (res.data.username) this.setState({loggedIn: true, username: res.data.username});
      console.log(res);
    })
    .catch(err => {
      console.log(err);
    });
  }

  handleSubmitLoginInfo(event){
    axios.post('/logIn', { username: this.refs.username_entry.value})
    .then(res => {
      this.refs.username_entry.value = "";
      if (res.data.username) this.setState({loggedIn: true, username: res.data.username});
      console.log(res);
    })
    .catch(err => {
      this.refs.username_entry.value = "";
      console.log(err);
    });
  }

  handleLogout(event){
    axios.get('/logout')
    .then(res => {
      if (!(res.data.loggedIn)) this.setState({loggedIn: false, username: ""});
      console.log(res);
    })
    .catch(err => {
      console.log(err);
    });
  }

  render() {
    let header = (<h1> To-Do List</h1>);
    let body = (<div>
      <input name="username" type="text" placeholder="username" ref="username_entry"></input>
      <br></br>
      <button type="button" name="submit">Register</button>
      <button type="button" name="submit" onClick={this.handleSubmitLoginInfo.bind(this)}>Log In</button>
    </div>);
    let logout;
    if (this.state.loggedIn){
      header = (<h1> {this.state.username}{"'s"} To-Do List</h1>);
      logout = (<button type="button" name="submit" onClick={this.handleLogout.bind(this)}>Logout</button>);
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
