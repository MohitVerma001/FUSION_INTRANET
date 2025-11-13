import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavigationBar from './components/Navbar';
import Home from './pages/Home';
import Documents from './pages/Documents';
import Posts from './pages/Posts';
import Events from './pages/Events';
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
          <Route path="/posts" element={<Posts />} />
          <Route path="/events" element={<Events />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
