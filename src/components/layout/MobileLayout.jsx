import React from 'react'
import { Outlet } from 'react-router-dom'
import { useIsMobile } from '../../hooks/useIsMobile'
import BottomNav from './BottomNav'
import './MobileLayout.css'

const MobileLayout = ({ children }) => {
  const isMobile = useIsMobile()

  return (
    <div className={`mobile-layout ${isMobile ? 'mobile' : 'desktop'}`}>
      <div className="mobile-layout-content">
        {children || <Outlet />}
      </div>
      {isMobile && <BottomNav />}
    </div>
  )
}

export default MobileLayout

