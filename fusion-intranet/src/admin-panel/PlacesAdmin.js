import React, { useState, useEffect } from 'react';
import { Table, Button, Alert } from 'react-bootstrap';
import { placesAPI } from '../services/api';

const PlacesAdmin = () => {
  const [places, setPlaces] = useState([]);
  const [alert, setAlert] = useState({ show: false, message: '', variant: '' });

  useEffect(() => {
    fetchPlaces();
  }, []);

  const fetchPlaces = async () => {
    try {
      const response = await placesAPI.getAll();
      setPlaces(response.data.data);
    } catch (error) {
      showAlert('Error fetching places', 'danger');
    }
  };

  const showAlert = (message, variant = 'info') => {
    setAlert({ show: true, message, variant });
    setTimeout(() => setAlert({ show: false, message: '', variant: '' }), 3000);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this place?')) {
      try {
        await placesAPI.delete(id);
        showAlert('Place deleted successfully', 'success');
        fetchPlaces();
      } catch (error) {
        showAlert('Error deleting place', 'danger');
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

      <h4 className="mb-3">Manage Places</h4>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Type</th>
            <th>Description</th>
            <th>Tags</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {places.map(place => (
            <tr key={place.id}>
              <td>{place.id}</td>
              <td>{place.name}</td>
              <td>{place.place_type}</td>
              <td>{place.description?.substring(0, 50)}...</td>
              <td>{place.tags?.join(', ')}</td>
              <td>
                <Button size="sm" variant="danger" onClick={() => handleDelete(place.id)}>
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

export default PlacesAdmin;
