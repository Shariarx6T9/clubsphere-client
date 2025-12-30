import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import HeroSlideContent from "./HeroSlideContent";
import HeroSearchBar from "./HeroSearchBar";
import HeroCTAButtons from "./HeroCTAButtons";

const EnhancedHeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  const heroSlides = [
    {
      title: "Welcome to ClubSphere",
      subtitle: "Discover Amazing Communities",
      description:
        "Connect with like-minded people and build lasting friendships through local clubs and events.",
    },
    {
      title: "Join Local Clubs",
      subtitle: "Find Your Perfect Match",
      description:
        "Browse hundreds of clubs across different categories and interests in your area.",
    },
    {
      title: "Attend Exciting Events",
      subtitle: "Never Miss Out",
      description:
        "Participate in workshops, meetups, and activities that align with your passions.",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      window.location.href = `/clubs?search=${encodeURIComponent(searchTerm)}`;
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="relative min-h-screen flex items-center justify-center overflow-hidden hero-gradient"
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl"
        />
        <motion.div
          animate={{
            x: [0, -80, 0],
            y: [0, 60, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute bottom-20 right-20 w-48 h-48 bg-purple-300/20 rounded-full blur-2xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute top-1/2 left-1/4 w-24 h-24 bg-blue-300/30 rounded-full blur-lg"
        />
      </div>

      <div className="relative z-10 text-center text-white px-4 max-w-6xl mx-auto">
        <HeroSlideContent
          slide={heroSlides[currentSlide]}
          currentSlide={currentSlide}
        />

        <HeroSearchBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          handleSearch={handleSearch}
        />

        <HeroCTAButtons />

        {/* Slide Indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.6 }}
          className="flex justify-center gap-3"
        >
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? "bg-white scale-125"
                  : "bg-white/50 hover:bg-white/75"
              }`}
            />
          ))}
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-white/70 text-center"
        >
          <div className="text-sm mb-2">Scroll to explore</div>
          <div className="w-6 h-10 border-2 border-white/50 rounded-full mx-auto relative">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1 h-3 bg-white/70 rounded-full absolute left-1/2 top-1 transform -translate-x-1/2"
            />
          </div>
        </motion.div>
      </motion.div>
    </motion.section>
  );
};

export default EnhancedHeroSection;