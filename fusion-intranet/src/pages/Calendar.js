import React, { useState, useEffect } from 'react';
import { Container, Table, Badge } from 'react-bootstrap';
import { eventsAPI } from '../services/api';

const Calendar = () => {
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

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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
      <h2 className="mb-4">Event Calendar</h2>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Event</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Location</th>
            <th>Access</th>
            <th>Organizer</th>
          </tr>
        </thead>
        <tbody>
          {events.map(event => (
            <tr key={event.id}>
              <td>
                <strong>{event.subject}</strong>
                <div className="mt-1">
                  {event.tags && event.tags.map((tag, index) => (
                    <Badge key={index} bg="secondary" className="me-1 small">{tag}</Badge>
                  ))}
                </div>
              </td>
              <td>{formatDateTime(event.start_date)}</td>
              <td>{formatDateTime(event.end_date)}</td>
              <td>{event.location || 'N/A'}</td>
              <td>
                <Badge bg={event.event_access === 'open' ? 'success' : 'secondary'}>
                  {event.event_access}
                </Badge>
              </td>
              <td>{event.author?.display_name || 'Unknown'}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default Calendar;
