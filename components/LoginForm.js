import React from 'react'
import Router from 'next/router'
import Logout from '../lib/Logout'


class LoginForm extends React.Component{
    constructor (props) {
        super(props)
        this.state = {
          username:'',
          password:'',
          submitting: false,
          submitted: false
        }
        if(this.props.displayOnly !== "true"){
          Logout()
        }
      }

      Login() {
        let data = {
            un:this.state.username, 
            pw:this.state.password
        }
        fetch('/api/login', {
          method: 'post',
          headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        })
        .then( r => r.json() )
        .then( data => {
           const parsed = JSON.parse(data)
           
          if(parsed.status === "0"){
              alert(parsed.message)
          }

          if(parsed.status === "1"){
            Router.push(`/main`)
          }

        })
      }


    render(){
        return(
        <div>
            <div className="row">
                <div className="col-sm-6 offset-sm-3">
                    <label>Username:</label>
                    <input
                     type="text"
                     className="form-control mb-3"
                     onChange={e => this.setState({username: e.target.value})}
                     />

                    <label>Password:</label>
                    <input 
                      type="password" 
                      className="form-control mb-3"
                      onChange={e => this.setState({password: e.target.value})}
                      onKeyDown={e =>{if(e.which === 13){this.Login()}} } 
                      />

                    <button className="btn btn-usap" onClick={e => { this.Login()} }>Login</button>
                </div>
            </div>
        </div>
        )
    }
}

export default LoginForm