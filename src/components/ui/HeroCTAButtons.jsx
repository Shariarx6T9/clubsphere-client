import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const HeroCTAButtons = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.9, duration: 0.6 }}
      className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
    >
      <Link
        to="/clubs"
        className="group bg-white text-blue-600 hover:bg-blue-50 font-semibold px-8 py-4 rounded-xl transition-all duration-300 shadow-2xl hover:shadow-3xl hover:scale-105"
      >
        <span className="flex items-center justify-center gap-2">
          Explore Clubs
          <motion.span
            animate={{ x: [0, 5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            →
          </motion.span>
        </span>
      </Link>
      <Link
        to="/register"
        className="group border-2 border-white text-white hover:bg-white hover:text-blue-600 font-semibold px-8 py-4 rounded-xl transition-all duration-300 backdrop-blur-sm hover:scale-105"
      >
        Join Community
      </Link>
    </motion.div>
  );
};

export default HeroCTAButtons;