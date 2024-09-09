
import _ from "underscore"

let Fetch = (route,bodyData,page,callback) =>{
    fetch(route, {
        method: 'post',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(({"page":page,"data":bodyData}))
      })
      .then( r => r.json() )
      .then( data => {
          callback(data)
      })
    }

export default Fetch