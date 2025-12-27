import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { clubAPI } from '../utils/api';

const Clubs = () => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [sort, setSort] = useState('createdAt');
  const [order, setOrder] = useState('desc');
  const [page, setPage] = useState(1);

  const { data, isLoading, error } = useQuery({
    queryKey: ['clubs', { search, category, sort, order, page }],
    queryFn: () => clubAPI.getAll({ search, category, sort, order, page }).then(res => res.data)
  });

  const categories = [
    'all', 'Photography', 'Sports', 'Tech', 'Arts', 'Music', 'Books', 'Travel', 'Food', 'Fitness', 'Other'
  ];

  const sortOptions = [
    { value: 'createdAt', label: 'Newest First', order: 'desc' },
    { value: 'createdAt', label: 'Oldest First', order: 'asc' },
    { value: 'membershipFee', label: 'Highest Fee', order: 'desc' },
    { value: 'membershipFee', label: 'Lowest Fee', order: 'asc' },
    { value: 'memberCount', label: 'Most Members', order: 'desc' },
  ];

  const handleSortChange = (value) => {
    const option = sortOptions.find(opt => opt.label === value);
    if (option) {
      setSort(option.value);
      setOrder(option.order);
      setPage(1);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold mb-4 text-gray-800">Discover Clubs</h1>
          <p className="text-lg text-gray-600">Find and join communities that match your interests</p>
        </motion.div>

        {/* Search and Filter Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-lg shadow-md mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Clubs
              </label>
              <input
                type="text"
                placeholder="Search by club name..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setPage(1);
                }}
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat === 'all' ? 'All Categories' : cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort By
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={sortOptions.find(opt => opt.value === sort && opt.order === order)?.label || 'Newest First'}
                onChange={(e) => handleSortChange(e.target.value)}
              >
                {sortOptions.map(option => (
                  <option key={option.label} value={option.label}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        {/* Results */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-md animate-pulse">
                <div className="h-48 bg-gray-300 rounded-t-lg"></div>
                <div className="p-6">
                  <div className="h-4 bg-gray-300 rounded mb-2"></div>
                  <div className="h-3 bg-gray-300 rounded mb-4"></div>
                  <div className="h-8 bg-gray-300 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600 text-lg">Failed to load clubs. Please try again.</p>
          </div>
        ) : data?.clubs?.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-gray-600">No clubs found matching your criteria.</p>
          </div>
        ) : (
          <>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
            >
              {data?.clubs?.map((club) => (
                <motion.div
                  key={club._id}
                  variants={itemVariants}
                  className="bg-white rounded-lg shadow-md card-hover overflow-hidden"
                >
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={club.bannerImage || 'https://via.placeholder.com/400x200'} 
                      alt={club.clubName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2 text-gray-800">{club.clubName}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">{club.category}</span>
                      <span>•</span>
                      <span>{club.location}</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">{club.description?.substring(0, 100)}...</p>
                    <div className="flex justify-between items-center">
                      <div className="flex flex-col text-sm">
                        <span className="font-semibold text-gray-800">{club.memberCount} members</span>
                        {club.membershipFee > 0 ? (
                          <span className="text-blue-600">${club.membershipFee}/month</span>
                        ) : (
                          <span className="text-green-600">Free</span>
                        )}
                      </div>
                      <Link 
                        to={`/clubs/${club._id}`} 
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors cursor-pointer"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Pagination */}
            {data?.totalPages > 1 && (
              <div className="flex justify-center">
                <div className="flex items-center space-x-1">
                  <button
                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                  >
                    Previous
                  </button>
                  
                  {[...Array(data.totalPages)].map((_, i) => (
                    <button
                      key={i + 1}
                      className={`px-3 py-2 text-sm font-medium border ${
                        page === i + 1 
                          ? 'bg-blue-600 text-white border-blue-600' 
                          : 'text-gray-500 bg-white border-gray-300 hover:bg-gray-50 hover:text-gray-700'
                      }`}
                      onClick={() => setPage(i + 1)}
                    >
                      {i + 1}
                    </button>
                  ))}
                  
                  <button
                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={page === data.totalPages}
                    onClick={() => setPage(page + 1)}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Clubs;