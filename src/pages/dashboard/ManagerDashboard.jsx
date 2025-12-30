import { useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { clubAPI, eventAPI, membershipAPI } from "../../utils/api";
import toast from "react-hot-toast";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import DashboardLayout from "../../components/layout/DashboardLayout";
import StatCard from "../../components/ui/StatCard";

const ManagerOverview = () => {
  const { data: myClubs } = useQuery({
    queryKey: ["myClubs"],
    queryFn: () => clubAPI.getMyClubs().then((res) => res.data),
  });

  const { data: myEvents } = useQuery({
    queryKey: ["myEvents"],
    queryFn: () => eventAPI.getMyEvents().then((res) => res.data),
  });

  const totalMembers = myClubs?.reduce((sum, club) => sum + club.memberCount, 0) || 0;
  const approvedClubs = myClubs?.filter((club) => club.status === "approved").length || 0;
  const pendingClubs = myClubs?.filter((club) => club.status === "pending").length || 0;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="My Clubs" value={myClubs?.length || 0} icon="🏢" color="orange" subtext={`${approvedClubs} approved`} />
        <StatCard title="Total Members" value={totalMembers} icon="👥" color="red" />
        <StatCard title="Events Created" value={myEvents?.length || 0} icon="📅" color="purple" />
        <StatCard title="Upcoming Events" value={myEvents?.filter((event) => new Date(event.eventDate) > new Date()).length || 0} icon="⏳" color="blue" />
      </div>

      {pendingClubs > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center">
          <svg className="w-5 h-5 text-yellow-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>
          <span className="text-yellow-800">{pendingClubs} club(s) awaiting admin approval</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link to="/dashboard/manager/clubs" className="flex items-center justify-center space-x-2 bg-orange-600 hover:bg-orange-700 text-white font-medium py-3 px-6 rounded-lg transition-colors w-full">
              <span className="text-xl">🏢</span><span>Create New Club</span>
            </Link>
            <Link to="/dashboard/manager/events" className="flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-6 rounded-lg transition-colors w-full">
              <span className="text-xl">📅</span><span>Create New Event</span>
            </Link>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Clubs</h2>
          <div className="space-y-3">
            {myClubs?.slice(0, 3).map((club) => (
              <div key={club._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-semibold text-gray-900">{club.clubName}</h3>
                  <p className="text-sm text-gray-500">{club.memberCount} members</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  club.status === "approved" ? "bg-green-100 text-green-800" :
                  club.status === "pending" ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"
                }`}>
                  {club.status}
                </span>
              </div>
            )) || <p className="text-center text-gray-500">No clubs yet</p>}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const ClubForm = ({ club, onSubmit, onCancel }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues: club || {} });
  const categories = ["Photography", "Sports", "Tech", "Arts", "Music", "Books", "Travel", "Food", "Fitness", "Other"];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="label"><span className="label-text">Club Name *</span></label>
        <input {...register("clubName", { required: "Club name is required" })} type="text" className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${errors.clubName ? "border-red-500" : "border-gray-300"}`} placeholder="Enter club name" />
        {errors.clubName && <span className="text-error text-sm">{errors.clubName.message}</span>}
      </div>
      <div>
        <label className="label"><span className="label-text">Description *</span></label>
        <textarea {...register("description", { required: "Description is required" })} className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 h-24 ${errors.description ? "border-red-500" : "border-gray-300"}`} placeholder="Describe your club" />
        {errors.description && <span className="text-error text-sm">{errors.description.message}</span>}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="label"><span className="label-text">Category *</span></label>
          <select {...register("category", { required: "Category is required" })} className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${errors.category ? "border-red-500" : "border-gray-300"}`}>
            <option value="">Select category</option>
            {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
          </select>
          {errors.category && <span className="text-error text-sm">{errors.category.message}</span>}
        </div>
        <div>
          <label className="label"><span className="label-text">Location *</span></label>
          <input {...register("location", { required: "Location is required" })} type="text" className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${errors.location ? "border-red-500" : "border-gray-300"}`} placeholder="City, State" />
          {errors.location && <span className="text-error text-sm">{errors.location.message}</span>}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="label"><span className="label-text">Banner Image URL</span></label>
          <input {...register("bannerImage")} type="url" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="https://example.com/image.jpg" />
        </div>
        <div>
          <label className="label"><span className="label-text">Membership Fee ($)</span></label>
          <input {...register("membershipFee", { min: { value: 0, message: "Fee cannot be negative" } })} type="number" step="0.01" className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${errors.membershipFee ? "border-red-500" : "border-gray-300"}`} placeholder="0.00" />
          {errors.membershipFee && <span className="text-error text-sm">{errors.membershipFee.message}</span>}
        </div>
      </div>
      <div className="flex gap-4 justify-end pt-4">
        <button type="button" onClick={onCancel} className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors">Cancel</button>
        <button type="submit" className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg transition-colors">{club ? "Update Club" : "Create Club"}</button>
      </div>
    </form>
  );
};

const MyClubs = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingClub, setEditingClub] = useState(null);
  const queryClient = useQueryClient();

  const { data: myClubs, isLoading } = useQuery({
    queryKey: ["myClubs"],
    queryFn: () => clubAPI.getMyClubs().then((res) => res.data),
  });

  const createClubMutation = useMutation({
    mutationFn: (data) => clubAPI.create(data),
    onSuccess: () => {
      toast.success("Club created successfully! Awaiting admin approval.");
      queryClient.invalidateQueries(["myClubs"]);
      setShowForm(false);
    },
    onError: (error) => toast.error(error.response?.data?.message || "Failed to create club"),
  });

  const updateClubMutation = useMutation({
    mutationFn: ({ id, data }) => clubAPI.update(id, data),
    onSuccess: () => {
      toast.success("Club updated successfully!");
      queryClient.invalidateQueries(["myClubs"]);
      setEditingClub(null);
      setShowForm(false);
    },
    onError: (error) => toast.error(error.response?.data?.message || "Failed to update club"),
  });

  const handleSubmit = (data) => {
    if (editingClub) {
      updateClubMutation.mutate({ id: editingClub._id, data });
    } else {
      createClubMutation.mutate(data);
    }
  };

  const handleEdit = (club) => {
    setEditingClub(club);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingClub(null);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-end">
        <button onClick={() => setShowForm(true)} className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg transition-colors">Create New Club</button>
      </div>
      {showForm && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
          <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} className="bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden">
            <div className="bg-gradient-to-r from-orange-500 to-red-600 px-6 py-4"><h3 className="text-xl font-bold text-white flex items-center gap-2"><span className="text-2xl">🏢</span>{editingClub ? "Edit Club" : "Create New Club"}</h3></div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]"><ClubForm club={editingClub} onSubmit={handleSubmit} onCancel={handleCancel} /></div>
          </motion.div>
        </motion.div>
      )}
      {isLoading ? (
        <div className="text-center py-4">Loading...</div>
      ) : myClubs?.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
          <p className="text-lg opacity-70 mb-4">You haven't created any clubs yet.</p>
          <button onClick={() => setShowForm(true)} className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg transition-colors">Create Your First Club</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myClubs?.map((club) => (
            <div key={club._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <img src={club.bannerImage || "https://via.placeholder.com/300x150"} alt={club.clubName} className="w-full h-32 object-cover" />
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{club.clubName}</h3>
                <div className="space-y-1 text-sm text-gray-600 mb-4">
                  <p><span className="font-medium">Members:</span> {club.memberCount}</p>
                  <p><span className="font-medium">Fee:</span> {club.membershipFee > 0 ? `${club.membershipFee}` : "Free"}</p>
                </div>
                <div className="flex justify-between items-center">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    club.status === "approved" ? "bg-green-100 text-green-800" :
                    club.status === "pending" ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"
                  }`}>{club.status}</span>
                  <div className="flex space-x-2">
                    <button onClick={() => handleEdit(club)} className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded text-sm">Edit</button>
                    <Link to={`/clubs/${club._id}`} className="bg-orange-600 hover:bg-orange-700 text-white px-3 py-1 rounded text-sm">View</Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

const EventForm = ({ event, clubs, onSubmit, onCancel }) => {
  const { register, handleSubmit, formState: { errors }, watch } = useForm({ defaultValues: event || { isPaid: false } });
  const isPaid = watch("isPaid");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="label"><span className="label-text">Club *</span></label>
        <select {...register("clubId", { required: "Please select a club" })} className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${errors.clubId ? "border-red-500" : "border-gray-300"}`}>
          <option value="">Select a club</option>
          {clubs?.filter((club) => club.status === "approved").map((club) => <option key={club._id} value={club._id}>{club.clubName}</option>)}
        </select>
        {errors.clubId && <span className="text-error text-sm">{errors.clubId.message}</span>}
      </div>
      <div>
        <label className="label"><span className="label-text">Event Title *</span></label>
        <input {...register("title", { required: "Event title is required" })} type="text" className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${errors.title ? "border-red-500" : "border-gray-300"}`} placeholder="Enter event title" />
        {errors.title && <span className="text-error text-sm">{errors.title.message}</span>}
      </div>
      <div>
        <label className="label"><span className="label-text">Description *</span></label>
        <textarea {...register("description", { required: "Description is required" })} className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 h-24 ${errors.description ? "border-red-500" : "border-gray-300"}`} placeholder="Describe your event" />
        {errors.description && <span className="text-error text-sm">{errors.description.message}</span>}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="label"><span className="label-text">Event Date *</span></label>
          <input {...register("eventDate", { required: "Event date is required" })} type="datetime-local" className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${errors.eventDate ? "border-red-500" : "border-gray-300"}`} />
          {errors.eventDate && <span className="text-error text-sm">{errors.eventDate.message}</span>}
        </div>
        <div>
          <label className="label"><span className="label-text">Location *</span></label>
          <input {...register("location", { required: "Location is required" })} type="text" className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${errors.location ? "border-red-500" : "border-gray-300"}`} placeholder="Event location" />
          {errors.location && <span className="text-error text-sm">{errors.location.message}</span>}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        <div className="flex items-center"><label className="flex items-center cursor-pointer"><input {...register("isPaid")} type="checkbox" className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500" /><span className="ml-2 text-sm font-medium text-gray-700">Paid Event</span></label></div>
        {isPaid && (
          <div>
            <label className="label"><span className="label-text">Event Fee ($)</span></label>
            <input {...register("eventFee", { min: { value: 0, message: "Fee cannot be negative" } })} type="number" step="0.01" className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${errors.eventFee ? "border-red-500" : "border-gray-300"}`} placeholder="0.00" />
            {errors.eventFee && <span className="text-error text-sm">{errors.eventFee.message}</span>}
          </div>
        )}
        <div>
          <label className="label"><span className="label-text">Max Attendees</span></label>
          <input {...register("maxAttendees", { min: { value: 1, message: "Must be at least 1" } })} type="number" className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${errors.maxAttendees ? "border-red-500" : "border-gray-300"}`} placeholder="Unlimited" />
          {errors.maxAttendees && <span className="text-error text-sm">{errors.maxAttendees.message}</span>}
        </div>
      </div>
      <div className="flex gap-4 justify-end pt-4">
        <button type="button" onClick={onCancel} className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors">Cancel</button>
        <button type="submit" className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg transition-colors">{event ? "Update Event" : "Create Event"}</button>
      </div>
    </form>
  );
};

