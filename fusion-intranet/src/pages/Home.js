import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Spinner, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { postsAPI, eventsAPI, documentsAPI } from '../services/api';

const Home = () => {
  const [recentPosts, setRecentPosts] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [recentDocuments, setRecentDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
        const [postsRes, eventsRes, docsRes] = await Promise.all([
          postsAPI.getAll(),
          eventsAPI.getAll(),
          documentsAPI.getAll()
        ]);

        setRecentPosts(postsRes.data.data.slice(0, 3));
        setUpcomingEvents(eventsRes.data.data.slice(0, 3));
        setRecentDocuments(docsRes.data.data.slice(0, 3));
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load dashboard data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <div className="welcome-banner">
        <h1>Welcome to FUSION Intranet</h1>
        <p className="lead mb-0">
          Your central hub for company news, documents, events, and collaboration
        </p>
      </div>

      <Row className="mb-4 g-4">
        <Col md={4}>
          <Card className="h-100 shadow-hover">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <Card.Title className="mb-0">Latest News</Card.Title>
                <Link to="/posts" className="btn btn-sm btn-outline-primary">
                  View All
                </Link>
              </div>
              {recentPosts.length === 0 ? (
                <div className="empty-state py-4">
                  <p className="text-muted">No posts available</p>
                </div>
              ) : (
                recentPosts.map(post => (
                  <div key={post.id} className="mb-3 pb-3 border-bottom">
                    <h6 className="mb-1">
                      <Link to="/posts" className="text-decoration-none text-dark">
                        {post.subject}
                      </Link>
                    </h6>
                    <small className="text-muted d-block mb-1">
                      by {post.author?.display_name}
                    </small>
                    <small className="text-muted">
                      {new Date(post.published).toLocaleDateString()}
                    </small>
                  </div>
                ))
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="h-100 shadow-hover">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <Card.Title className="mb-0">Upcoming Events</Card.Title>
                <Link to="/events" className="btn btn-sm btn-outline-primary">
                  View All
                </Link>
              </div>
              {upcomingEvents.length === 0 ? (
                <div className="empty-state py-4">
                  <p className="text-muted">No events scheduled</p>
                </div>
              ) : (
                upcomingEvents.map(event => (
                  <div key={event.id} className="mb-3 pb-3 border-bottom event-card">
                    <h6 className="mb-1">
                      <Link to="/events" className="text-decoration-none text-dark">
                        {event.subject}
                      </Link>
                    </h6>
                    <small className="text-muted d-block">
                      {new Date(event.start_date).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </small>
                    {event.location && (
                      <small className="text-muted d-block">
                        📍 {event.location}
                      </small>
                    )}
                  </div>
                ))
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="h-100 shadow-hover">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <Card.Title className="mb-0">Recent Documents</Card.Title>
                <Link to="/documents" className="btn btn-sm btn-outline-primary">
                  View All
                </Link>
              </div>
              {recentDocuments.length === 0 ? (
                <div className="empty-state py-4">
                  <p className="text-muted">No documents available</p>
                </div>
              ) : (
                recentDocuments.map(doc => (
                  <div key={doc.id} className="mb-3 pb-3 border-bottom">
                    <h6 className="mb-1">
                      <Link to="/documents" className="text-decoration-none text-dark">
                        {doc.subject}
                      </Link>
                    </h6>
                    <small className="text-muted d-block">
                      {new Date(doc.published).toLocaleDateString()}
                    </small>
                    {doc.author && (
                      <small className="text-muted d-block">
                        by {doc.author.display_name}
                      </small>
                    )}
                  </div>
                ))
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="g-4">
        <Col md={6}>
          <Card className="shadow-hover">
            <Card.Body>
              <h4 className="mb-3">About FUSION</h4>
              <p className="text-muted-light mb-2">
                FUSION is Mitsubishi Fuso's integrated intranet platform, designed to improve
                communication, collaboration, and access to company resources.
              </p>
              <p className="text-muted-light mb-0">
                Stay connected with your colleagues, access important documents, and
                stay up-to-date with company news and events.
              </p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="shadow-hover">
            <Card.Body>
              <h4 className="mb-3">Quick Links</h4>
              <ul className="list-unstyled mb-0">
                <li className="mb-2">
                  <Link to="/documents" className="text-decoration-none">
                    📄 Company Documents
                  </Link>
                </li>
                <li className="mb-2">
                  <Link to="/posts" className="text-decoration-none">
                    📰 News & Announcements
                  </Link>
                </li>
                <li className="mb-2">
                  <Link to="/events" className="text-decoration-none">
                    📅 Events & Meetings
                  </Link>
                </li>
                <li className="mb-2">
                  <Link to="/calendar" className="text-decoration-none">
                    🗓️ Calendar View
                  </Link>
                </li>
                <li>
                  <Link to="/admin" className="text-decoration-none">
                    ⚙️ Admin Panel
                  </Link>
                </li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
