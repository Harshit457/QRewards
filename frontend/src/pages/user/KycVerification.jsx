import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { FaIdCard, FaCamera, FaCheck, FaExclamationTriangle } from 'react-icons/fa'

function KycVerification() {
  const { register, handleSubmit, formState: { errors } } = useForm()
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [selfieUploaded, setSelfieUploaded] = useState(false)
  const [idFrontUploaded, setIdFrontUploaded] = useState(false)
  const [idBackUploaded, setIdBackUploaded] = useState(false)
  const navigate = useNavigate()

  const onSubmitStep1 = (data) => {
    setStep(2)
  }

  const handleFileUpload = (type) => {
    // Simulate file upload
    setIsLoading(true)
    setTimeout(() => {
      if (type === 'selfie') setSelfieUploaded(true)
      if (type === 'idFront') setIdFrontUploaded(true)
      if (type === 'idBack') setIdBackUploaded(true)
      setIsLoading(false)
    }, 1500)
  }

  const handleSubmitKyc = () => {
    setIsLoading(true)
    // Simulate KYC submission
    setTimeout(() => {
      // Update user's KYC status in local storage
      const user = JSON.parse(localStorage.getItem('user'))
      user.isKycVerified = true
      localStorage.setItem('user', JSON.stringify(user))
      
      setIsLoading(false)
      setStep(3)
    }, 2000)
  }

  const handleFinish = () => {
    navigate('/user/dashboard')
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="container-custom">
        <motion.div 
          className="max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="p-6 bg-primary-600 text-white">
            <h1 className="text-xl font-bold flex items-center">
              <FaIdCard className="mr-2" /> KYC Verification
            </h1>
            <p className="mt-1 text-primary-100">
              Complete your identity verification to claim winnings
            </p>
          </div>

          {/* Progress steps */}
          <div className="p-4 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 flex items-center justify-center rounded-full text-white ${
                  step >= 1 ? 'bg-primary-500' : 'bg-slate-300'
                }`}>
                  {step > 1 ? <FaCheck /> : '1'}
                </div>
                <p className="text-xs mt-1">Personal Info</p>
              </div>
              
              <div className="w-1/4 h-1 bg-slate-200 relative">
                <div className={`absolute top-0 left-0 h-full bg-primary-500 transition-all duration-300 ${
                  step >= 2 ? 'w-full' : 'w-0'
                }`}></div>
              </div>
              
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 flex items-center justify-center rounded-full text-white ${
                  step >= 2 ? 'bg-primary-500' : 'bg-slate-300'
                }`}>
                  {step > 2 ? <FaCheck /> : '2'}
                </div>
                <p className="text-xs mt-1">Documents</p>
              </div>
              
              <div className="w-1/4 h-1 bg-slate-200 relative">
                <div className={`absolute top-0 left-0 h-full bg-primary-500 transition-all duration-300 ${
                  step >= 3 ? 'w-full' : 'w-0'
                }`}></div>
              </div>
              
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 flex items-center justify-center rounded-full text-white ${
                  step >= 3 ? 'bg-primary-500' : 'bg-slate-300'
                }`}>
                  {step > 3 ? <FaCheck /> : '3'}
                </div>
                <p className="text-xs mt-1">Verification</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-lg font-semibold mb-4">Personal Information</h2>
                
                <div className="bg-slate-50 p-4 rounded-md mb-6 flex items-start">
                  <FaExclamationTriangle className="text-gold-500 mt-1 mr-3 flex-shrink-0" />
                  <p className="text-sm text-slate-700">
                    Please provide accurate information as per your government-issued ID. This information 
                    will be used to verify your identity and process your winnings.
                  </p>
                </div>

                <form onSubmit={handleSubmit(onSubmitStep1)}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label htmlFor="fullName" className="block text-sm font-medium text-slate-700 mb-1">
                        Full Name (as per ID)
                      </label>
                      <input
                        id="fullName"
                        {...register('fullName', {
                          required: 'Full name is required'
                        })}
                        className="input-field"
                      />
                      {errors.fullName && (
                        <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="dob" className="block text-sm font-medium text-slate-700 mb-1">
                        Date of Birth
                      </label>
                      <input
                        id="dob"
                        type="date"
                        {...register('dob', {
                          required: 'Date of birth is required'
                        })}
                        className="input-field"
                      />
                      {errors.dob && (
                        <p className="mt-1 text-sm text-red-600">{errors.dob.message}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="address" className="block text-sm font-medium text-slate-700 mb-1">
                      Full Address
                    </label>
                    <textarea
                      id="address"
                      {...register('address', {
                        required: 'Address is required'
                      })}
                      rows="3"
                      className="input-field"
                    ></textarea>
                    {errors.address && (
                      <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
                    )}
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="idType" className="block text-sm font-medium text-slate-700 mb-1">
                      ID Type
                    </label>
                    <select
                      id="idType"
                      {...register('idType', {
                        required: 'ID type is required'
                      })}
                      className="input-field"
                    >
                      <option value="">Select ID Type</option>
                      <option value="aadhar">Aadhar Card</option>
                      <option value="pan">PAN Card</option>
                      <option value="passport">Passport</option>
                      <option value="driving">Driving License</option>
                      <option value="voter">Voter ID</option>
                    </select>
                    {errors.idType && (
                      <p className="mt-1 text-sm text-red-600">{errors.idType.message}</p>
                    )}
                  </div>
                  
                  <div className="mb-6">
                    <label htmlFor="idNumber" className="block text-sm font-medium text-slate-700 mb-1">
                      ID Number
                    </label>
                    <input
                      id="idNumber"
                      {...register('idNumber', {
                        required: 'ID number is required'
                      })}
                      className="input-field"
                    />
                    {errors.idNumber && (
                      <p className="mt-1 text-sm text-red-600">{errors.idNumber.message}</p>
                    )}
                  </div>
                  
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="btn btn-primary"
                    >
                      Continue
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
            
            {step === 2 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-lg font-semibold mb-4">Upload Documents</h2>
                
                <div className="bg-slate-50 p-4 rounded-md mb-6 flex items-start">
                  <FaExclamationTriangle className="text-gold-500 mt-1 mr-3 flex-shrink-0" />
                  <p className="text-sm text-slate-700">
                    Please upload clear photos of your ID and a selfie. Make sure all text is readable and your face is clearly visible.
                  </p>
                </div>
                
                <div className="space-y-6">
                  <div className="border border-slate-200 rounded-lg overflow-hidden">
                    <div className="bg-slate-50 p-4 border-b border-slate-200">
                      <h3 className="font-medium">Selfie with ID</h3>
                      <p className="text-sm text-slate-500 mt-1">
                        Take a clear photo of yourself holding your ID
                      </p>
                    </div>
                    
                    <div className="p-6 flex flex-col items-center justify-center">
                      {!selfieUploaded ? (
                        <div className="text-center">
                          <div className="w-32 h-32 rounded-full bg-slate-100 flex items-center justify-center mb-4 mx-auto">
                            <FaCamera className="text-slate-400 text-3xl" />
                          </div>
                          
                          <button
                            type="button"
                            onClick={() => handleFileUpload('selfie')}
                            disabled={isLoading}
                            className="btn btn-primary w-full"
                          >
                            {isLoading ? 'Uploading...' : 'Upload Selfie'}
                          </button>
                        </div>
                      ) : (
                        <div className="text-center">
                          <div className="w-32 h-32 rounded-full bg-success-100 flex items-center justify-center mb-4 mx-auto">
                            <FaCheck className="text-success-500 text-3xl" />
                          </div>
                          <p className="text-success-600 font-medium mb-2">Successfully uploaded!</p>
                          <button
                            type="button"
                            onClick={() => setSelfieUploaded(false)}
                            className="text-sm text-primary-600 hover:text-primary-700"
                          >
                            Upload a different photo
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border border-slate-200 rounded-lg overflow-hidden">
                      <div className="bg-slate-50 p-4 border-b border-slate-200">
                        <h3 className="font-medium">ID Front Side</h3>
                        <p className="text-sm text-slate-500 mt-1">
                          Front side of your selected ID
                        </p>
                      </div>
                      
                      <div className="p-6 flex flex-col items-center justify-center">
                        {!idFrontUploaded ? (
                          <div className="text-center">
                            <div className="w-full h-32 bg-slate-100 flex items-center justify-center mb-4 rounded-md">
                              <FaIdCard className="text-slate-400 text-3xl" />
                            </div>
                            
                            <button
                              type="button"
                              onClick={() => handleFileUpload('idFront')}
                              disabled={isLoading}
                              className="btn btn-primary w-full"
                            >
                              {isLoading ? 'Uploading...' : 'Upload Front Side'}
                            </button>
                          </div>
                        ) : (
                          <div className="text-center">
                            <div className="w-full h-32 bg-success-100 flex items-center justify-center mb-4 rounded-md">
                              <FaCheck className="text-success-500 text-3xl" />
                            </div>
                            <p className="text-success-600 font-medium mb-2">Successfully uploaded!</p>
                            <button
                              type="button"
                              onClick={() => setIdFrontUploaded(false)}
                              className="text-sm text-primary-600 hover:text-primary-700"
                            >
                              Upload a different photo
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="border border-slate-200 rounded-lg overflow-hidden">
                      <div className="bg-slate-50 p-4 border-b border-slate-200">
                        <h3 className="font-medium">ID Back Side</h3>
                        <p className="text-sm text-slate-500 mt-1">
                          Back side of your selected ID
                        </p>
                      </div>
                      
                      <div className="p-6 flex flex-col items-center justify-center">
                        {!idBackUploaded ? (
                          <div className="text-center">
                            <div className="w-full h-32 bg-slate-100 flex items-center justify-center mb-4 rounded-md">
                              <FaIdCard className="text-slate-400 text-3xl" />
                            </div>
                            
                            <button
                              type="button"
                              onClick={() => handleFileUpload('idBack')}
                              disabled={isLoading}
                              className="btn btn-primary w-full"
                            >
                              {isLoading ? 'Uploading...' : 'Upload Back Side'}
                            </button>
                          </div>
                        ) : (
                          <div className="text-center">
                            <div className="w-full h-32 bg-success-100 flex items-center justify-center mb-4 rounded-md">
                              <FaCheck className="text-success-500 text-3xl" />
                            </div>
                            <p className="text-success-600 font-medium mb-2">Successfully uploaded!</p>
                            <button
                              type="button"
                              onClick={() => setIdBackUploaded(false)}
                              className="text-sm text-primary-600 hover:text-primary-700"
                            >
                              Upload a different photo
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 flex justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="btn btn-secondary"
                  >
                    Back
                  </button>
                  
                  <button
                    type="button"
                    onClick={handleSubmitKyc}
                    disabled={!selfieUploaded || !idFrontUploaded || !idBackUploaded || isLoading}
                    className="btn btn-primary"
                  >
                    {isLoading ? 'Submitting...' : 'Submit for Verification'}
                  </button>
                </div>
              </motion.div>
            )}
            
            {step === 3 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center py-8"
              >
                <div className="w-20 h-20 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FaCheck className="text-success-500 text-3xl" />
                </div>
                
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Verification Complete!</h2>
                <p className="text-slate-600 mb-6">
                  Your KYC verification has been approved. You can now claim your winnings.
                </p>
                
                <button
                  type="button"
                  onClick={handleFinish}
                  className="btn btn-primary"
                >
                  Return to Dashboard
                </button>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default KycVerification