import React, { Suspense, lazy } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useToast } from '../../contexts/ToastContext'
import Button from '../common/Button'
import Card from '../common/Card'
import { SkeletonCard } from '../common/Skeleton'

const ComponentLoader = () => (
  <div style={{ marginBottom: 'var(--spacing-lg)' }}>
    <SkeletonCard />
  </div>
)
import './MorePage.css'

const LangGraphReport = lazy(() => import('../LangGraphReport'))
const MarketEvents = lazy(() => import('../MarketEvents'))

const MorePage = ({ riskContext }) => {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const { addToast } = useToast()

  const handleLogout = () => {
    logout()
    addToast({
      title: 'Signed out',
      message: 'You have been logged out successfully.',
      variant: 'info',
    })
    navigate('/login')
  }

  return (
    <div className="more-page">
      {/* Settings Section */}
      <Card title="Settings" padding="md">
        <div className="more-settings">
          <Button variant="secondary" fullWidth onClick={() => navigate('/langgraph')}>
            LangGraph Report
          </Button>
          <Button variant="secondary" fullWidth onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </Card>

      {/* LangGraph Report */}
      <Suspense fallback={<ComponentLoader />}>
        <LangGraphReport />
      </Suspense>

      {/* Market Events */}
      <Suspense fallback={<ComponentLoader />}>
        <MarketEvents />
      </Suspense>

      {/* Note: FloatingAIAssistant is always available */}
    </div>
  )
}

export default MorePage

