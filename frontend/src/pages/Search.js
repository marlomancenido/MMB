import React from 'react';
import LeftSidebar from "./LeftSidebar";
import '../assets/dashboard.css'

const queryString = require('query-string');

class Search extends React.Component {

    constructor(props){
        super(props)

        this.state={
            id: '',
            firstname: '',
            keywords: queryString.parse(props.location.search).k.split('+').join(' '),
            results: []
        };

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
                this.setState({id:localStorage.getItem('userid'), firstname: localStorage.getItem("firstname")});
                fetch('http://localhost:3001/get-user', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({id: this.state.id})
                })
                    .then(response => response.json())
                    .then(body =>{
                        if(!body.success){
                            alert("User id is invalid");
                            window.location.href = "/dashboard";
                        }
                    })
            }
        });

        // Waits for above to finish.
        setTimeout(()=>{

            fetch('http://localhost:3001/search-users',{
                method: 'POST',
                headers:{
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({keywords: this.state.keywords})
            })
                .then(response => response.json())
                .then(body =>{
                    if(body.success){
                        this.setState({results: body.results});
                    }
                })

        },1)

    }

    render(){

        if(this.state.results.length){
            return(
            <div className='dashboard'>
                <LeftSidebar firstname={this.state.firstname}/>                
                <div id='fullpage'>
                    <div className='dash-container user-page'>
                        <h1>Results for <a className='highlight-red'>"{this.state.keywords}"</a></h1>
                        {this.state.results.map((result, index)=>{
                            return(
                                <div className='result' key={index}>
                                    <h2><a href={"/user?id="+result._id}>{result.firstname+' '+result.lastname}</a></h2>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
            );
        } else{
            return(
                <div className='dashboard'>
                    <LeftSidebar firstname={this.state.firstname}/>                

                    <div id='fullpage'>
                        <div className='dash-container user-page'>
                            <h1>Results for <a className='highlight-red'>"{this.state.keywords}"</a></h1>
                            <p>There were no results for your query.</p>
                        </div>
                    </div>

                </div>
                );
        }
    }
}

export default Search
    