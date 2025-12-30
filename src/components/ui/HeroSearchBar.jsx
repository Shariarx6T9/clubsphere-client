import { motion } from "framer-motion";

const HeroSearchBar = ({ searchTerm, setSearchTerm, handleSearch }) => {
  return (
    <motion.form
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7, duration: 0.6 }}
      onSubmit={handleSearch}
      className="mb-8 max-w-2xl mx-auto"
    >
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search for clubs, events, or interests..."
          className="w-full px-6 py-4 text-lg rounded-2xl bg-white/95 backdrop-blur-sm text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-white/30 shadow-2xl"
        />
        <button
          type="submit"
          className="absolute right-2 top-2 bottom-2 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors font-medium"
        >
          Search
        </button>
      </div>
    </motion.form>
  );
};

export default HeroSearchBar;