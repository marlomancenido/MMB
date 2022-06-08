import React, { Component } from "react";
import logo from '../assets/mmb-y.png'
import search from '../assets/magnifying-glass.png'


export default class LeftSidebar extends Component{
    constructor(props){
        super(props);

        this.state = {
          searchFor: ''
        }

        this.changeSearch = this.changeSearch.bind(this);
    }

    // Change Search
    // Functionality: Changes searchFor according to the input (and changes spaces into +)
    changeSearch(e){
      e.preventDefault();

      var searchWord = e.target.value.split(' ').join('+');
      this.setState({searchFor: searchWord});
      console.log(this.state.searchFor);
    }

    render(){
        return(
            <div id='left-sidebar'>
              <div className='dash-container'>
                <a href='/dashboard'><img id='mmb-logo' src={logo} /></a>
                <a className='nonhighlight' href='/dashboard'><h1>MeowMeowBeenz</h1></a>
     
                <input type='text' onChange={this.changeSearch} placeholder='Click search button to search'></input>
                <a href={'/search?k='+this.state.searchFor}><button><img id='search-img' src={search}/></button></a>

                <p>Hello, <a className='highlight-red'>{this.props.firstname}</a>!</p>
              </div>
            </div>
        );
    }
}