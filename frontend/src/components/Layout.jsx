import { Outlet } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'

function Layout() {
  const location = useLocation()
  const isLandingPage = location.pathname === '/'
  const isLoginPage = location.pathname === '/login' || location.pathname === '/register'

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar 
        transparent={isLandingPage} 
        minimal={isLoginPage}
      />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer minimal={isLoginPage} />
    </div>
  )
}

export default Layout