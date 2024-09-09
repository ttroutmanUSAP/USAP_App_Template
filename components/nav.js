import React from 'react'
import Link from 'next/link'
import Head from 'next/head'
import Cookies from 'js-cookie';
import { useRouter } from "next/router";
import _ from 'underscore'

const Nav = props =>{

    const router = useRouter();

    const handleLogout = ()=>{
        const c = confirm('Are you sure you want to log out?')

        if(c){
            router.push('/')
            Cookies.remove('sessionID')
        }
    }

    const getDisplay = props =>{
     let display = (
            <div>
                {
                    props?.view === "false" ?
                        <div>
                            <Head>
                                <title>USAP App</title>
                                <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossOrigin="anonymous" />
                                <link rel="stylesheet" href="/styles.css"></link>
                            </Head>
                        </div>
                    
                    :
                        <div>
                            <Head>
                                <title>USAP App</title>
                                <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossOrigin="anonymous" />
                                <link
                                    rel="stylesheet" 
                                    href="https://use.fontawesome.com/releases/v5.7.2/css/all.css" 
                                    integrity="sha384-fnmOCqbTlWIlj8LyTjo7mOUStjsKC4pOpQbqyi7RrhN7udi9RwhKkMHpvLbHG9Sr" 
                                    crossOrigin="anonymous"
                                />
                                <link
                                    rel="stylesheet" 
                                    href="https://unpkg.com/material-components-web@latest/dist/material-components-web.min.css"
                                />
                                <link rel="stylesheet" href="/styles.css"></link>
                            </Head>

                                <nav className="navbar navbar-expand-md navbar-dark nav-USAP">
                                    <div>
                                        <img src="/__sitelogo__usap2.png" className='mr-2'/> 
                                        USAP App
                                    </div>
                                    {   
                                        !_.isUndefined(Cookies.get()?.sessionID) && router.route !== '/' ?
                                            <div>
                                                <button onClick={()=>handleLogout()} className="float-right btn btn-secondary btn-sm">Logout - {Cookies.get()?.sessionID}</button>
                                            </div>
                                        :
                                            <></>
                                    }
                                </nav>
                            

                        </div>
                }
            </div>
        )
    
        return display
    }

    return getDisplay()

  }
  
  export default Nav