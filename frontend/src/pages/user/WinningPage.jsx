import { useState, useEffect } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Confetti from 'react-confetti'
import { FaTrophy, FaCheckCircle, FaExclamationTriangle, FaCreditCard, FaMoneyBillWave } from 'react-icons/fa'

function WinningPage() {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  
  const [windowDimensions, setWindowDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  })
  const [showConfetti, setShowConfetti] = useState(true)
  const [user, setUser] = useState(null)
  const [claimMethod, setClaimMethod] = useState('')
  const [accountDetails, setAccountDetails] = useState({
    accountNumber: '',
    ifscCode: '',
    accountName: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [claimed, setClaimed] = useState(false)
  
  // Get amount from location state or set a default
  const amount = location.state?.amount || 500
  
  useEffect(() => {
    // Get window dimensions for confetti
    const handleResize = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }
    window.addEventListener('resize', handleResize)
    
    // Stop confetti after 8 seconds
    const timer = setTimeout(() => {
      setShowConfetti(false)
    }, 8000)
    
    // Check for user
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    } else {
      navigate('/login')
    }
    
    return () => {
      window.removeEventListener('resize', handleResize)
      clearTimeout(timer)
    }
  }, [navigate])
  
  const handleClaimMethodChange = (method) => {
    setClaimMethod(method)
  }
  
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setAccountDetails({
      ...accountDetails,
      [name]: value
    })
  }
  
  const handleSubmitClaim = (e) => {
    e.preventDefault()
    
    if (!user?.isKycVerified) {
      navigate('/user/kyc')
      return
    }
    
    setIsSubmitting(true)
    
    // Simulate API call to process claim
    setTimeout(() => {
      // Store the winning in local storage for display in dashboard
      const winnings = JSON.parse(localStorage.getItem('winnings') || '[]')
      winnings.push({
        id: Date.now(),
        date: new Date().toISOString(),
        amount,
        company: 'Demo Company',
        promotion: 'QR Promotion',
        status: 'Claimed'
      })
      localStorage.setItem('winnings', JSON.stringify(winnings))
      
      setIsSubmitting(false)
      setClaimed(true)
    }, 2000)
  }
  
  const handleFinish = () => {
    navigate('/user/dashboard')
  }

  return (
    <div className="min-h-screen bg-slate-900 py-12">
      {showConfetti && (
        <Confetti
          width={windowDimensions.width}
          height={windowDimensions.height}
          recycle={true}
          numberOfPieces={200}
          colors={['#FFD700', '#0066FF', '#E6F0FF', '#FFFFFF']}
        />
      )}
      
      <div className="container-custom">
        <div className="max-w-lg mx-auto">
          <motion.div 
            className="bg-white rounded-xl shadow-lg overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {!claimed ? (
              <>
                <div className="p-8 bg-gradient-to-r from-primary-600 to-primary-700 text-white text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                  >
                    <div className="w-24 h-24 bg-gold-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FaTrophy className="text-white text-4xl" />
                    </div>
                  </motion.div>
                  
                  <h1 className="text-2xl md:text-3xl font-bold mb-2">
                    Congratulations!
                  </h1>
                  
                  <p className="text-xl mb-4">
                    You've won <span className="text-gold-400 font-bold">₹{amount.toLocaleString()}</span>
                  </p>
                  
                  <p className="text-primary-100">
                    Claim your prize now to receive your winnings
                  </p>
                </div>
                
                <div className="p-6">
                  {!user?.isKycVerified && (
                    <div className="bg-gold-50 border-l-4 border-gold-500 p-4 mb-6">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <FaExclamationTriangle className="h-5 w-5 text-gold-500" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-gold-800">
                            You need to complete KYC verification to claim your prize.
                          </p>
                          <p className="mt-2">
                            <button
                              onClick={() => navigate('/user/kyc')}
                              className="text-sm font-medium text-gold-800 underline"
                            >
                              Complete KYC Now
                            </button>
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <h2 className="text-lg font-semibold mb-4">
                    Choose Payment Method
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <button
                      type="button"
                      onClick={() => handleClaimMethodChange('bank')}
                      className={`p-4 border rounded-lg flex flex-col items-center text-center transition-all ${
                        claimMethod === 'bank'
                          ? 'border-primary-500 bg-primary-50 ring-2 ring-primary-500 ring-opacity-50'
                          : 'border-slate-200 hover:border-primary-500'
                      }`}
                      disabled={!user?.isKycVerified}
                    >
                      <FaCreditCard className={`text-3xl mb-2 ${
                        claimMethod === 'bank' ? 'text-primary-500' : 'text-slate-400'
                      }`} />
                      <span className="font-medium">Bank Transfer</span>
                      <span className="text-xs text-slate-500 mt-1">2-3 business days</span>
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => handleClaimMethodChange('wallet')}
                      className={`p-4 border rounded-lg flex flex-col items-center text-center transition-all ${
                        claimMethod === 'wallet'
                          ? 'border-primary-500 bg-primary-50 ring-2 ring-primary-500 ring-opacity-50'
                          : 'border-slate-200 hover:border-primary-500'
                      }`}
                      disabled={!user?.isKycVerified}
                    >
                      <FaMoneyBillWave className={`text-3xl mb-2 ${
                        claimMethod === 'wallet' ? 'text-primary-500' : 'text-slate-400'
                      }`} />
                      <span className="font-medium">Wallet Transfer</span>
                      <span className="text-xs text-slate-500 mt-1">Instant transfer</span>
                    </button>
                  </div>
                  
                  {claimMethod && (
                    <form onSubmit={handleSubmitClaim}>
                      {claimMethod === 'bank' && (
                        <div className="space-y-4">
                          <div>
                            <label htmlFor="accountName" className="block text-sm font-medium text-slate-700 mb-1">
                              Account Holder Name
                            </label>
                            <input
                              id="accountName"
                              name="accountName"
                              type="text"
                              required
                              value={accountDetails.accountName}
                              onChange={handleInputChange}
                              className="input-field"
                              placeholder="As per bank records"
                            />
                          </div>
                          
                          <div>
                            <label htmlFor="accountNumber" className="block text-sm font-medium text-slate-700 mb-1">
                              Account Number
                            </label>
                            <input
                              id="accountNumber"
                              name="accountNumber"
                              type="text"
                              required
                              value={accountDetails.accountNumber}
                              onChange={handleInputChange}
                              className="input-field"
                              placeholder="Your bank account number"
                            />
                          </div>
                          
                          <div>
                            <label htmlFor="ifscCode" className="block text-sm font-medium text-slate-700 mb-1">
                              IFSC Code
                            </label>
                            <input
                              id="ifscCode"
                              name="ifscCode"
                              type="text"
                              required
                              value={accountDetails.ifscCode}
                              onChange={handleInputChange}
                              className="input-field"
                              placeholder="Bank IFSC code"
                            />
                          </div>
                        </div>
                      )}
                      
                      {claimMethod === 'wallet' && (
                        <div className="space-y-4">
                          <div>
                            <label htmlFor="phoneNumber" className="block text-sm font-medium text-slate-700 mb-1">
                              Phone Number
                            </label>
                            <input
                              id="phoneNumber"
                              type="tel"
                              required
                              className="input-field"
                              placeholder="Linked to your wallet"
                              defaultValue={user?.phone || ''}
                            />
                          </div>
                          
                          <div>
                            <label htmlFor="walletProvider" className="block text-sm font-medium text-slate-700 mb-1">
                              Wallet Provider
                            </label>
                            <select 
                              id="walletProvider"
                              required
                              className="input-field"
                            >
                              <option value="">Select Wallet Provider</option>
                              <option value="paytm">Paytm</option>
                              <option value="phonepe">PhonePe</option>
                              <option value="gpay">Google Pay</option>
                              <option value="amazonpay">Amazon Pay</option>
                            </select>
                          </div>
                        </div>
                      )}
                      
                      <div className="mt-6">
                        <button
                          type="submit"
                          disabled={isSubmitting || !user?.isKycVerified}
                          className="btn btn-primary w-full"
                        >
                          {isSubmitting ? 'Processing...' : `Claim ₹${amount.toLocaleString()}`}
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </>
            ) : (
              // Success screen after claiming
              <div className="p-8 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                >
                  <div className="w-24 h-24 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FaCheckCircle className="text-success-500 text-4xl" />
                  </div>
                </motion.div>
                
                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                  Claim Successful!
                </h2>
                
                <p className="text-slate-600 mb-2">
                  Your prize of <span className="font-semibold">₹{amount.toLocaleString()}</span> has been processed.
                </p>
                
                {claimMethod === 'bank' ? (
                  <p className="text-sm text-slate-500 mb-8">
                    You should receive the funds in your bank account within 2-3 business days.
                  </p>
                ) : (
                  <p className="text-sm text-slate-500 mb-8">
                    You should receive the funds in your wallet shortly.
                  </p>
                )}
                
                <button
                  onClick={handleFinish}
                  className="btn btn-primary"
                >
                  Return to Dashboard
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default WinningPage