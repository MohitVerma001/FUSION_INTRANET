import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavigationBar from './components/Navbar';
import Home from './pages/Home';
import Documents from './pages/Documents';
import DocumentDetail from './pages/DocumentDetail';
import Posts from './pages/Posts';
import PostDetail from './pages/PostDetail';
import Events from './pages/Events';
import EventDetail from './pages/EventDetail';
import Calendar from './pages/Calendar';
import AdminPanel from './admin-panel/AdminPanel';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/main.scss';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <NavigationBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/documents" element={<Documents />} />
          <Route path="/documents/:id" element={<DocumentDetail />} />
          <Route path="/posts" element={<Posts />} />
          <Route path="/posts/:id" element={<PostDetail />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:id" element={<EventDetail />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
