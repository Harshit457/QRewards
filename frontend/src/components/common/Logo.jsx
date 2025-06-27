import { motion } from 'framer-motion'

function Logo({ size = 40, color = "#0066FF" }) {
  return (
    <motion.svg 
      width={size} 
      height={size} 
      viewBox="0 0 80 80" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.rect 
        x="10" 
        y="10" 
        width="60" 
        height="60" 
        rx="12" 
        fill={color} 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      />
      <motion.path 
        d="M25 25H35V35H25V25ZM45 25H55V35H45V25ZM25 45H35V55H25V45Z" 
        fill="white"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      />
      <motion.path 
        d="M55 45L50 55L45 45H55Z" 
        fill="#FFD700"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3, delay: 0.5 }}
      />
      <motion.circle 
        cx="50" 
        cy="50" 
        r="5" 
        fill="#FFD700"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3, delay: 0.7 }}
      />
    </motion.svg>
  )
}

export default Logo