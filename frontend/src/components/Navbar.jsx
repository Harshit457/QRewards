import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaBars,
  FaTimes,
  FaUserCircle,
  FaGift,
  FaQrcode,
} from "react-icons/fa";
import Logo from "./common/Logo";
import { useSelector, useDispatch } from "react-redux";
import { logout, checkAuth } from "../store/authuserslice.js"; // Assuming you have a logout action for Redux

function Navbar({ transparent = false, minimal = false }) {
  const [scrolled, setScrolled] = useState(false);

  const [isOpen, setIsOpen] = useState(false);
  const { user, loading, error } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  let isLoggedIn = Boolean(user);
  const [userType, setUserType] = useState(""); // 'user' or 'company'

  // Set user type based on localStorage or Redux state
  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);
  useEffect(() => {
    if (user) {
      setUserType(user.role || "user");
    } else {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUserType(JSON.parse(storedUser).type || "user");
      }
    }
  }, [user]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  const logoutHandler = () => {
    localStorage.removeItem("user");
    dispatch(logout()); // Dispatch Redux logout action
    setUserType("");
    navigate("/");
  };

  return (
    <header
      className={`sticky top-0 z-50 rounded-sm transition-all duration-300 ${
        scrolled || !transparent ? "bg-white shadow-md" : "bg-transparent"
      }`}
    >
      <nav className="container-custom flex items-center justify-between py-4">
        <Link to="/" className="flex items-center space-x-2">
          <Logo
            size={40}
            color={scrolled || !transparent ? "#0066FF" : "#0066FF"}
          />
          <span
            className={`text-xl font-bold ${
              scrolled || !transparent ? "text-slate-900" : "text-slate-900"
            }`}
          >
            QReward
          </span>
        </Link>

        {/* Desktop Menu */}
        {!minimal && (
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`hover:text-primary-500 transition-colors ${
                scrolled || !transparent ? "text-slate-700" : "text-slate-700"
              }`}
            >
              Home
            </Link>
            <a
              href="#how-it-works"
              className={`hover:text-primary-500 transition-colors ${
                scrolled || !transparent ? "text-slate-700" : "text-slate-700"
              }`}
            >
              How It Works
            </a>
            <a
              href="#testimonials"
              className={`hover:text-primary-500 transition-colors ${
                scrolled || !transparent ? "text-slate-700" : "text-slate-700"
              }`}
            >
              Success Stories
            </a>

            {/* Check if user is logged in */}
            {isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={toggleDropdown}
                  className="flex items-center space-x-2 btn btn-primary"
                >
                  <FaUserCircle />
                  <span>Dashboard</span>
                </button>
                {isOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <Link
                      to={`/${userType}/dashboard`}
                      className="block px-4 py-2 text-slate-800 hover:bg-slate-100"
                      onClick={() => setIsOpen(false)}
                    >
                      Dashboard
                    </Link>
                    {userType === "user" && (
                      <>
                        <Link
                          to="/user/offers"
                          className="block px-4 py-2 text-slate-800 hover:bg-slate-100"
                          onClick={() => setIsOpen(false)}
                        >
                          <FaGift className="inline mr-2" /> Browse Offers
                        </Link>
                        {/* <Link
                          to="/user/scan"
                          className="block px-4 py-2 text-slate-800 hover:bg-slate-100"
                          onClick={() => setIsOpen(false)}
                        >
                          <FaQrcode className="inline mr-2" /> Scan QR
                        </Link> */}
                      </>
                    )}
                    {userType === "company" && (
                      <Link
                        to="/company/promotion/create"
                        className="block px-4 py-2 text-slate-800 hover:bg-slate-100"
                        onClick={() => setIsOpen(false)}
                      >
                        Create Promotion
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        logoutHandler();
                        setIsOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-slate-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="btn btn-secondary">
                  Log In
                </Link>
                <Link to="/register" className="btn btn-primary">
                  Register
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Mobile menu button */}
        {!minimal && (
          <button
            className="md:hidden text-slate-800 p-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        )}
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && !minimal && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white shadow-lg overflow-hidden"
          >
            <div className="container-custom py-4 flex flex-col space-y-4">
              <Link
                to="/"
                className="py-2 text-slate-700 hover:text-primary-500"
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              <a
                href="/#how-it-works"
                className="py-2 text-slate-700 hover:text-primary-500"
                onClick={() => setIsOpen(false)}
              >
                How It Works
              </a>
              <Link
                to="/#testimonials"
                className="py-2 text-slate-700 hover:text-primary-500"
                onClick={() => setIsOpen(false)}
              >
                Success Stories
              </Link>

              {/* Check if user is logged in */}
              {isLoggedIn ? (
                <>
                  <Link
                    to={`/${userType}/dashboard`}
                    className="py-2 text-slate-700 hover:text-primary-500"
                    onClick={() => setIsOpen(false)}
                  >
                    Dashboard
                  </Link>
                  {userType === "user" && (
                    <>
                      <Link
                        to="/user/offers"
                        className="py-2 text-slate-700 hover:text-primary-500"
                        onClick={() => setIsOpen(false)}
                      >
                        <FaGift className="inline mr-2" /> Browse Offers
                      </Link>
                      <Link
                        to="/user/scan"
                        className="py-2 text-slate-700 hover:text-primary-500"
                        onClick={() => setIsOpen(false)}
                      >
                        <FaQrcode className="inline mr-2" /> Scan QR
                      </Link>
                    </>
                  )}
                  {userType === "company" && (
                    <Link
                      to="/company/promotion/create"
                      className="py-2 text-slate-700 hover:text-primary-500"
                      onClick={() => setIsOpen(false)}
                    >
                      Create Promotion
                    </Link>
                  )}
                  <button
                    onClick={logoutHandler}
                    className="py-2 text-red-600 hover:text-red-700 text-left"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="flex flex-col space-y-2">
                  <Link to="/login" className="btn btn-secondary w-full">
                    Log In
                  </Link>
                  <Link
                    to="/register"
                    className="btn btn-primary w-full"
                    onClick={() => setIsOpen(false)}
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export default Navbar;
