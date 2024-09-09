const validate = () => {
    const reqInputs = document.querySelectorAll(".required")
    let values = []
    for(let i=0; i<reqInputs.length; i++){
        if(reqInputs[i].type !== "checkbox"){
            values.push({name:reqInputs[i].name, value:reqInputs[i].value})
        }
        else{
            values.push({name:reqInputs[i].name, value:reqInputs[i].checked})
        } 
    }
    return values
}

export default validate