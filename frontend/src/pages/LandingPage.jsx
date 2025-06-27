import { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import {
  FaCheckCircle,
  FaShieldAlt,
  FaQrcode,
  FaMoneyBillWave,
  FaMedal,
} from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import Badge from "../components/common/Badge";

function LandingPage() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);

  const featuresRef = useRef(null);
  const featuresInView = useInView(featuresRef, {
    once: true,
    margin: "-100px",
  });

  const howItWorksRef = useRef(null);
  const howItWorksInView = useInView(howItWorksRef, {
    once: true,
    margin: "-100px",
  });

  const testimonialsRef = useRef(null);
  const testimonialsInView = useInView(testimonialsRef, {
    once: true,
    margin: "-100px",
  });

  // Mock data for testimonials
  const testimonials = [
    {
      id: 1,
      name: "Ravi Kumar",
      company: "SparkTech Solutions",
      text: "Our QR promotion with QReward exceeded expectations! We saw a 300% increase in customer engagement and brand awareness.",
      image:
        "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150",
      logo: "https://images.pexels.com/photos/5473302/pexels-photo-5473302.jpeg?auto=compress&cs=tinysrgb&w=100",
    },
    {
      id: 2,
      name: "Priya Sharma",
      company: "LuxeStyles",
      text: "QReward transformed our retail promotion. The transparency and security gave our customers confidence in our prizes.",
      image:
        "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150",
      logo: "https://images.pexels.com/photos/5926397/pexels-photo-5926397.jpeg?auto=compress&cs=tinysrgb&w=100",
    },
    {
      id: 3,
      name: "Aditya Patel",
      company: "GreenEco Products",
      text: "The platform's KYC verification and secure prize distribution made our promotion credible and successful.",
      image:
        "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150",
      logo: "https://images.pexels.com/photos/4483610/pexels-photo-4483610.jpeg?auto=compress&cs=tinysrgb&w=100",
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <motion.div className="absolute inset-0 w-full h-full" style={{ y }}>
          <div className="absolute inset-0 bg-black opacity-40"></div>
          <img
            src="https://images.pexels.com/photos/7876708/pexels-photo-7876708.jpeg?auto=compress&cs=tinysrgb&w=1600"
            alt="Background"
            className="w-full h-full object-cover"
          />
        </motion.div>

        <div className="container-custom relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Create Legitimate QR Prize Promotions
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Build trust with verified instant prizes and secure, transparent
              distributions.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/register" className="btn btn-gold btn-lg">
                Get Started
              </Link>
              <Link to="/#how-it-works" className="btn btn-secondary btn-lg">
                Learn How It Works
              </Link>
            </div>

            <div className="mt-12 flex flex-wrap justify-center gap-6">
              <div className="flex items-center space-x-2">
                <FaShieldAlt className="text-gold-500" size={20} />
                <span>100% Secure</span>
              </div>
              <div className="flex items-center space-x-2">
                <FaCheckCircle className="text-gold-500" size={20} />
                <span>Verified Prizes</span>
              </div>
              <div className="flex items-center space-x-2">
                <FaMoneyBillWave className="text-gold-500" size={20} />
                <span>Instant Winnings</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-white" ref={featuresRef}>
        <div className="container-custom">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={featuresInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Companies Choose QReward
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Our platform provides all the tools needed to run legitimate,
              transparent prize promotions that customers trust.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              className="card p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={featuresInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="bg-primary-50 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                <FaShieldAlt className="text-primary-500" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Secure & Transparent
              </h3>
              <p className="text-slate-600">
                All prize funds are secured in smart contracts, ensuring
                transparency and building customer trust.
              </p>
            </motion.div>

            <motion.div
              className="card p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={featuresInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="bg-primary-50 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                <FaQrcode className="text-primary-500" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Advanced QR System</h3>
              <p className="text-slate-600">
                Generate unique, secure QR codes with predefined winning odds
                and prize allocations.
              </p>
            </motion.div>

            <motion.div
              className="card p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={featuresInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <div className="bg-primary-50 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                <FaMedal className="text-primary-500" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Verified Winners</h3>
              <p className="text-slate-600">
                KYC-verified users ensure legitimate prize claims and prevent
                fraud.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section
        id="how-it-works"
        className="py-16 md:py-24 bg-slate-50"
        ref={howItWorksRef}
      >
        <div className="container-custom">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={howItWorksInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              QReward makes it easy to create legitimate prize promotions that
              your customers will trust.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="relative">
                <div className="absolute h-full w-1 bg-primary-500 left-6 top-0 z-0"></div>

                <motion.div
                  className="relative z-10 flex mb-8"
                  initial={{ opacity: 0, x: -50 }}
                  animate={howItWorksInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  <div className="bg-primary-500 text-white rounded-full w-12 h-12 flex items-center justify-center shrink-0">
                    1
                  </div>
                  <div className="ml-4 bg-white p-4 rounded-lg shadow-sm">
                    <h3 className="font-semibold mb-2">Company Registration</h3>
                    <p className="text-slate-600">
                      Companies register on the platform and verify their
                      business credentials.
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  className="relative z-10 flex mb-8"
                  initial={{ opacity: 0, x: -50 }}
                  animate={howItWorksInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  <div className="bg-primary-500 text-white rounded-full w-12 h-12 flex items-center justify-center shrink-0">
                    2
                  </div>
                  <div className="ml-4 bg-white p-4 rounded-lg shadow-sm">
                    <h3 className="font-semibold mb-2">Create Promotion</h3>
                    <p className="text-slate-600">
                      Set up prize amounts, number of QR codes, and winning odds
                      through the dashboard.
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  className="relative z-10 flex mb-8"
                  initial={{ opacity: 0, x: -50 }}
                  animate={howItWorksInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.9 }}
                >
                  <div className="bg-primary-500 text-white rounded-full w-12 h-12 flex items-center justify-center shrink-0">
                    3
                  </div>
                  <div className="ml-4 bg-white p-4 rounded-lg shadow-sm">
                    <h3 className="font-semibold mb-2">Fund Promotion</h3>
                    <p className="text-slate-600">
                      Deposit prize money into the secure smart contract to
                      guarantee payments.
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  className="relative z-10 flex"
                  initial={{ opacity: 0, x: -50 }}
                  animate={howItWorksInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, delay: 1.2 }}
                >
                  <div className="bg-primary-500 text-white rounded-full w-12 h-12 flex items-center justify-center shrink-0">
                    4
                  </div>
                  <div className="ml-4 bg-white p-4 rounded-lg shadow-sm">
                    <h3 className="font-semibold mb-2">Deploy QR Codes</h3>
                    <p className="text-slate-600">
                      Distribute uniquely generated QR codes in products,
                      stores, or advertising.
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>

            <div>
              <div className="relative">
                <div className="absolute h-full w-1 bg-primary-500 left-6 top-0 z-0"></div>

                <motion.div
                  className="relative z-10 flex mb-8"
                  initial={{ opacity: 0, x: -50 }}
                  animate={howItWorksInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, delay: 1.5 }}
                >
                  <div className="bg-gold-500 text-slate-900 rounded-full w-12 h-12 flex items-center justify-center shrink-0">
                    5
                  </div>
                  <div className="ml-4 bg-white p-4 rounded-lg shadow-sm">
                    <h3 className="font-semibold mb-2">
                      Users Register & Verify
                    </h3>
                    <p className="text-slate-600">
                      Users create accounts and complete KYC verification for
                      prize eligibility.
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  className="relative z-10 flex mb-8"
                  initial={{ opacity: 0, x: -50 }}
                  animate={howItWorksInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, delay: 1.8 }}
                >
                  <div className="bg-gold-500 text-slate-900 rounded-full w-12 h-12 flex items-center justify-center shrink-0">
                    6
                  </div>
                  <div className="ml-4 bg-white p-4 rounded-lg shadow-sm">
                    <h3 className="font-semibold mb-2">Scan QR Codes</h3>
                    <p className="text-slate-600">
                      Users scan QR codes using the QReward app to instantly
                      discover if they've won.
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  className="relative z-10 flex mb-8"
                  initial={{ opacity: 0, x: -50 }}
                  animate={howItWorksInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, delay: 2.1 }}
                >
                  <div className="bg-gold-500 text-slate-900 rounded-full w-12 h-12 flex items-center justify-center shrink-0">
                    7
                  </div>
                  <div className="ml-4 bg-white p-4 rounded-lg shadow-sm">
                    <h3 className="font-semibold mb-2">Claim Prizes</h3>
                    <p className="text-slate-600">
                      Winners claim their prizes directly through the platform
                      with instant verification.
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  className="relative z-10 flex"
                  initial={{ opacity: 0, x: -50 }}
                  animate={howItWorksInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, delay: 2.4 }}
                >
                  <div className="bg-gold-500 text-slate-900 rounded-full w-12 h-12 flex items-center justify-center shrink-0">
                    8
                  </div>
                  <div className="ml-4 bg-white p-4 rounded-lg shadow-sm">
                    <h3 className="font-semibold mb-2">Transparent Payout</h3>
                    <p className="text-slate-600">
                      Prizes are automatically transferred to winners through
                      our secure payment system.
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section
        id="testimonials"
        className="py-16 md:py-24 bg-white"
        ref={testimonialsRef}
      >
        <div className="container-custom">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={testimonialsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Success Stories
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              See how companies are building trust and boosting engagement with
              QReward.
            </p>
          </motion.div>

          <Swiper
            spaceBetween={30}
            slidesPerView={1}
            breakpoints={{
              640: {
                slidesPerView: 2,
              },
              1024: {
                slidesPerView: 3,
              },
            }}
            className="pb-12"
          >
            {testimonials.map((testimonial) => (
              <SwiperSlide key={testimonial.id} className="h-auto">
                <motion.div
                  className="card h-full flex flex-col"
                  initial={{ opacity: 0, y: 20 }}
                  animate={testimonialsInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.2 * testimonial.id }}
                >
                  <div className="p-6 flex-grow">
                    <div className="flex items-center mb-4">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="ml-3">
                        <h4 className="font-semibold">{testimonial.name}</h4>
                        <p className="text-sm text-slate-500">
                          {testimonial.company}
                        </p>
                      </div>
                    </div>
                    <p className="text-slate-700">"{testimonial.text}"</p>
                  </div>
                  <div className="bg-slate-50 p-4 border-t border-slate-100 flex items-center mt-auto">
                    <img
                      src={testimonial.logo}
                      alt={testimonial.company}
                      className="h-8 object-contain"
                    />
                    <div className="ml-3 flex">
                      {[...Array(5)].map((_, i) => (
                        <FaCheckCircle key={i} className="text-gold-500 mr-1" />
                      ))}
                    </div>
                  </div>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-primary-600 text-white">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Create Your First Promotion?
            </h2>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              Join hundreds of companies using QReward to build trust and
              engagement through transparent prize promotions.
            </p>
            <Link to="/register" className="btn btn-gold btn-lg">
              Get Started Now
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}

export default LandingPage;
