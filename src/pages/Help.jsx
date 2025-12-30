import { Link } from 'react-router-dom';

const Help = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Help Center</h1>
        
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2">How do I join a club?</h3>
              <p className="text-gray-600">Browse clubs on our platform, find one that interests you, and click the "Join Club" button on the club's detail page.</p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">How do I register for events?</h3>
              <p className="text-gray-600">Visit the Events page, select an event you'd like to attend, and click "Register" on the event details page.</p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Can I create my own club?</h3>
              <p className="text-gray-600">Yes! Contact our support team to become a club manager and start your own community.</p>
            </div>
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

export default Help;