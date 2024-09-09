 import Nav from './Nav'
 import Footer from './Footer'
 
 let Layout = (props) => {
    return(
        <div>
            <Nav />
                {props.children}
            <Footer />
        </div>
    )
  }
  
  export default Layout