import React from 'react'
import Head from 'next/head'
import Layout from '../components/Layout'
import Login from '../components/Login'

const Home = () => (
  <>
    <Layout>

      <div className="container mt-4">
        <Login />
      </div>

    </Layout>
  </>
)

export default Home
