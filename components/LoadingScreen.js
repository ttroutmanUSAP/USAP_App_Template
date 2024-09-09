import Layout from './Layout'
import Loading from './Loading'

const LoadingScreen = () =>{
        return(
        <Layout>
            <div className="container mt-4 p-3 mdc-elevation--z8">
                <div className="loading">
                    <Loading />
                </div>
            </div>
        </Layout>
        )
}

export default LoadingScreen