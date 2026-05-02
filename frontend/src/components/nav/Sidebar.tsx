import { NavLink } from 'react-router-dom'

const navItems = [
  { to: '/calendar', label: 'Calendar', icon: '📅' },
  { to: '/plan', label: 'Coaching Plan', icon: '🎯' },
  { to: '/config', label: 'Config', icon: '⚙️' },
]

export default function Sidebar() {
  return (
    <nav style={{
      position: 'fixed',
      left: 0,
      top: 0,
      bottom: 0,
      width: '220px',
      background: '#0f0f2a',
      borderRight: '1px solid #1a1a3e',
      display: 'flex',
      flexDirection: 'column',
      padding: '24px 0',
      zIndex: 100,
    }}>
      {/* Logo */}
      <div style={{
        padding: '0 20px 24px',
        borderBottom: '1px solid #1a1a3e',
        marginBottom: '16px',
      }}>
        <span style={{
          fontSize: '16px',
          fontWeight: 700,
          letterSpacing: '0.15em',
          color: '#8b5cf6',
          textTransform: 'uppercase',
        }}>PowerPosition</span>
      </div>

      {/* Nav items */}
      {navItems.map(item => (
        <NavLink
          key={item.to}
          to={item.to}
          style={({ isActive }) => ({
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '12px 20px',
            color: isActive ? '#6366f1' : '#94a3b8',
            background: isActive ? 'rgba(99,102,241,0.1)' : 'transparent',
            borderLeft: isActive ? '3px solid #6366f1' : '3px solid transparent',
            textDecoration: 'none',
            fontSize: '14px',
            fontWeight: isActive ? 600 : 400,
            transition: 'all 0.15s ease',
          })}
        >
          <span>{item.icon}</span>
          <span>{item.label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
