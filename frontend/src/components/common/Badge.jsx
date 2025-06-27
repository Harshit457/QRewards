import { motion } from 'framer-motion';
import badge from "../../assets/boltimgwhite.png";

function Badge({ size = 40 }) {
  return (
    <motion.img
      src={badge}
      alt="Badge"
      width={size}
      height={size}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      style={{
        position: "absolute",
        top: 20,
        right: 20,
        zIndex: 50,
        pointerEvents: "none", // Makes sure it doesn't block interactions
      }}
    />
  );
}

export default Badge;
