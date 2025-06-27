import { Routes, Route } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import Layout from './components/Layout'
import LoadingScreen from './components/common/LoadingScreen'

// Lazy load pages
const LandingPage = lazy(() => import('./pages/LandingPage'))
const LoginPage = lazy(() => import('./pages/LoginPage'))
const RegisterPage = lazy(() => import('./pages/RegisterPage'))
const UserDashboard = lazy(() => import('./pages/user/Dashboard'))
const KycVerification = lazy(() => import('./pages/user/KycVerification'))
const CompanyDashboard = lazy(() => import('./pages/company/Dashboard'))
const CreatePromotion = lazy(() => import('./pages/company/CreatePromotion'))
const QrScanner = lazy(() => import('./pages/user/QrScanner'))
const WinningPage = lazy(() => import('./pages/user/WinningPage'))
const Offers = lazy(() => import('./pages/user/Offers'))

function App() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<LandingPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          
          {/* User routes */}
          <Route path="user">
            <Route path="dashboard" element={<UserDashboard />} />
            <Route path="kyc" element={<KycVerification />} />
            <Route path="scan" element={<QrScanner />} />
            <Route path="winning/:id" element={<WinningPage />} />
            <Route path="offers" element={<Offers />} />
          </Route>
          
          {/* Company routes */}
          <Route path="company">
            <Route path="dashboard" element={<CompanyDashboard />} />
            <Route path="promotion/create" element={<CreatePromotion />} />
          </Route>
        </Route>
      </Routes>
    </Suspense>
  )
}

export default App