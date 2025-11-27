import React from 'react'
import { Outlet } from 'react-router-dom'
import PublicNav from './PublicNav'
import PublicFooter from './PublicFooter'
import './Public.css'

const PublicLayout = () => {
  return (
    <div className="public-layout">
      <PublicNav />
      <main className="public-main">
        <Outlet />
      </main>
      <PublicFooter />
    </div>
  )
}

export default PublicLayout

