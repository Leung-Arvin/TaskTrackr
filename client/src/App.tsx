import './App.css'

import { Routes, Route } from 'react-router-dom'
import BoardDashboard from './pages/BoardDashboard'
import BoardForm from './pages/BoardForm'
import FavoriteDashboard from './pages/FavoriteDashboard'
import Boardpage from './pages/Boardpage'
import { ThemeProvider } from './components/theme-provider'
import {Toaster} from '@/components/ui/toaster'
import SignInPage from './pages/SignInPage'
import SignUpPage from './pages/SignUpPage'
import { AuthProvider } from './contexts/AuthContext'


function App() {
  return (
    <AuthProvider>
      <ThemeProvider defaultTheme='light' storageKey='vite-ui-theme'>
        
        <Routes>
          <Route path="/" element={<BoardDashboard/>}/>
          <Route path="/:userId" element={<BoardDashboard />}/>
          <Route path="/favorites/:userId" element={<FavoriteDashboard />}/>
          <Route path="/boardForm/:userId" element={<BoardForm />}/>
          <Route path="/user/:userId/board/:boardId" element={<Boardpage />}/>
          <Route path="/login" element={<SignInPage />}/>
          <Route path="/signup" element={<SignUpPage/>}/>
          </Routes>
        <Toaster/>
      </ThemeProvider>
    </AuthProvider>
  )
}

export default App
