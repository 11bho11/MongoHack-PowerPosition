import { BrowserRouter, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<div>Landing</div>} />
        <Route path="/calendar" element={<div>Calendar</div>} />
        <Route path="/plan" element={<div>Plan</div>} />
        <Route path="/config" element={<div>Config</div>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
