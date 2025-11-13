import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { postsAPI, eventsAPI, documentsAPI } from '../services/api';

const Home = () => {
  const [recentPosts, setRecentPosts] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [recentDocuments, setRecentDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Container className="mt-5">
        <div className="text-center">Loading...</div>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <div className="mb-4">
        <h1 className="display-4">Welcome to FUSION Intranet</h1>
        <p className="lead">Your central hub for company news, documents, and events</p>
      </div>

      <Row className="mb-4">
        <Col md={4}>
          <Card className="h-100">
            <Card.Body>
              <Card.Title>Latest News</Card.Title>
              {recentPosts.map(post => (
                <div key={post.id} className="mb-3 pb-3 border-bottom">
                  <h6>{post.subject}</h6>
                  <small className="text-muted">
                    {new Date(post.published).toLocaleDateString()}
                  </small>
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="h-100">
            <Card.Body>
              <Card.Title>Upcoming Events</Card.Title>
              {upcomingEvents.map(event => (
                <div key={event.id} className="mb-3 pb-3 border-bottom">
                  <h6>{event.subject}</h6>
                  <small className="text-muted">
                    {new Date(event.start_date).toLocaleDateString()}
                  </small>
                  {event.location && <div><small>{event.location}</small></div>}
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="h-100">
            <Card.Body>
              <Card.Title>Recent Documents</Card.Title>
              {recentDocuments.map(doc => (
                <div key={doc.id} className="mb-3 pb-3 border-bottom">
                  <h6>{doc.subject}</h6>
                  <small className="text-muted">
                    {new Date(doc.published).toLocaleDateString()}
                  </small>
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Card className="bg-light">
            <Card.Body>
              <h4>About FUSION</h4>
              <p>
                FUSION is Fuso's integrated intranet platform, designed to improve
                communication, collaboration, and access to company resources.
              </p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="bg-light">
            <Card.Body>
              <h4>Quick Links</h4>
              <ul>
                <li>Company Directory</li>
                <li>HR Resources</li>
                <li>IT Support</li>
                <li>Policies & Procedures</li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
