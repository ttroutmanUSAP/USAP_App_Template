import React, {useState, useEffect} from 'react'
import Head from 'next/head'
import 'react-tabs/style/react-tabs.css';
import Layout from '../components/Layout'
import Auth from '../lib/Auth' 
import UnAuthorizedDisplay from '../components/unAuthorizedDisplay'

const Home = () => {
    
    const [auth, setAuth] = useState(false)
    const [display, setDisplay] = useState()
    
    //authenticate & get inital state
    useEffect(()=>{
        if(!auth){
            Auth("mainCAR", (r) => {
                console.log("auth used")
                setAuth(r);
            })
        }
    }, []) //runs once on load

    useEffect(()=>{
        if(auth){
            
        }
    }, [auth]) //runs once on load

    useEffect(()=>{
        setDisplay(
            (auth === "1") ?
                <>
                    <Head>
                    <title>USAP App</title>
                    <link rel="icon" href="/favicon.ico" />
                    </Head>

                    <Layout>

                        <div className='container mt-4'>

                            USAP App

                        </div>

                    </Layout>
                </>
            : 
                <UnAuthorizedDisplay/>
        )
    },[auth])

    return(display)
    
}

export default Home
