import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { eventAPI } from "../utils/api";
import { useAuth } from "../hooks/useAuth";

const EventDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();

  const {
    data: event,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["event", id],
    queryFn: () => eventAPI.getById(id).then((res) => res.data),
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isEventPast = (eventDate) => {
    return new Date(eventDate) < new Date();
  };

  const isEventFull = (event) => {
    return event.maxAttendees && event.currentAttendees >= event.maxAttendees;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-gray-800">
            Event Not Found
          </h1>
          <Link
            to="/events"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors cursor-pointer"
          >
            Back to Events
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          {/* Event Header */}
          <div className="bg-white rounded-lg shadow-md mb-8">
            <div className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h1 className="text-3xl font-bold text-gray-900">
                      {event.title}
                    </h1>
                    {isEventPast(event.eventDate) && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
                        Past Event
                      </span>
                    )}
                    {isEventFull(event) && !isEventPast(event.eventDate) && (
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                        Full
                      </span>
                    )}
                  </div>

                  <div className="space-y-3 text-lg">
                    <div className="flex items-center gap-3">
                      <span>🏢</span>
                      <Link
                        to={`/clubs/${event.clubId._id}`}
                        className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                      >
                        {event.clubId.clubName}
                      </Link>
                    </div>

                    <div className="flex items-center gap-3">
                      <span>📅</span>
                      <span className="text-gray-700">
                        {formatDate(event.eventDate)}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span>📍</span>
                      <span className="text-gray-700">{event.location}</span>
                    </div>

                    {event.maxAttendees && (
                      <div className="flex items-center gap-3">
                        <span>👥</span>
                        <span className="text-gray-700">
                          {event.currentAttendees}/{event.maxAttendees}{" "}
                          attendees
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-4">
                  <div className="text-right">
                    {event.isPaid ? (
                      <span className="text-3xl font-bold text-blue-600">
                        ${event.eventFee}
                      </span>
                    ) : (
                      <span className="text-3xl font-bold text-green-600">
                        Free
                      </span>
                    )}
                  </div>

                  {user ? (
                    <div className="flex flex-col gap-2">
                      {isEventPast(event.eventDate) ? (
                        <span className="px-3 py-2 bg-gray-100 text-gray-800 rounded-lg text-sm font-medium">
                          Event Ended
                        </span>
                      ) : isEventFull(event) ? (
                        <span className="px-3 py-2 bg-yellow-100 text-yellow-800 rounded-lg text-sm font-medium">
                          Event Full
                        </span>
                      ) : (
                        <button
                          className={`bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors ${
                            user.role === "member"
                              ? "cursor-pointer"
                              : "opacity-50 cursor-not-allowed"
                          }`}
                          disabled={user.role !== "member"}
                        >
                          {event.isPaid
                            ? `Register - $${event.eventFee}`
                            : "Register - Free"}
                        </button>
                      )}
                    </div>
                  ) : (
                    <Link
                      to="/login"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors cursor-pointer"
                    >
                      Login to Register
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Event Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg shadow-md mb-8"
          >
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                About This Event
              </h2>
              <div className="prose max-w-none">
                <p className="text-lg leading-relaxed whitespace-pre-wrap text-gray-700">
                  {event.description}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Event Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-sm font-medium text-gray-500 mb-1">Date</div>
              <div className="text-lg font-bold text-gray-900">
                {new Date(event.eventDate).toLocaleDateString()}
              </div>
              <div className="text-xs text-gray-400">
                {new Date(event.eventDate).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-sm font-medium text-gray-500 mb-1">
                Attendees
              </div>
              <div className="text-lg font-bold text-blue-600">
                {event.currentAttendees}
                {event.maxAttendees && `/${event.maxAttendees}`}
              </div>
              <div className="text-xs text-gray-400">
                {event.maxAttendees ? "Limited spots" : "Unlimited"}
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-sm font-medium text-gray-500 mb-1">
                Price
              </div>
              <div className="text-lg font-bold text-purple-600">
                {event.isPaid ? `$${event.eventFee}` : "Free"}
              </div>
              <div className="text-xs text-gray-400">Registration fee</div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-sm font-medium text-gray-500 mb-1">
                Status
              </div>
              <div className="text-lg font-bold text-green-600">
                {isEventPast(event.eventDate)
                  ? "Ended"
                  : isEventFull(event)
                  ? "Full"
                  : "Open"}
              </div>
              <div className="text-xs text-gray-400">
                {isEventPast(event.eventDate)
                  ? "Event has ended"
                  : "Registration status"}
              </div>
            </div>
          </motion.div>

          {/* Club Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-lg shadow-md mb-8"
          >
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Organized by
              </h2>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {event.clubId.clubName}
                  </h3>
                  <p className="text-gray-600">{event.clubId.location}</p>
                </div>
                <Link
                  to={`/clubs/${event.clubId._id}`}
                  className="border border-gray-300 hover:border-blue-500 text-gray-700 hover:text-blue-600 px-4 py-2 rounded-lg transition-colors"
                >
                  View Club
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Navigation */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex justify-center"
          >
            <Link
              to="/events"
              className="border border-gray-300 hover:border-blue-500 text-gray-700 hover:text-blue-600 px-6 py-2 rounded-lg transition-colors"
            >
              ← Back to Events
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default EventDetails;
