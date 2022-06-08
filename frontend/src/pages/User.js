import React from 'react';
import LeftSidebar from "./LeftSidebar";
import '../assets/dashboard.css'

const queryString = require('query-string');

class User extends React.Component {

    constructor(props){
        super(props)

        this.state={
            id: queryString.parse(props.location.search).id,
            name: '',
            email: '',
            userid: '',                     // Logged in user's id
            firstname: '',                  // Logged in user's first name
            areFriends: null,                 // Logged in user's relation to current user
            requestStatus: ''               // Logged in user's request status (if any)
        };

        this.addFriend = this.addFriend.bind(this);
        this.acceptFriendRequest = this.acceptFriendRequest.bind(this);
        this.rejectFriendRequest = this.rejectFriendRequest.bind(this);
        this.cancelRequest = this.cancelRequest.bind(this);
        this.deleteFriend = this.deleteFriend.bind(this);
    }

    componentDidMount(){

        fetch("http://localhost:3001/checkifloggedin", {
            method: "POST",
            credentials: "include"
        })
        .then(response => response.json())
        .then(body => {
            if (!body.isLoggedIn) {
                window.location.href="/"
            } else{
                this.setState({userid: localStorage.getItem("userid"), firstname: localStorage.getItem("firstname")});
                fetch('http://localhost:3001/get-user', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({id: this.state.id})
                })
                    .then(response => response.json())
                    .then(body =>{
                        if(body.success){
                            this.setState({
                                name: body.name,
                                email: body.email
                            })
                        } else{
                            alert("User id is invalid");
                            window.location.href = "/dashboard";
                        }
                    })
                                
                if(this.state.userid===this.state.id){
                    this.setState({userRelation: 1})    // 1 - Self
                } else {

                    fetch('http://localhost:3001/friend-check', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({loggedUser: this.state.userid, targetUser: this.state.id})
                    })
                        .then(response => response.json())
                        .then(body =>{
                            if(body.success){
                                this.setState({areFriends: true})
                            } else {
                                this.setState({areFriends: false})

                                fetch('http://localhost:3001/get-request', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify({sender: this.state.userid, receiver: this.state.id})
                                })
                                .then(response => response.json())
                                .then(body =>{
                                    if(body.success){
                                        this.setState({requestStatus: body.status})
                                    }
                                })
                            }
                        })


                    
                }

            }
        });
    }

    // Add Friend
    // Functionality: Sends POST to server (add an entry to Friend table with logged in user's id as sender and the target user's id as the receiver)
    addFriend(){

        const newrequest={
            sender: this.state.userid,
            receiver: this.state.id
        }

        fetch(
            "http://localhost:3001/send-request",
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
    
    // Accept Friend Request
    // Functionality: Accepts a friend request: deletes the request from the friends table and pushes id of each other to each other's friends
    acceptFriendRequest(){
        const acceptRequest={
            sender: this.state.id,
            receiver: this.state.userid
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
                if(body.success){
                    window.location.reload();
                }
            })

        fetch(
            "http://localhost:3001/confirm-friend",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(acceptRequest)
            })
            .then(response=>response.json())
            .then(body=>{
                if(body.success){
                    window.location.reload();
                }
            })

    }

    // Reject Friend Request
    // Functionality: Rejects a friend request: delete request from friend table
    rejectFriendRequest(){
        const newrequest={
            sender: this.state.id,
            receiver: this.state.userid
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

    // Cancel Request
    // Functionality: Cancels a friend request: delete request from friend table
    cancelRequest(){
        const cancelreq={
            sender: this.state.userid,
            receiver: this.state.id
        }

        fetch(
            "http://localhost:3001/delete-request",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(cancelreq)
            })
            .then(response=>response.json())
            .then(body=>{
                if(body.success){
                    window.location.reload();
                }
            })

    }

    // Delete Friend ("Unfriend")
    // Functionality: Removes a friend from list of friends
    deleteFriend(){
        const newrequest={
            sender: this.state.id,
            receiver: this.state.userid
        }

        fetch(
            "http://localhost:3001/delete-friend",
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
            <div className='dashboard'>
                <LeftSidebar firstname={this.state.firstname}/>
                
                <div id='fullpage'>
                    <div className='dash-container user-page'>
                        <h1>{this.state.name}</h1>
                        <h2>Email Address: <a href={"mailto:"+this.state.email}>{this.state.email}</a></h2>
                        
                        {/* User and Logged User are friends */}
                        {this.state.areFriends?(
                            <div>
                                <button onClick={this.deleteFriend}>Unfriend</button>
                            </div>
                        ):null}

                        {/* They are not friends and there are no pending requests */}
                        {!this.state.areFriends&&this.state.requestStatus===0?(
                            <button onClick={this.addFriend}>Add Friend</button>
                        ):null}
                        
                        {/* They are not friends and user sent logged user a request */}
                        {!this.state.areFriends&&this.state.requestStatus===2?(
                            <div>
                                <p>This user has sent you a friend request.</p>
                                <button onClick={this.acceptFriendRequest}>Accept</button>
                                <button onClick={this.rejectFriendRequest}>Reject</button>
                            </div>
                        ):null}

                        {/* They are not friends and logged user sent a request */}
                        {!this.state.areFriends&this.state.requestStatus===1?(
                            <div>
                                <p>Awaiting user's response to your friend request.</p>
                                <button onClick={this.cancelRequest}>Cancel</button>
                            </div>
                        ):null}

                      
                
                    </div>
                </div>

            </div>
        )
    }
}

export default User
    