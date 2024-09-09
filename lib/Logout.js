let Logout = () =>{
    //add fetch to api/auth to define access

    fetch('/api/logout', {
        method: 'post',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({"page":"/"})
      })
  
}

export default Logout