import React from 'react'

// Initializations for the npm packages for email and password validation
var emailValidator = require('email-validator')
var passwordValidator = require('password-validator')
var passwordSchema = new passwordValidator()
passwordSchema.is().min(8).has().uppercase().has().lowercase().has().digits(1)

class SignUp extends React.Component{

    constructor(props){
        super(props)
        this.state = {
            first_name: null,
            fname_err: null,
            last_name: null,
            lname_err: null,
            email: null,
            email_err: null,
            password: null,
            pass_err: null,
            confpass: null,
            match: null
        }
        
        this.validateForm = this.validateForm.bind(this)
        this.changeEmail = this.changeEmail.bind(this)
        this.changeFName = this.changeFName.bind(this)
        this.changeLName = this.changeLName.bind(this)
        this.changePass = this.changePass.bind(this)
        this.changeConfPass = this.changeConfPass.bind(this)
        this.check_validation = this.check_validation.bind(this)
        this.signup = this.signup.bind(this);
    }

    changeFName(e){
        this.setState({first_name: e.target.value})
    }

    changeLName(e){
        this.setState({last_name: e.target.value})
    }

    changePass(e){
        this.setState({password: e.target.value})
    }

    changeConfPass(e){
        this.setState({confpass: e.target.value})
    }

    changeEmail(e){
        this.setState({email: e.target.value})
    }

    validateForm(e){

        // Prevents page from reloading but consequently removes the required property in the inputs
        e.preventDefault();
        
        // First Name Validate
        if(this.state.first_name==null){
            this.setState({fname_err: "Required. Cannot be left empty."})
        } else{
            this.setState({fname_err: null})
        }

        // Last Name Validate
        if(this.state.last_name==null){
            this.setState({lname_err: "Required. Cannot be left empty."})
        } else{
            this.setState({lname_err: null})
        }

        // Email Validate
        // Check email if valid (using the email-validator package)
        if(!emailValidator.validate(this.state.email)){
            this.setState({email_err: "Not a valid email"})
        } else {
            this.setState({email_err: null})
        }

        // Password Validate
        // Check password if valid (using the password-validator package with set schema )
        if(!passwordSchema.validate(this.state.password)){
            this.setState({pass_err: "Weak password. Must be at least 8 characters, have at least 1 number, 1 lowercase letter, and 1 uppercase letter."})
        } else{
            this.setState({pass_err: null})
        }

        // Password Match Validate
        if(this.state.password !== this.state.confpass){
            this.setState({match: "Passwords do not match"})
        } else{
            this.setState({match: null})
        }

        // Timeout allows the setStates to be updated first before proceeding with a check
        setTimeout(()=>{
            this.check_validation()
        }, 1)

    }

    check_validation(){
        if(this.state.fname_err===null && this.state.lname_err===null && this.state.email_err===null && this.state.pass_err===null && this.state.match===null){
            this.signup();
        }
    }

    signup() {
    
        const user = {
          firstname: this.state.first_name,
          lastname: this.state.last_name,
          email: this.state.email,
          password: this.state.password
        }

        document.getElementById("signupform").reset();
    
        // send a POST request to localhost:3001/signup
        fetch(
          "http://localhost:3001/signup",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(user)
          })
          .then(response => response.json())
          .then(body => {
            if (body.success) { alert("Successful sign up! You may proceed to login."); window.location.reload();}
            else { alert("Failed to signup. Please try again later."); }
          });
      }

    render(){
        return(
            <div>
                <form id="signupform">
                <h1 className='highlight-red'>SIGN UP</h1>
                    <label htmlFor='fname'>FIRST NAME</label>
                    <input type='text' id='fname' onChange={this.changeFName} required/>
                    <div className='error'>{this.state.fname_err}</div>
                    <br/>

                    <label htmlFor='lname'>LAST NAME</label>
                    <input type='text' id='lname' onChange={this.changeLName} required></input>
                    <div className='error'>{this.state.lname_err}</div>
                    <br/>

                    <label htmlFor='email'>EMAIL</label>
                    <input type='email' id='email' onChange={this.changeEmail} required></input>
                    <div className='error'>{this.state.email_err}</div>
                    <br/>

                    <label htmlFor='pass'>PASSWORD</label>
                    <input type='password' id='pass' onChange={this.changePass} required></input>
                    <div className='error'>{this.state.pass_err}</div>
                    <br/>

                    <label htmlFor='confpass'>CONFIRM PASSWORD</label>
                    {/* Sets this to disabled when password is still empty */}
                    {this.state.password==null ? <input type='password' id='confpass' onChange={this.changeConfPass} required disabled></input> : <input type='password' id='confpass' onChange={this.changeConfPass} required></input> }
                    <div className='error'>{this.state.match}</div>
                    <br/>                    

                    <button onClick={this.validateForm}>SIGN UP</button>

                </form>
                
            </div>
        )
    }

}


export default SignUp