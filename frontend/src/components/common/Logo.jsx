import { motion } from "framer-motion";
import logoImage from "../../assets/logo.jpg"; // Correct path to your image

function Logo({ size = 60 }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: 12,
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <motion.img
        src={logoImage}
        alt="Logo"
        style={{
          width: size * 0.9,
          height: size * 0.9,
          objectFit: "contain",
        }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      />
    </div>
  );
}

export default Logo;
