import React, { Component } from "react";
import {Redirect} from "react-router-dom";
import Cookies from "universal-cookie";

import LeftSidebar from "./LeftSidebar";
import MakePost from "./MakePost";
import MainFeed from "./MainFeed";
import FriendRequests from "./FriendRequests";

import '../assets/dashboard.css'


export default class Dashboard extends Component {

  constructor(props) {
    super(props);

    this.state = {
      checkedIfLoggedIn: false,
      isLoggedIn: null,
      firstname: localStorage.getItem("firstname"),
      lastname: localStorage.getItem("lastname"),
      userid: localStorage.getItem("userid"),
      friendrequests: ''
    }

    this.logout = this.logout.bind(this);
  }

  componentDidMount() {
    // Send POST request to check if user is logged in
    fetch("http://localhost:3001/checkifloggedin",
      {
        method: "POST",
        credentials: "include"
      })
      .then(response => response.json())
      .then(body => {
        if (body.isLoggedIn) {
          this.setState({ checkedIfLoggedIn: true, isLoggedIn: true, firstname: localStorage.getItem("firstname"), userid: localStorage.getItem("userid"), lastname: localStorage.getItem("lastname")});
        } else {
          this.setState({ checkedIfLoggedIn: true, isLoggedIn: false });
        }
      });
    
    // Send POST to get all friend requests
    fetch("http://localhost:3001/get-friend-requests",
    { method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({userid: this.state.userid})
    })
    .then(response => response.json())
    .then(body => {
      this.setState({friendrequests: body.requests})
    });
  
  }

  // Logout Function
  // Functionality: Logs the user out: delete cookie and other info in local storage
  logout(e) {
    e.preventDefault();

    // Delete cookie with authToken
    const cookies = new Cookies();
    cookies.remove("authToken");

    // Delete user's name in local storage
    localStorage.removeItem("firstname");
    localStorage.removeItem("lastname");
    localStorage.removeItem("userid");

    this.setState({ isLoggedIn: false });
  }

  render() {
    // If user is logged not logged in, prepare for redirect to homepage
    if (!this.state.checkedIfLoggedIn) {
      return (<div></div>)
    }

    else {
      // If user is logged in, render the page
      if (this.state.isLoggedIn) {
        return (
          <div className='dashboard'>
            <LeftSidebar userid={this.state.userid} firstname={this.state.firstname}/>

            <div id='main-feed'>
              <div className='dash-container'>
                <MakePost userid={this.state.userid} firstname={this.state.firstname} lastname={this.state.lastname}/>
                <MainFeed userid={this.state.userid}/>
              </div>
            </div>

            <div id='right-sidebar'>
              <div className='dash-container'>
                <button id="logout" onClick={this.logout}>Log Out</button>

                {this.state.friendrequests.length>0?(<FriendRequests requests={this.state.friendrequests}/>):null}

              </div>
            </div>

          </div> 
        )
      }

      // If user is not logged in, back to homepage
      else {
        return <Redirect to="/" />
      }
    }
  }
}