import LoginForm from './LoginForm'

let Login = (props) => {
    return(
        <div>
            <div className="jumbotron">
                <center className='mb-4'>
                    <h1>USAP App Login</h1>
                </center>
                <LoginForm/>
            </div>
        </div>
    )
  }
  
  export default Login