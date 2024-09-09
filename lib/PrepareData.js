    const prepareData = (formState) => {
        //use spread here or else you are editing the objects by REFERENCE
        let headerData = {...formState}
        let bodyData = [...formState["workData"]]

       delete headerData["workData"]

       for(let i=0; i<bodyData.length; i++){
      //  console.log("body data at "+i)
         //  console.log(bodyData[i])
         //  console.log("header data")
         //  console.log(headerData)
           Object.assign(bodyData[i], headerData)
       }
       console.log(bodyData)
       return bodyData
    }

    export default prepareData