import React from 'react'
import Cookies from "universal-cookie";

class SignIn extends React.Component{

    constructor(props){
        super(props);

        this.login = this.login.bind(this);
    }

      // Login
      // Functionality: Logs in a user (send a POST to server and stores some items including setting a cookie)
      login(e) {
        e.preventDefault();
    
        const credentials = {
          email: document.getElementById("l-email").value,
          password: document.getElementById("l-password").value
        }

        document.getElementById("loginform").reset();
    
        // Send a POST request
        fetch(
          "http://localhost:3001/login",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(credentials)
          })
          .then(response => response.json())
          .then(body => {
            if (!body.success) { alert("Failed to log in. See console for details."); }
            else {

              // successful log in. store the token as a cookie
              const cookies = new Cookies();
              cookies.set(
                "authToken",
                body.token,
                {
                  path: "localhost:3001/",
                  age: 60*60,
                  sameSite: "lax"
                });
    
                localStorage.setItem("firstname", body.firstname);
                localStorage.setItem("lastname", body.lastname)
                localStorage.setItem("userid", body.userid)
                alert("Successfully logged in");
                window.location.href="/dashboard"
                
            }
          })
      }

    render(){
        return(
            <div>
                <form id="loginform">
                <h1 className='highlight-red'>SIGN IN</h1>

                    <label htmlFor='l-email'>EMAIL</label>
                    <input type="text" id="l-email"/>&nbsp;
                    <label htmlFor='l-password'>PASSWORD</label>
                    <input type="password" id="l-password"/>&nbsp;
                    <button id="loginbtn" onClick={this.login}>SIGN IN</button>

                </form>
            </div>
        );
    }
}

export default SignIn