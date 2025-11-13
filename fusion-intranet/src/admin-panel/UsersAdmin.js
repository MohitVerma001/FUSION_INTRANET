import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Alert } from 'react-bootstrap';
import { usersAPI } from '../services/api';

const UsersAdmin = () => {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    user_principal_name: '',
    email: '',
    display_name: '',
    given_name: '',
    surname: '',
    mobile_phone: '',
    preferred_language: '',
    office_location: ''
  });
  const [alert, setAlert] = useState({ show: false, message: '', variant: '' });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await usersAPI.getAll();
      setUsers(response.data.data);
    } catch (error) {
      showAlert('Error fetching users', 'danger');
    }
  };

  const showAlert = (message, variant = 'info') => {
    setAlert({ show: true, message, variant });
    setTimeout(() => setAlert({ show: false, message: '', variant: '' }), 3000);
  };

  const handleShowModal = (user = null) => {
    if (user) {
      setCurrentUser(user);
      setFormData(user);
    } else {
      setCurrentUser(null);
      setFormData({
        username: '',
        user_principal_name: '',
        email: '',
        display_name: '',
        given_name: '',
        surname: '',
        mobile_phone: '',
        preferred_language: '',
        office_location: ''
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentUser(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentUser) {
        await usersAPI.update(currentUser.id, formData);
        showAlert('User updated successfully', 'success');
      } else {
        await usersAPI.create(formData);
        showAlert('User created successfully', 'success');
      }
      handleCloseModal();
      fetchUsers();
    } catch (error) {
      showAlert('Error saving user', 'danger');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await usersAPI.delete(id);
        showAlert('User deleted successfully', 'success');
        fetchUsers();
      } catch (error) {
        showAlert('Error deleting user', 'danger');
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

      <div className="d-flex justify-content-between mb-3">
        <h4>Manage Users</h4>
        <Button variant="primary" onClick={() => handleShowModal()}>
          Add New User
        </Button>
      </div>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Username</th>
            <th>Display Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Location</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.username}</td>
              <td>{user.display_name}</td>
              <td>{user.email}</td>
              <td>{user.mobile_phone}</td>
              <td>{user.office_location}</td>
              <td>
                <Button size="sm" variant="info" onClick={() => handleShowModal(user)} className="me-2">
                  Edit
                </Button>
                <Button size="sm" variant="danger" onClick={() => handleDelete(user.id)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{currentUser ? 'Edit User' : 'Add New User'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Username *</Form.Label>
              <Form.Control
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>User Principal Name *</Form.Label>
              <Form.Control
                type="text"
                value={formData.user_principal_name}
                onChange={(e) => setFormData({ ...formData, user_principal_name: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Display Name</Form.Label>
              <Form.Control
                type="text"
                value={formData.display_name}
                onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Given Name</Form.Label>
              <Form.Control
                type="text"
                value={formData.given_name}
                onChange={(e) => setFormData({ ...formData, given_name: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Surname</Form.Label>
              <Form.Control
                type="text"
                value={formData.surname}
                onChange={(e) => setFormData({ ...formData, surname: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Mobile Phone</Form.Label>
              <Form.Control
                type="text"
                value={formData.mobile_phone}
                onChange={(e) => setFormData({ ...formData, mobile_phone: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Preferred Language</Form.Label>
              <Form.Control
                type="text"
                value={formData.preferred_language}
                onChange={(e) => setFormData({ ...formData, preferred_language: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Office Location</Form.Label>
              <Form.Control
                type="text"
                value={formData.office_location}
                onChange={(e) => setFormData({ ...formData, office_location: e.target.value })}
              />
            </Form.Group>

            <div className="d-flex justify-content-end">
              <Button variant="secondary" onClick={handleCloseModal} className="me-2">
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                {currentUser ? 'Update' : 'Create'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default UsersAdmin;
