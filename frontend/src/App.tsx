import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Landing from './pages/Landing'
import CalendarPage from './pages/CalendarPage'
import CoachingPlan from './pages/CoachingPlan'
import Config from './pages/Config'
import Sidebar from './components/nav/Sidebar'

function AppShell() {
  const location = useLocation()
  const showSidebar = location.pathname !== '/'

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0a0a1a' }}>
      {showSidebar && <Sidebar />}
      <main style={{ flex: 1, marginLeft: showSidebar ? '220px' : '0' }}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/plan" element={<CoachingPlan />} />
          <Route path="/config" element={<Config />} />
        </Routes>
      </main>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  )
}

export default App
