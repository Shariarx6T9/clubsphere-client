import { Link } from 'react-router-dom';

const Privacy = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
        
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="prose max-w-none">
            <h2 className="text-2xl font-semibold mb-4">Information We Collect</h2>
            <p className="mb-4">We collect information you provide directly to us, such as when you create an account, join clubs, or register for events.</p>
            
            <h2 className="text-2xl font-semibold mb-4 mt-8">How We Use Your Information</h2>
            <p className="mb-4">We use the information we collect to provide, maintain, and improve our services, including connecting you with clubs and events.</p>
            
            <h2 className="text-2xl font-semibold mb-4 mt-8">Information Sharing</h2>
            <p className="mb-4">We do not sell, trade, or otherwise transfer your personal information to third parties without your consent.</p>
            
            <h2 className="text-2xl font-semibold mb-4 mt-8">Contact Us</h2>
            <p>If you have questions about this Privacy Policy, please contact us at support@clubsphere.com</p>
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

export default Privacy;