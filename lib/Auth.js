import Router from "next/router"
import _ from "underscore"

let Auth = (page, callback, groupName) =>{
    //add fetch to api/auth to define access

  let bodyData =  (_.isUndefined(groupName)) ? JSON.stringify({"page":page}) : JSON.stringify({"page":page, "groupName":groupName})

    fetch('/api/auth', {
        method: 'post',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        },
        body: bodyData
      })
      .then( r => r.json() )
      .then( data => {
         const parsed = JSON.parse(data)
        // console.log(parsed)
        if(parsed.status === "0"){
          Router.push("/")
        }
        else{
         // console.log("auth true")
          callback(parsed.status)

        }
        
  
      })
}

export default Auth