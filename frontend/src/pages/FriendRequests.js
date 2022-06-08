import React, { Component } from "react";

import check from '../assets/check.png';
import close from '../assets/close.png';

export default class FriendRequests extends Component {

    constructor(props){
        super(props);

        this.getName = this.getName.bind(this);
    }

    // Get Name
    // Parameters: passedid(id of user), index(to change name)
    // Functionality: Displays the name of the user: sends a POST to server and change the name of the element with the returned element's name 
    getName(passedid, index){
        fetch("http://localhost:3001/get-username",
          { method: "POST",
              headers: {
                  "Content-Type": "application/json"
              },
              body: JSON.stringify({id: passedid})
          })
          .then(response => response.json())
          .then(body => {
              var newname = body.name
              document.getElementById('name'+index).innerHTML = newname;
          });
    }

    // Accept Friend Request
    // Parameters: id(of the person), userid(of the logged in user)
    // Functionality: Accepts a friend request: deletes the request from the friends table and pushes id of each other to each other's friends
    acceptFriendRequest(id, userid){
        const acceptRequest={
            sender: id,
            receiver: userid
        }
        
        fetch(
            "http://localhost:3001/delete-request",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(acceptRequest)
            })
            .then(response=>response.json())
            .then(body=>{
                if(!body.success){
                    alert("Error!")
                }
            })

        fetch(
            "http://localhost:3001/confirm-friend",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({sender: id, receiver: userid})
            })
            .then(response=>response.json())
            .then(body=>{
                if(body.success){
                    window.location.reload();
                }
            })

    }

    // Reject Friend Request
    // Parameters: id (of the person), userid (of the logged in user)
    // Functionality: Rejects a friend request: delete request from friend table
    rejectFriendRequest(id,userid){
        const newrequest={
            sender: id,
            receiver: userid
        }

        fetch(
            "http://localhost:3001/delete-request",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newrequest)
            })
            .then(response=>response.json())
            .then(body=>{
                if(body.success){
                    window.location.reload();
                }
            })
    }

    render(){
        return(
            <div id='friend-requests-panel'>
                    <h1>Friend Requests</h1>
                    
                    {this.props.requests.map((user, index)=>{
                        return(
                        <div key={index}>
                            <div className='fr-box'>
                            <a href={"/user?id="+user.sender}><h2 id={'name'+index}>{this.getName(user.sender, index)}</h2></a>
                            <img onClick={e=>this.rejectFriendRequest(user.sender, user.receiver)} src={close}/>
                            <img onClick={e=>this.acceptFriendRequest(user.sender, user.receiver)} src={check}/>
                            </div>
                        </div>
                        );
                    })}

                </div>
        );
}

}