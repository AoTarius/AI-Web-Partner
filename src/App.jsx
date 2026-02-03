import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { MainLayout } from '@/layouts/MainLayout'
import { Home } from '@/pages/Home'
import { DesignSystem } from '@/pages/DesignSystem'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="design-system" element={<DesignSystem />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
