import React, { useState, useEffect } from 'react';
import { Table, Button, Alert } from 'react-bootstrap';
import { eventsAPI } from '../services/api';

const EventsAdmin = () => {
  const [events, setEvents] = useState([]);
  const [alert, setAlert] = useState({ show: false, message: '', variant: '' });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await eventsAPI.getAll();
      setEvents(response.data.data);
    } catch (error) {
      showAlert('Error fetching events', 'danger');
    }
  };

  const showAlert = (message, variant = 'info') => {
    setAlert({ show: true, message, variant });
    setTimeout(() => setAlert({ show: false, message: '', variant: '' }), 3000);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await eventsAPI.delete(id);
        showAlert('Event deleted successfully', 'success');
        fetchEvents();
      } catch (error) {
        showAlert('Error deleting event', 'danger');
      }
    }
  };

  return (
    <div>
      {alert.show && (
        <Alert variant={alert.variant} onClose={() => setAlert({ ...alert, show: false })} dismissible>
          {alert.message}
        </Alert>
      )}

      <h4 className="mb-3">Manage Events</h4>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Subject</th>
            <th>Start Date</th>
            <th>Location</th>
            <th>Access</th>
            <th>Views</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {events.map(event => (
            <tr key={event.id}>
              <td>{event.id}</td>
              <td>{event.subject}</td>
              <td>{new Date(event.start_date).toLocaleDateString()}</td>
              <td>{event.location}</td>
              <td>{event.event_access}</td>
              <td>{event.view_count}</td>
              <td>
                <Button size="sm" variant="danger" onClick={() => handleDelete(event.id)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default EventsAdmin;
