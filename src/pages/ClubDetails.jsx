import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { clubAPI, membershipAPI, paymentAPI } from "../utils/api";
import { useAuth } from "../hooks/useAuth";
import toast from "react-hot-toast";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const PaymentForm = ({ club, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    if (!stripe || !elements) {
      return;
    }

    try {
      // Create payment intent
      const { data } = await paymentAPI.createMembershipPayment({
        clubId: club._id,
      });

      // Confirm payment
      const result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (result.error) {
        toast.error(result.error.message);
      } else {
        // Join club after successful payment
        await membershipAPI.join(club._id, { paymentId: data.paymentId });
        await paymentAPI.confirmPayment({
          paymentIntentId: result.paymentIntent.id,
        });
        toast.success("Successfully joined the club!");
        onSuccess();
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="p-4 border border-gray-300 rounded-lg">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#424770",
                "::placeholder": {
                  color: "#aab7c4",
                },
              },
            },
          }}
        />
      </div>
      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
        {loading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Processing...
          </div>
        ) : (
          `Pay $${club.membershipFee} & Join Club`
        )}
      </button>
    </form>
  );
};

const ClubDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [showPayment, setShowPayment] = useState(false);

  const {
    data: club,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["club", id],
    queryFn: () => clubAPI.getById(id).then((res) => res.data),
  });

  const { data: userMemberships } = useQuery({
    queryKey: ["userMemberships"],
    queryFn: () => membershipAPI.getMyMemberships().then((res) => res.data),
    enabled: !!user,
  });

  const joinClubMutation = useMutation({
    mutationFn: (clubId) => membershipAPI.join(clubId, {}),
    onSuccess: () => {
      toast.success("Successfully joined the club!");
      queryClient.invalidateQueries(["userMemberships"]);
      queryClient.invalidateQueries(["club", id]);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to join club");
    },
  });

  const handleJoinFreeClub = () => {
    joinClubMutation.mutate(club._id);
  };

  const handlePaymentSuccess = () => {
    setShowPayment(false);
    queryClient.invalidateQueries(["userMemberships"]);
    queryClient.invalidateQueries(["club", id]);
  };

  const isAlreadyMember = userMemberships?.some(
    (membership) =>
      membership.clubId._id === club?._id && membership.status === "active"
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !club) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-gray-900">
            Club Not Found
          </h1>
          <Link
            to="/clubs"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors cursor-pointer"
          >
            Back to Clubs
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
          {/* Club Header */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
            <div className="h-64 md:h-80 overflow-hidden">
              <img
                src={club.bannerImage || "https://via.placeholder.com/800x400"}
                alt={club.clubName}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-3">
                    {club.clubName}
                  </h1>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                      {club.category}
                    </span>
                    <span className="flex items-center">
                      📍 {club.location}
                    </span>
                    <span className="flex items-center">
                      👥 {club.memberCount} members
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-3">
                  <div className="text-right">
                    {club.membershipFee > 0 ? (
                      <span className="text-2xl font-bold text-blue-600">
                        ${club.membershipFee}/month
                      </span>
                    ) : (
                      <span className="text-2xl font-bold text-green-600">
                        Free
                      </span>
                    )}
                  </div>

                  {user ? (
                    isAlreadyMember ? (
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                        Already a Member
                      </span>
                    ) : (
                      <div className="flex gap-2">
                        {club.membershipFee > 0 ? (
                          <button
                            disabled={user.role !== "member"}
                            onClick={() => setShowPayment(true)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors cursor-pointer"
                          >
                            Join Club - ${club.membershipFee}
                          </button>
                        ) : (
                          <button
                            disabled={
                              user.role !== "member" ||
                              joinClubMutation.isLoading
                            }
                            onClick={handleJoinFreeClub}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                          >
                            {joinClubMutation.isLoading ? (
                              <div className="flex items-center">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Joining...
                              </div>
                            ) : (
                              "Join Club - Free"
                            )}
                          </button>
                        )}
                      </div>
                    )
                  ) : (
                    <Link
                      to="/login"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors cursor-pointer"
                    >
                      Login to Join
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Club Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg shadow-md p-6 mb-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              About This Club
            </h2>
            <p className="text-lg leading-relaxed text-gray-700">
              {club.description}
            </p>
          </motion.div>

          {/* Club Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          >
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-sm font-medium text-gray-500 mb-1">
                Members
              </div>
              <div className="text-2xl font-bold text-blue-600">
                {club.memberCount}
              </div>
              <div className="text-xs text-gray-400">Active members</div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-sm font-medium text-gray-500 mb-1">
                Category
              </div>
              <div className="text-2xl font-bold text-purple-600">
                {club.category}
              </div>
              <div className="text-xs text-gray-400">Club type</div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-sm font-medium text-gray-500 mb-1">
                Membership
              </div>
              <div className="text-2xl font-bold text-green-600">
                {club.membershipFee > 0 ? `$${club.membershipFee}` : "Free"}
              </div>
              <div className="text-xs text-gray-400">Monthly fee</div>
            </div>
          </motion.div>

          {/* Navigation */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex justify-center"
          >
            <Link
              to="/clubs"
              className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-6 py-2 rounded-lg transition-colors"
            >
              ← Back to Clubs
            </Link>
          </motion.div>
        </motion.div>

        {/* Payment Modal */}
        {showPayment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Join {club.clubName}
              </h3>
              <p className="text-gray-600 mb-6">
                You're about to join {club.clubName} for ${club.membershipFee}
                /month.
              </p>

              <Elements stripe={stripePromise}>
                <PaymentForm club={club} onSuccess={handlePaymentSuccess} />
              </Elements>

              <div className="flex justify-end mt-4">
                <button
                  onClick={() => setShowPayment(false)}
                  className="text-gray-500 hover:text-gray-700 px-4 py-2 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClubDetails;
