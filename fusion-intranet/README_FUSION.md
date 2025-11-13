# FUSION Intranet Application

A comprehensive intranet application migrated from the JIVE platform to a modern tech stack.

## Tech Stack

### Frontend
- **React.js** - UI framework
- **React Router** - Navigation
- **Bootstrap 5** - UI components
- **React Bootstrap** - React-Bootstrap integration
- **Axios** - HTTP client
- **SCSS** - Styling

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Supabase** - PostgreSQL database with authentication
- **@supabase/supabase-js** - Supabase client library

### Database
- **PostgreSQL** (via Supabase)

## Project Structure

```
fusion-intranet/
├── backend/
│   ├── config/
│   │   └── database.js          # Supabase configuration
│   ├── controllers/
│   │   ├── usersController.js
│   │   ├── placesController.js
│   │   ├── documentsController.js
│   │   ├── eventsController.js
│   │   └── postsController.js
│   ├── routes/
│   │   ├── users.js
│   │   ├── places.js
│   │   ├── documents.js
│   │   ├── events.js
│   │   └── posts.js
│   ├── scripts/
│   │   └── migrate-data.js      # Data migration script
│   ├── package.json
│   └── server.js                # Express server
├── src/
│   ├── admin-panel/
│   │   ├── AdminPanel.js
│   │   ├── UsersAdmin.js
│   │   ├── PlacesAdmin.js
│   │   ├── DocumentsAdmin.js
│   │   ├── EventsAdmin.js
│   │   └── PostsAdmin.js
│   ├── components/
│   │   └── Navbar.js
│   ├── pages/
│   │   ├── Home.js
│   │   ├── Documents.js
│   │   ├── Posts.js
│   │   ├── Events.js
│   │   └── Calendar.js
│   ├── services/
│   │   └── api.js               # API service layer
│   └── App.js
├── migrations/
│   ├── json-data/               # Source JSON data from JIVE
│   └── sql-schemas/             # Generated SQL schemas
└── public/

```

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Supabase account (already configured)

### 1. Environment Setup

Copy the example environment file:
```bash
cp .env.example .env
```

The `.env` file should already be configured with Supabase credentials.

### 2. Install Dependencies

#### Frontend Dependencies
```bash
cd fusion-intranet
npm install
```

#### Backend Dependencies
```bash
cd backend
npm install
```

### 3. Database Migration

The database schema has already been created in Supabase. To migrate the JSON data:

```bash
cd backend
npm run migrate
```

This will:
- Import all users from user_mappings.json
- Import places/spaces
- Import documents with their images
- Import events
- Import blog posts with their images

### 4. Start the Application

#### Start Backend Server
```bash
cd backend
npm start
```
The backend will run on `http://localhost:5000`

#### Start Frontend (in a new terminal)
```bash
cd fusion-intranet
npm start
```
The frontend will run on `http://localhost:3000`

## Features

### Frontend Features
- **Landing Page** - Dashboard with recent posts, events, and documents
- **Documents** - Browse and view company documents
- **News/Posts** - Company blog posts and announcements
- **Events** - Browse upcoming events
- **Calendar** - Calendar view of all events
- **Admin Panel** - Complete CRUD operations for all entities

### Admin Panel Features
- **Users Management** - Add, edit, delete users
- **Places Management** - Manage company spaces/departments
- **Documents Management** - Manage documents
- **Events Management** - Manage events
- **Posts Management** - Manage news and blog posts

### Backend API Endpoints

#### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

#### Places
- `GET /api/places` - Get all places
- `GET /api/places/:id` - Get place by ID
- `POST /api/places` - Create new place
- `PUT /api/places/:id` - Update place
- `DELETE /api/places/:id` - Delete place

#### Documents
- `GET /api/documents` - Get all documents
- `GET /api/documents/:id` - Get document by ID
- `POST /api/documents` - Create new document
- `PUT /api/documents/:id` - Update document
- `DELETE /api/documents/:id` - Delete document

#### Events
- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get event by ID
- `POST /api/events` - Create new event
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event

#### Posts
- `GET /api/posts` - Get all posts
- `GET /api/posts/:id` - Get post by ID
- `POST /api/posts` - Create new post
- `PUT /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post

## Database Schema

### Tables
- **users** - User information from Microsoft Graph
- **places** - Company spaces/departments
- **documents** - Document content and metadata
- **events** - Event information
- **posts** - Blog posts and news
- **content_images** - Images attached to content
- **attachments** - File attachments

All tables have Row Level Security (RLS) enabled with appropriate policies.

## Development

### Running Tests
```bash
npm test
```

### Building for Production
```bash
npm run build
```

## Migration Notes

The application successfully migrates data from JIVE JSON format to PostgreSQL:
- User mappings are converted to standard user records
- Content relationships (author, place) are preserved
- Images and attachments are linked to their parent content
- Tags and metadata are stored in JSONB format

## Security

- All API endpoints use Supabase Row Level Security (RLS)
- Authentication required for all operations
- Users can only modify their own content
- Admin operations require proper permissions

## Support

For issues or questions, please contact the development team.