const MyEvents = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, eventId: null, eventTitle: "" });
  const queryClient = useQueryClient();

  const { data: myEvents, isLoading: eventsLoading } = useQuery({
    queryKey: ["myEvents"],
    queryFn: () => eventAPI.getMyEvents().then((res) => res.data),
  });

  const { data: myClubs } = useQuery({
    queryKey: ["myClubs"],
    queryFn: () => clubAPI.getMyClubs().then((res) => res.data),
  });

  const createEventMutation = useMutation({
    mutationFn: (data) => eventAPI.create(data),
    onSuccess: () => {
      toast.success("Event created successfully!");
      queryClient.invalidateQueries(["myEvents"]);
      setShowForm(false);
    },
    onError: (error) => toast.error(error.response?.data?.message || "Failed to create event"),
  });

  const updateEventMutation = useMutation({
    mutationFn: ({ id, data }) => eventAPI.update(id, data),
    onSuccess: () => {
      toast.success("Event updated successfully!");
      queryClient.invalidateQueries(["myEvents"]);
      setEditingEvent(null);
      setShowForm(false);
    },
    onError: (error) => toast.error(error.response?.data?.message || "Failed to update event"),
  });

  const deleteEventMutation = useMutation({
    mutationFn: (id) => eventAPI.delete(id),
    onSuccess: () => {
      toast.success("Event deleted successfully!");
      queryClient.invalidateQueries(["myEvents"]);
      setConfirmDialog({ isOpen: false, eventId: null, eventTitle: "" });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete event");
      setConfirmDialog({ isOpen: false, eventId: null, eventTitle: "" });
    },
  });

  const handleSubmit = (data) => {
    if (editingEvent) {
      updateEventMutation.mutate({ id: editingEvent._id, data });
    } else {
      createEventMutation.mutate(data);
    }
  };

  const handleEdit = (event) => {
    setEditingEvent({ ...event, eventDate: new Date(event.eventDate).toISOString().slice(0, 16) });
    setShowForm(true);
  };

  const approvedClubs = myClubs?.filter((club) => club.status === "approved") || [];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-end">
        <button onClick={() => setShowForm(true)} className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg transition-colors disabled:opacity-50" disabled={approvedClubs.length === 0}>Create New Event</button>
      </div>
      {approvedClubs.length === 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
          <p className="text-blue-800">You need at least one approved club to create events.</p>
        </div>
      )}
      {showForm && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
          <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} className="bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden">
            <div className="bg-gradient-to-r from-orange-500 to-red-600 px-6 py-4"><h3 className="text-xl font-bold text-white flex items-center gap-2"><span className="text-2xl">📅</span>{editingEvent ? "Edit Event" : "Create New Event"}</h3></div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]"><EventForm event={editingEvent} clubs={myClubs} onSubmit={handleSubmit} onCancel={() => setShowForm(false)} /></div>
          </motion.div>
        </motion.div>
      )}
      {eventsLoading ? (
        <div className="text-center py-4">Loading...</div>
      ) : myEvents?.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
          <p className="text-lg opacity-70 mb-4">You haven't created any events yet.</p>
          {approvedClubs.length > 0 && <button onClick={() => setShowForm(true)} className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg transition-colors">Create Your First Event</button>}
        </div>
      ) : (
        <div className="space-y-4">
          {myEvents?.map((event) => (
            <div key={event._id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{event.title}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    <p><span className="font-medium">Club:</span> {event.clubId.clubName}</p>
                    <p><span className="font-medium">Date:</span> {new Date(event.eventDate).toLocaleString()}</p>
                    <p><span className="font-medium">Location:</span> {event.location}</p>
                    <p><span className="font-medium">Attendees:</span> {event.currentAttendees}{event.maxAttendees && `/${event.maxAttendees}`}</p>
                    <p><span className="font-medium">Fee:</span> {event.isPaid ? `${event.eventFee}` : "Free"}</p>
                    <p><span className="font-medium">Status:</span><span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${new Date(event.eventDate) > new Date() ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>{new Date(event.eventDate) > new Date() ? "Upcoming" : "Past"}</span></p>
                  </div>
                  <p className="mt-3 text-gray-600">{event.description}</p>
                </div>
                <div className="flex flex-col space-y-2 ml-4">
                  <button onClick={() => handleEdit(event)} className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded text-sm">Edit</button>
                  <button onClick={() => setConfirmDialog({ isOpen: true, eventId: event._id, eventTitle: event.title })} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm" disabled={deleteEventMutation.isLoading}>Delete</button>
                  <Link to={`/events/${event._id}`} className="bg-orange-600 hover:bg-orange-700 text-white px-3 py-1 rounded text-sm text-center">View</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <ConfirmDialog isOpen={confirmDialog.isOpen} onClose={() => setConfirmDialog({ isOpen: false, eventId: null, eventTitle: "" })} onConfirm={() => deleteEventMutation.mutate(confirmDialog.eventId)} title="Delete Event" message={`Are you sure you want to delete the event: ${confirmDialog.eventTitle}? This action cannot be undone.`} confirmText="Delete" type="danger" />
    </motion.div>
  );
};

const ClubMembers = () => {
  const [selectedClub, setSelectedClub] = useState("");
  const { data: myClubs } = useQuery({
    queryKey: ["myClubs"],
    queryFn: () => clubAPI.getMyClubs().then((res) => res.data),
  });
  const { data: members, isLoading } = useQuery({
    queryKey: ["clubMembers", selectedClub],
    queryFn: () => membershipAPI.getClubMembers(selectedClub).then((res) => res.data),
    enabled: !!selectedClub,
  });
  const approvedClubs = myClubs?.filter((club) => club.status === "approved") || [];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="w-full max-w-xs">
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Club</label>
          <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" value={selectedClub} onChange={(e) => setSelectedClub(e.target.value)}>
            <option value="">Choose a club</option>
            {approvedClubs.map((club) => <option key={club._id} value={club._id}>{club.clubName} ({club.memberCount} members)</option>)}
          </select>
        </div>
      </div>
      {selectedClub && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6"><h2 className="text-lg font-semibold text-gray-900">Members</h2></div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Member</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment ID</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {isLoading ? (
                  <tr><td colSpan="4" className="text-center py-4">Loading...</td></tr>
                ) : members?.length === 0 ? (
                  <tr><td colSpan="4" className="text-center py-8">No members found for this club.</td></tr>
                ) : (
                  members?.map((membership) => (
                    <tr key={membership._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{membership.userEmail}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          membership.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}>{membership.status}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(membership.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">{membership.paymentId || "N/A"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </motion.div>
  );
};

const ManagerDashboard = () => {
  const menuItems = [
    { path: "/dashboard/manager", label: "Overview", icon: "📊" },
    { path: "/dashboard/manager/clubs", label: "My Clubs", icon: "🏢" },
    { path: "/dashboard/manager/events", label: "Events", icon: "📅" },
    { path: "/dashboard/manager/members", label: "Members", icon: "👥" },
  ];

  return (
    <DashboardLayout menuItems={menuItems} dashboardTitle="Manager Panel" themeColor="manager">
      <Routes>
        <Route path="/" element={<ManagerOverview />} />
        <Route path="/clubs" element={<MyClubs />} />
        <Route path="/events" element={<MyEvents />} />
        <Route path="/members" element={<ClubMembers />} />
      </Routes>
    </DashboardLayout>
  );
};

export default ManagerDashboard;
