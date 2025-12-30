import { Link } from 'react-router-dom';

const Terms = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms of Service</h1>
        
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="prose max-w-none">
            <h2 className="text-2xl font-semibold mb-4">Acceptance of Terms</h2>
            <p className="mb-4">By accessing and using ClubSphere, you accept and agree to be bound by the terms and provision of this agreement.</p>
            
            <h2 className="text-2xl font-semibold mb-4 mt-8">User Responsibilities</h2>
            <p className="mb-4">Users are responsible for maintaining the confidentiality of their account information and for all activities that occur under their account.</p>
            
            <h2 className="text-2xl font-semibold mb-4 mt-8">Prohibited Uses</h2>
            <p className="mb-4">You may not use our service for any unlawful purpose or to solicit others to perform unlawful acts.</p>
            
            <h2 className="text-2xl font-semibold mb-4 mt-8">Limitation of Liability</h2>
            <p className="mb-4">ClubSphere shall not be liable for any indirect, incidental, special, consequential, or punitive damages.</p>
            
            <h2 className="text-2xl font-semibold mb-4 mt-8">Contact Information</h2>
            <p>For questions about these Terms of Service, please contact us at support@clubsphere.com</p>
          </div>
        </div>
        
        <div className="text-center">
          <Link to="/" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Terms;