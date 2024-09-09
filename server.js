const express = require('express')
const next = require('next')
const bodyParser = require('body-parser')
const _ = require('underscore')
const moment = require('moment')
const sql = require('mssql')
const ad = require('activedirectory2')
const cookieParser = require('cookie-parser')
const https = require('https')
const fs = require('fs')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()
const appPort = 5877

//A global sessions array that tracks the users currently signed in to the app
let sessions = []

//more convenient logging
const log = (x) => {
  console.log(x)
}

//USE EXTREME CAUTION - LIVE OFS CONNECTION
////////////////////////////////////////////////////////
// const ofsConfig = {
//   user: 'svcWebAppOFS',
//   password: 'OFSweb!!usap',
//   server: '10.1.2.36',
//   database: 'spt001db',
//   port: 1433,
//   connectionTimeout: 300000,
//   requestTimeout: 300000,
//   pool: {
//       idleTimeoutMillis: 300000,
//       max: 100
//   }
// }
// const BVL_OFS_Pool = new sql.ConnectionPool(ofsConfig).connect();
//////////////////////////////////////////////////////////////


//Connection string config object for sql server db: DNKTEST for testing, SPTS_DNK for production.
// const config = {
//   user: 'svcWebApp',
//   password: 'USweb!!appsAP',
//   server: '10.1.2.87', //corpitdb
//   database: 'spt001db', //copy of bvl ofs data
//   port: 1433,
//   connectionTimeout: 300000,
//   requestTimeout: 300000,
//   pool: {
//       idleTimeoutMillis: 300000,
//       max: 100
//   }
// }

// //Connection Pool for the above sql connection
// const corpITdbBVLOFS_Pool = new sql.ConnectionPool(config).connect();


// const ofsTestConfig = {
//   user: 'svcWebAppOFS',
//   password: 'OFSweb!!usap',
//   server: '10.1.2.36', //corpdb4
//   database: 'BVLTEST', //bvl ofs (test)
//   port: 1433,
//   connectionTimeout: 300000,
//   requestTimeout: 300000,
//   pool: {
//       idleTimeoutMillis: 300000,
//       max: 100
//   }
// }

// const BVL_OFS_Test_Pool = new sql.ConnectionPool(ofsTestConfig).connect();

// //Connection string config object for sql server db: DNKTEST for testing, SPTS_DNK for production.
// const appConfig = {
//   user: 'svcWebApp',
//   password: 'USweb!!appsAP',
//   server: '10.1.2.87', //corpitdb
//   database: 'UsapAppsDBTest', // prodrec test database
//   port: 1433,
//   connectionTimeout: 300000,
//   requestTimeout: 300000,
//   pool: {
//       idleTimeoutMillis: 300000,
//       max: 100
//   }
// }

// //Connection Pool for the above sql connection
// const app_Pool = new sql.ConnectionPool(appConfig).connect();

//Config obj to connect to Active Directory
const adConfig = {
  url: 'ldap://corpdc1.univstainless.com',
  baseDN: 'dc=univstainless,dc=com',
  bindDN: 'svcWebApp@univstainless.com',
  bindCredentials : 'USweb!!appsAP'
}

