import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Badge } from 'react-bootstrap';
import { eventsAPI } from '../services/api';

const Events = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await eventsAPI.getAll();
      setEvents(response.data.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <Container className="mt-5">
        <div className="text-center">Loading...</div>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <h2 className="mb-4">Events</h2>
      <Row>
        {events.map(event => (
          <Col md={6} lg={4} key={event.id} className="mb-4">
            <Card
              className="h-100 shadow-sm border-start border-primary border-4"
              style={{ cursor: 'pointer' }}
              onClick={() => navigate(`/events/${event.id}`)}
            >
              <Card.Body>
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <Card.Title>{event.subject}</Card.Title>
                  <Badge bg={event.event_access === 'open' ? 'success' : 'secondary'}>
                    {event.event_access}
                  </Badge>
                </div>
                <Card.Text className="text-muted">
                  <div><strong>Start:</strong> {formatDate(event.start_date)}</div>
                  <div><strong>End:</strong> {formatDate(event.end_date)}</div>
                  {event.location && <div><strong>Location:</strong> {event.location}</div>}
                  {event.phone && <div><strong>Phone:</strong> {event.phone}</div>}
                </Card.Text>
                <div className="mb-2">
                  {event.tags && event.tags.map((tag, index) => (
                    <Badge key={index} bg="secondary" className="me-1">{tag}</Badge>
                  ))}
                </div>
                <div className="d-flex justify-content-between text-muted small">
                  <span>Views: {event.view_count}</span>
                  <span>Likes: {event.like_count}</span>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Events;
