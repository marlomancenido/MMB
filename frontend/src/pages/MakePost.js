import React, { Component } from "react";

export default class MakePost extends Component {

    constructor(props) {
        super(props);
    
        this.makepost = this.makepost.bind(this);
      }

      // Make Post
      // Functionality: Commits the post: sends a POST to backend with the required fields
      makepost(e){
          e.preventDefault();

          const newpost={
              userid: this.props.userid,
              firstname: this.props.firstname,
              lastname: this.props.lastname,
              text: document.getElementById("post-body").value
          }
          
          document.getElementById('post-submission').reset();

          fetch(
            "http://localhost:3001/makepost",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newpost)
            })
            .then(response=>response.json())
            .then(body=>{
                if(body.success){
                    alert("Successfully posted");
                    window.location.reload();
                }
            })

          
      }

      render(){
          return(
            <div>
                <form id='post-submission'>
                    <textarea id='post-body'/>
                    <button onClick={this.makepost}>POST</button>
                </form>
            </div>
          )
      }



}