app.prepare().then(() => {
  const server = express()

    //Tell express to use the cookieparser function necessary to maintain the session
    server.use(cookieParser());

    //a function that returns true if a passed id is not defiend or not in the sessions array and false if the id is logged in
    function loggedOut(id){

      if(_.isUndefined(id)){
        return true
      }
      if(_.isUndefined(sessions[getSessionIndex(sessions, id)])){
        return true
      }
      else{
        return false
      }
    }

  //a function that returns the index of a session in the array of sessions
  function getSessionIndex(arr, session){
    log((JSON.stringify(arr)+" sessionID: "+session))
    let elemPos
    for(let i = 0; i< arr.length; i++){
      if(arr[i].id == session){
        elemPos = i
      }
    }
    //  var elementPos = arr.map(function(x){return x.id}).indexOf(session)
    log(("pos: "+elemPos))
    return elemPos
  }

    //a function that removes the current user from the sessions array and clear the sessionID cookie from the client
    function logout(req,res){
      log(sessions)
      if(!_.isUndefined(req.cookies.sessionID)){
        sessions.splice(getSessionIndex(sessions, req.cookies.sessionID), 1);
      }
      res.clearCookie('sessionID')
    }

    //a function that fires a callback carrying a boolean toggled depending on whether the passed in user is a member of the const groupName
    function isGroupUser(username, groupName, callback){

      let adCurrent = new ad(adConfig);
        adCurrent.isUserMemberOf(username, groupName, function(err, isMember) {
          log(username)
          log(groupName)
          log(isMember)
          if (err) {
            console.log('ERROR: ' +JSON.stringify(err));
            callback(false);
          }
          if(isMember === true){
            callback(true);
          }
          else{
            callback(false);
          }
        })
    }

  server.use(bodyParser.json())

  server.post('/api/auth', (req, res) =>{
    if(sessions.length > 0){
      const id = req.cookies.sessionID
      log({sessionID:id})

      let resp = ''

      if (loggedOut(id)){
        resp = '{"status":"0","message":"User is not logged in."}'
      }
      else{
        resp = '{"status":"1","message":"Authenticated"}'
        if(!_.isUndefined(req.body.groupName)){
          isGroupUser(id, req.body.groupName, isUser=>{
            resp = (isUser) ? '{"status":"1","message":"Authenticated"}' : '{"status":"2","message":"User is logged in, but not a group member."}'
          })
        }
      }
      
      res.json(resp)
    }
    else{
      res.json('{"status":"0","message":"User is not logged in."}')
    }
  })

  server.post('/api/logout', (req, res)=>{
    logout(req,res)
    res.json(`{"status":"1","message":"Logged out"}`)
  })

  // //api/login route for server. Receives in data from the /login.html and runs the necessarry functions to add the user to the sessions array and to
  // write the sessionID cookie to the client machine then responds to the calling page (/login.html) with either error or success objects
  server.post('/api/login', (req, res) =>{

    console.log(req.body)

    //create a locally-scoped ad object
    let adCurrent = new ad(adConfig);
    //set username to the value passed from the login form to receive string manipulation
    let username = req.body.un

    //set sessionID to req.body.u to not receive any manipulation
    let sessionID = req.body.un 
    //set password to the password passed in by user
    let password = req.body.pw

    // allows users to include univstainless\ domain prepended to username, simply filters out 
    if(req.body.un.includes("univstainless\\")){
      let strArr = username.split("\\")
      username = strArr[1]
    }

    // allows users to not include @univstainless.com by appending it to the supplied name if it is missing
    if(!username.includes("@univstainless.com")){
      username +="@univstainless.com"
    }

    //authenticate username and password from form
    adCurrent.authenticate(username, password, function(err, auth) {
      if(err) {
        log(('ERROR: '+JSON.stringify(err)))
        log(('Authentication failed!'))
        //if not authentic respond w/ err object to /login.html's calling function
        res.json('{"status":"0","message":"Invalid Credentials."}')
      }
      if(auth) {
        //if authentic, setSession function runs
        log(('Authenticated!'))
        setSession(username, sessionID)

        //set cookie and respond w/ auth obj to /login.html's calling function
        res.cookie('sessionID', sessionID).json(`{"status":"1","message":"Valid Credentials.","SessionID":"${sessionID}"}`)
      }
    })
  })
  
  //a function that adds the user's session to the sessons array operating slightly differently if there are no sessions at the time of login
  function setSession(un, sessionID){
    log(sessions)
    if( sessions.length == 0 ){
      sessions[0] = {uname:un, type:1, id:sessionID, created:moment(new Date()).format("MM/DD/YYYY HH:mm:ss")}
    }
    else{
      if(hasSession(sessionID) == false){
        log("else")
        sessions.push({uname:un, type:1, id:sessionID, created:moment(new Date()).format("MM/DD/YYYY HH:mm:ss")})
      }
    }
    
    log("active sessions:")
    log(sessions)
    
  }
  
  //a function that checks if the sessionID is already in the sessions array and returns true or false accordingly
  function hasSession(sessionID){
    for(session in sessions){
      if(sessions[session]["id"] == sessionID){
        return true
      }
    }
    return false
  }

  //API//

  //API//

  const simpleQuery = (query, poolName, callback)=>{
    poolName.then((pool) => {
      pool.request().query(query, (err, result) => {
        // ... error checks
        log((query.length > 5000)?query.substring(0,500):query)
        if(result){
          callback({status:1,data:result.recordset,result:result,query:query})
        }
        if(err){
          log(err)
          callback({status:0})
        }
      })
    })
  }

  const addZero = idNum =>{
    if(idNum.length < 7 && idNum.split('')[0] !== '0' ){
      return `0${idNum}`
    }
    else{
      return idNum
    }
  }

  const getAvg = (...args) => {
    const filtered = args.filter(val=>val!==0).filter(val=>val!=='')
    const avg = filtered.reduce((a, b) => parseFloat(a) + parseFloat(b), 0) / filtered.length
    return((isNaN(avg)) ? null : avg.toFixed(2))
  }

  server.get('*', (req, res) => {
    return handle(req, res)
  })
  
  https.createServer({
    pfx: dev ? fs.readFileSync('//corpdev/e$/cert/wildcard_univstainless_com.pfx') : fs.readFileSync('//corpapp3/e$/cert/wildcard_univstainless_com.pfx'),
    passphrase:'Usap$ert600'
  }, server)
  .listen(appPort, function () {
    console.log('App Running on '+appPort)
  })
})