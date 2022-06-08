import React, {Component} from "react";
import SignIn from './SignIn';
import SignUp from './SignUp';

import logo from '../assets/mmb-y.png'
import '../assets/home.css'

export default class Home extends Component{

  constructor(props){
    super(props);
    this.gotoSignIn = this.gotoSignIn.bind(this);
    this.gotoSignUp = this.gotoSignUp.bind(this);
  }

  // Go to Sign In
  // Functionality: Shows sign in div and hides the sign up div.
  gotoSignIn(){
    document.getElementById('login').style.display = 'block';
    document.getElementById('signup').style.display='none';
  }

  // Go to Sign Up
  // Functionality: Shows sign up div and hides the sign in div.
  gotoSignUp(){
    document.getElementById('signup').style.display = 'block';
    document.getElementById('login').style.display='none';
  }

    render(){
        return(
            <div>
              
                <div id='left-div'>
                  <div className='container'>
                    <img src={logo}></img>
                    <h1>IT'S THE DAWN OF A<a className='highlight-red'> SOCIAL REVOLUTION</a></h1>
                    <h3>JOIN MMB TODAY</h3>
                    <p>MeowMeowBeenz (MMB) Ltd. and its developer are not liable for any destructions caused by an uprising brought about by the creation of a new society heavily footed in MeowMeowBeenz.<br/><br/>2018-00547</p>
                  </div>
                </div>

                <div id='right-div'>
                  <div className='container'>
                    <div id='login'>
                      <SignIn/>
                      <p>Don’t have an account yet? Click <a onClick={this.gotoSignUp} className='highlight-red clickable'>here</a> to sign up.</p>
                    </div>

                    <div id='signup'>
                      <SignUp/>
                      <p>Already have an account? Click <a onClick={this.gotoSignIn} className='highlight-red clickable'>here</a> to sign in.</p>

                    </div>
                    
                  </div>
                  
                </div>
                
            </div>
        );
    }
}

