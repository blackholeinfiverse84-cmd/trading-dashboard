import React from 'react'
import { Outlet } from 'react-router-dom'
import PublicNav from './PublicNav'
import PublicFooter from './PublicFooter'
import ThemeToggle from '../ThemeToggle'
import './Public.css'

const PublicLayout = () => {
  return (
    <div className="public-layout">
      <PublicNav />
      <div className="public-theme-toggle">
        <ThemeToggle />
      </div>
      <main className="public-main">
        <Outlet />
      </main>
      <PublicFooter />
    </div>
  )
}

export default PublicLayout

