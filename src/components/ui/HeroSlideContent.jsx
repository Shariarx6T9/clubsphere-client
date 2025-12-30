import { motion } from "framer-motion";

const HeroSlideContent = ({ slide, currentSlide, slideIndex }) => {
  return (
    <motion.div
      key={currentSlide}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.8 }}
      className="mb-12"
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="mb-4"
      >
        <span className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium mb-6">
          {slide.subtitle}
        </span>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="text-4xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent"
      >
        {slide.title}
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="text-lg md:text-2xl mb-8 text-white/90 max-w-3xl mx-auto leading-relaxed"
      >
        {slide.description}
      </motion.p>
    </motion.div>
  );
};

export default HeroSlideContent;