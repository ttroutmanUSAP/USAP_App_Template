import Head from 'next/head'
import Layout from './Layout'

const unauthorizedDisplay = () =>{
    return(
        <div>
            <Head>
                <title>USAP App</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Layout>
            </Layout>
            
        </div>
    )
}

export default unauthorizedDisplay