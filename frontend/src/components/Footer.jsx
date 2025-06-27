import { Link } from 'react-router-dom'
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa'
import Logo from './common/Logo'

function Footer({ minimal = false }) {
  if (minimal) {
    return (
      <footer className="bg-white py-4 text-center text-slate-500 text-sm">
        <div className="container-custom">
          <p>© {new Date().getFullYear()} WinScan. All rights reserved.</p>
        </div>
      </footer>
    )
  }

  return (
    <footer className="bg-slate-900 text-white pt-12 pb-6">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <Logo size={32} color="#FFFFFF" />
              <span className="text-xl font-bold">WinScan</span>
            </Link>
            <p className="text-slate-300">
              The most trusted platform for legitimate QR code promotions and instant prizes.
            </p>
            <div className="flex space-x-4 mt-6">
              <a href="#" className="text-white hover:text-primary-500 transition-colors">
                <FaFacebook size={20} />
              </a>
              <a href="#" className="text-white hover:text-primary-500 transition-colors">
                <FaTwitter size={20} />
              </a>
              <a href="#" className="text-white hover:text-primary-500 transition-colors">
                <FaInstagram size={20} />
              </a>
              <a href="#" className="text-white hover:text-primary-500 transition-colors">
                <FaLinkedin size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-slate-300 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-slate-300 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-slate-300 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-slate-300 hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">For Companies</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/company/register" className="text-slate-300 hover:text-white transition-colors">
                  Create Account
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-slate-300 hover:text-white transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/case-studies" className="text-slate-300 hover:text-white transition-colors">
                  Case Studies
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-slate-300 hover:text-white transition-colors">
                  Resources
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/terms" className="text-slate-300 hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-slate-300 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/compliance" className="text-slate-300 hover:text-white transition-colors">
                  Compliance
                </Link>
              </li>
              <li>
                <Link to="/security" className="text-slate-300 hover:text-white transition-colors">
                  Security
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-800 pt-6 text-sm text-slate-400">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
            <p>© {new Date().getFullYear()} WinScan. All rights reserved.</p>
            <div className="flex space-x-4">
              <Link to="/terms" className="hover:text-white transition-colors">
                Terms
              </Link>
              <Link to="/privacy" className="hover:text-white transition-colors">
                Privacy
              </Link>
              <Link to="/cookies" className="hover:text-white transition-colors">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer