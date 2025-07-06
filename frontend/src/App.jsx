import  { useEffect } from 'react'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import SignUpPage from './pages/SignUpPage'
import SignInPage from './pages/SignInPage'
import ProfilePage from './pages/ProfilePage'
import SettingPage from './pages/SettingPage'
import NotFoundPage from './pages/NotFoundPage'
import {CircularProgress} from "@mui/material"

import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuthStore } from './store/useAuthStore'
import { Toaster } from 'react-hot-toast'
import { useThemeStore } from './store/useThemeStore'

const App = () => {
  const {authUser,checkAuth,isCheckingAuth,onlineUsers} = useAuthStore();
  console.log(onlineUsers);
  const {theme} = useThemeStore()
  useEffect(()=>{
    checkAuth()
  },[checkAuth])

  // console.log(authUser);

  // show loder if is currently checking auth and no authenticated user found yet
  if (isCheckingAuth && !authUser) return (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    <CircularProgress />
  </div>
);

  return (
    <div data-theme={theme}>
      <Navbar/>

      <Routes>
        <Route path='/' element={authUser ? <HomePage/>:<Navigate to="/signin" />}/>
        <Route path='/signup' element={!authUser ? <SignUpPage/> : <Navigate to="/" />}/>
        <Route path='/signin' element={!authUser ? <SignInPage/> : <Navigate to="/" />}/>
        <Route path='/profile' element={authUser ? <ProfilePage/> : <Navigate to="/signin" />}/>
        <Route path='/setting' element={<SettingPage/>}/>
        <Route path='/*' element={<NotFoundPage/>}/>
      </Routes>

      <Toaster/>

    </div>
  )
}

export default App