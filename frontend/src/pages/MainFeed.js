import React, { Component } from "react";

// Moment is used for time displaying (when a post was posted and how long it's been since)
const moment = require('moment');

export default class MainFeed extends Component {

    constructor(props){
        super(props)

        this.state={
            posts:[],
            friends:[]
        }

        this.editPost = this.editPost.bind(this);
        this.commitEdit = this.commitEdit.bind(this);
    }

    componentDidMount(){
        
        // Posts Arr will contain all the posts of both the user and their friends. 
        let postsArr = []

        // Get user's posts and push it to the postsArr
        fetch('http://localhost:3001/get-posts',{
            method: 'POST',
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({userid: this.props.userid})
        })
            .then(response => response.json())
            .then(body =>{
                body.results.map((post, index)=>{
                    postsArr.push(post)
                })
            })
        
        // Get user's friends and setState friends to the result
        fetch('http://localhost:3001/get-friends',{
            method: 'POST',
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({userid: this.props.userid})
            })
            .then(response => response.json())
            .then(body =>{
                this.setState({friends: body.userfriends})
            })

        // Wait for above to finish. Then get friends' posts and push to postsArr
        setTimeout(()=>{
            this.state.friends.map((friend, index)=>{
                fetch('http://localhost:3001/get-posts',{
                    method: 'POST',
                    headers:{
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({userid: friend})
                })
                    .then(response => response.json())
                    .then(body =>{
                        // If there are posts by that friend, push posts individually to the postsArr
                        if(body.success && body.results.length>0){
                            body.results.map((post, index)=>{
                                postsArr.push(post)
                            })
                        }
                    })
            })
        },100)

        // Wait for above to finish then sort the posts and set state to postsArr
        setTimeout(()=>{
            postsArr.sort(function compare(a, b) {
                var dateA = new Date(a.date);
                var dateB = new Date(b.date);
                return dateB - dateA;
              });

            this.setState({posts: postsArr})
        },150)

    }

    // Edit Post
    // Parameter: Index
    // Functionality: Allows user to edit a post. Hides the original body content and shows the edit box.
    editPost(index){
        document.getElementById('post'+index).style.display= 'none';
        document.getElementById('editbox'+index).style.display='block'
    }

    // Commit Edit
    // Parameter: Index
    // Functionality: Commits the user's edit. Gets the new text and posts it to the server. Reloads the page after to reflect changes.
    commitEdit(index){
        const newEdit={
            _id: this.state.posts[index]._id,
            newtext: document.getElementById('newtext'+index).value
        }

        fetch(
            "http://localhost:3001/edit-post",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newEdit)
            })
            .then(response=>response.json())
            .then(body =>{
                if (body.success) {window.location.reload();}
                else{ alert("Unable to edit post.")}
            })
    }

    // Delete Post
    // Parameter: Index
    // Functionality: Uses a POST method to delete the post at index. 
    deletePost(index){
        fetch('http://localhost:3001/delete-post', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({id: this.state.posts[index]._id})
        })
            .then(response => response.json())
            .then(body =>{
                if (body.success) {window.location.reload();}
                else{ alert("Unable to delete post.")}
            })
    }

    render(){
        return(
            // Loops through the posts in posts and forms separate divs for them all for display.
            <div>
                {                    
                    this.state.posts.map((post, index)=>{
                        const postDate = new Date(post.date);
                        return(
                        <article key={index}>
                            <div className="post-details">
                                <div className="author"><a href={'/user?id='+post.userid}>{post.firstname+" "+post.lastname}</a></div>
                                <div className="dateTime">{moment(postDate).fromNow()}</div>
                            </div>
                            <div id={'post'+index} className="body">{post.body}</div>
                            
                            {post.userid===this.props.userid?(<div className='body posteditor' id={"editbox"+index}>
                                <textarea id={'newtext'+index} defaultValue={post.body}></textarea>
                                <button onClick={e=>this.commitEdit(index)}>EDIT</button>
                                </div>):null}
                            {post.userid===this.props.userid?(<div className='post-panel'>
                                <a onClick={e=>this.editPost(index)}>Edit Post</a> | 
                                <a onClick={e=>this.deletePost(index)}> Delete Post</a> 
                                </div>):null}
                            <p>Originally posted on: {moment(postDate).format('MMM D, YYYY (h:mm A)')}</p>
                        </article>
                        );
                    })
                }         
            </div>
        )
    }
}