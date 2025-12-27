# ClubSphere - Membership & Event Management for Local Clubs

## Project Overview

ClubSphere is a comprehensive web application that helps people discover, join, and manage local clubs. It provides a platform for club managers to create and manage clubs and events, while members can join clubs, pay membership fees, and register for events. The platform includes admin-level monitoring and management capabilities.

## Live URL
- **Client**: [https://clubsphere-client.netlify.app](https://clubsphere-client.netlify.app)
- **Server**: [https://clubsphere-api.herokuapp.com](https://clubsphere-api.herokuapp.com)

## Key Features

### For Members
- Browse and search clubs by category, location, and name
- Join clubs (free or paid memberships via Stripe)
- View and manage memberships in personal dashboard
- Register for club events (free or paid)
- View payment history and membership status
- Responsive design for all devices

### For Club Managers
- Create and manage club profiles
- Set membership fees (free or paid)
- Create and manage events for their clubs
- View club members and event registrations
- Track revenue and member statistics
- Full CRUD operations for clubs and events

### For Admins
- Approve or reject club registration requests
- Promote/demote users to different roles
- Monitor all platform statistics and payments
- Manage users and oversee platform operations
- View comprehensive analytics dashboard

### Technical Features
- **Authentication**: Firebase Auth with email/password and Google login
- **Payment Processing**: Stripe integration for secure payments
- **Real-time Data**: TanStack Query for efficient data fetching and caching
- **Form Validation**: React Hook Form with comprehensive validation
- **Animations**: Framer Motion for smooth user experience
- **Responsive Design**: DaisyUI + Tailwind CSS for modern UI
- **Role-based Access**: Protected routes and role-specific dashboards
- **Search & Filter**: Server-side search, filtering, and sorting
- **Token Security**: Firebase token verification on backend

## Important NPM Packages Used

### Client-side Dependencies
- **react** (^18.2.0) - Core React library
- **react-router-dom** (^6.8.0) - Client-side routing
- **@tanstack/react-query** (^4.24.0) - Data fetching and state management
- **firebase** (^9.17.0) - Authentication and user management
- **react-hook-form** (^7.43.0) - Form handling and validation
- **framer-motion** (^9.0.0) - Animations and transitions
- **daisyui** (^2.51.0) - UI component library
- **tailwindcss** (^3.2.0) - Utility-first CSS framework
- **@stripe/stripe-js** (^1.46.0) - Stripe payment integration
- **@stripe/react-stripe-js** (^1.16.0) - React Stripe components
- **axios** (^1.3.0) - HTTP client for API requests
- **react-hot-toast** (^2.4.0) - Toast notifications
- **sweetalert2** (^11.7.0) - Beautiful alerts and modals

### Server-side Dependencies
- **express** (^4.18.0) - Web application framework
- **mongoose** (^6.9.0) - MongoDB object modeling
- **firebase-admin** (^11.5.0) - Firebase Admin SDK for token verification
- **stripe** (^11.9.0) - Stripe payment processing
- **cors** (^2.8.5) - Cross-origin resource sharing
- **dotenv** (^16.0.0) - Environment variable management
- **jsonwebtoken** (^9.0.0) - JWT token handling
- **bcryptjs** (^2.4.3) - Password hashing
- **nodemon** (^2.0.20) - Development server auto-restart

## Project Structure

```
clubsphere/
├── clubsphere-client/          # React frontend application
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── layout/        # Layout components (Navbar, Footer)
│   │   │   ├── ui/            # UI components
│   │   │   └── forms/         # Form components
│   │   ├── pages/             # Page components
│   │   │   ├── auth/          # Authentication pages
│   │   │   └── dashboard/     # Dashboard pages
│   │   ├── context/           # React context providers
│   │   ├── hooks/             # Custom React hooks
│   │   ├── utils/             # Utility functions and API calls
│   │   └── config/            # Configuration files
│   ├── public/                # Static assets
│   └── package.json
│
└── clubsphere-server/          # Node.js backend application
    ├── models/                 # MongoDB data models
    ├── routes/                 # API route handlers
    ├── controllers/            # Business logic controllers
    ├── middleware/             # Custom middleware functions
    ├── config/                 # Configuration files
    └── package.json
```

## Database Collections

### Users Collection
```javascript
{
  name: String,
  email: String (unique),
  photoURL: String,
  role: String (admin, clubManager, member),
  firebaseUID: String (unique),
  createdAt: Date,
  updatedAt: Date
}
```

### Clubs Collection
```javascript
{
  clubName: String,
  description: String,
  category: String,
  location: String,
  bannerImage: String,
  membershipFee: Number,
  status: String (pending, approved, rejected),
  managerEmail: String,
  memberCount: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Events Collection
```javascript
{
  clubId: ObjectId (ref: Club),
  title: String,
  description: String,
  eventDate: Date,
  location: String,
  isPaid: Boolean,
  eventFee: Number,
  maxAttendees: Number,
  currentAttendees: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Memberships Collection
```javascript
{
  userEmail: String,
  clubId: ObjectId (ref: Club),
  status: String (active, expired, pendingPayment),
  paymentId: String,
  expiresAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Event Registrations Collection
```javascript
{
  eventId: ObjectId (ref: Event),
  userEmail: String,
  clubId: ObjectId (ref: Club),
  status: String (registered, cancelled),
  paymentId: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Payments Collection
```javascript
{
  userEmail: String,
  amount: Number,
  type: String (membership, event),
  clubId: ObjectId (ref: Club),
  eventId: ObjectId (ref: Event),
  stripePaymentIntentId: String,
  status: String (pending, succeeded, failed, cancelled),
  createdAt: Date,
  updatedAt: Date
}
```

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- Firebase project with Authentication enabled
- Stripe account for payment processing

### Environment Variables

#### Client (.env)
```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
VITE_API_URL=http://localhost:5000/api
```

#### Server (.env)
```env
MONGODB_URI=mongodb://localhost:27017/clubsphere
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nyour_private_key\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your_project.iam.gserviceaccount.com
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
JWT_SECRET=your_jwt_secret_key
PORT=5000
NODE_ENV=development
```

### Installation & Running

#### Server Setup
```bash
cd clubsphere-server
npm install
npm run dev
```

#### Client Setup
```bash
cd clubsphere-client
npm install
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `GET /api/auth/me` - Get current user

### Clubs
- `GET /api/clubs` - Get all approved clubs (with search, filter, sort)
- `GET /api/clubs/featured` - Get featured clubs
- `GET /api/clubs/:id` - Get single club
- `POST /api/clubs` - Create club (Club Manager)
- `PUT /api/clubs/:id` - Update club (Club Manager)
- `GET /api/clubs/manager/my-clubs` - Get manager's clubs
- `GET /api/clubs/admin/all` - Get all clubs (Admin)
- `PATCH /api/clubs/:id/status` - Approve/reject club (Admin)

### Events
- `GET /api/events` - Get all events (with search, sort)
- `GET /api/events/upcoming` - Get upcoming events
- `GET /api/events/:id` - Get single event
- `POST /api/events` - Create event (Club Manager)
- `PUT /api/events/:id` - Update event (Club Manager)
- `DELETE /api/events/:id` - Delete event (Club Manager)
- `GET /api/events/manager/my-events` - Get manager's events

### Memberships
- `POST /api/memberships/join/:clubId` - Join club
- `GET /api/memberships/my-memberships` - Get user's memberships
- `GET /api/memberships/club/:clubId` - Get club members

### Payments
- `POST /api/payments/create-membership-payment` - Create membership payment
- `POST /api/payments/create-event-payment` - Create event payment
- `POST /api/payments/confirm-payment` - Confirm payment
- `GET /api/payments/my-payments` - Get user's payments
- `GET /api/payments/admin/all` - Get all payments (Admin)

### Users
- `GET /api/users` - Get all users (Admin)
- `PATCH /api/users/:id/role` - Update user role (Admin)

## Deployment

### Client Deployment (Netlify)
1. Build the project: `npm run build`
2. Deploy the `dist` folder to Netlify
3. Add environment variables in Netlify dashboard
4. Add the deployed domain to Firebase authorized domains

### Server Deployment (Heroku)
1. Create Heroku app
2. Add environment variables in Heroku dashboard
3. Deploy using Git or GitHub integration
4. Ensure MongoDB Atlas is configured for production

## Security Features

- Firebase Authentication with token verification
- Role-based access control (RBAC)
- Secure environment variable management
- CORS configuration for cross-origin requests
- Input validation and sanitization
- Secure payment processing with Stripe
- Protected API routes with middleware

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Contact

For questions or support, please contact:
- Email: support@clubsphere.com
- GitHub: [ClubSphere Repository](https://github.com/username/clubsphere)