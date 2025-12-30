import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { membershipAPI } from "../../utils/api";
import { useAuth } from "../../hooks/useAuth";

const ClubCard = ({ club, variants }) => {
  const { user } = useAuth();

  const { data: userMemberships } = useQuery({
    queryKey: ["userMemberships"],
    queryFn: () => membershipAPI.getMyMemberships().then((res) => res.data),
    enabled: !!user,
  });

  const isAlreadyMember = userMemberships?.some(
    (membership) =>
      membership.clubId._id === club?._id && membership.status === "active"
  );
  return (
    <Link to={`/clubs/${club._id}`}>
      <motion.div
        variants={variants}
        whileHover={{ y: -8, scale: 1.02 }}
        className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl overflow-hidden transition-all duration-300 border border-gray-100"
      >
        <div className="relative h-48 overflow-hidden">
          <img
            src={club.bannerImage || "https://via.placeholder.com/400x200"}
            alt={club.clubName}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute top-4 right-4">
            <span className="bg-emerald-500 text-white text-xs px-3 py-1 rounded-full font-medium shadow-lg">
              {club.category}
            </span>
          </div>
        </div>
        <div className="p-6">
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-xl font-bold text-gray-800 group-hover:text-indigo-600 transition-colors line-clamp-1">
              {club.clubName}
            </h3>
            <div className="flex items-center gap-1 text-amber-500">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-sm font-medium">4.8</span>
            </div>
          </div>
          <p className="text-sm text-gray-500 mb-2 flex items-center gap-2">
            <svg
              className="w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            {club.location}
          </p>
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
            {club.description?.substring(0, 100)}...
          </p>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-medium"
                  >
                    {String.fromCharCode(65 + i)}
                  </div>
                ))}
              </div>
              <span className="text-sm text-gray-500 ml-2">
                {club.memberCount}+ members
              </span>
            </div>
            {isAlreadyMember ? (
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                Already a Member
              </span>
            ) : (
              <Link
                to={`/clubs/${club._id}`}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
              >
                Join Club
              </Link>
            )}
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default ClubCard;
