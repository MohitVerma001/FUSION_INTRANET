import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Alert, Badge } from 'react-bootstrap';
import { discussionsAPI, usersAPI, placesAPI } from '../services/api';

const DiscussionsAdmin = () => {
  const [discussions, setDiscussions] = useState([]);
  const [users, setUsers] = useState([]);
  const [places, setPlaces] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [current, setCurrent] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: '', variant: '' });
  const [formData, setFormData] = useState({
    topic: '', content_text: '', author_id: '', place_id: '',
    tags: [], is_question: false, is_answered: false
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [discussionsRes, usersRes, placesRes] = await Promise.all([
        discussionsAPI.getAll(), usersAPI.getAll(), placesAPI.getAll()
      ]);
      setDiscussions(discussionsRes.data.data);
      setUsers(usersRes.data.data);
      setPlaces(placesRes.data.data);
    } catch (error) {
      showAlert('Error fetching data', 'danger');
    }
  };

  const showAlert = (message, variant) => {
    setAlert({ show: true, message, variant });
    setTimeout(() => setAlert({ show: false, message: '', variant: '' }), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (current) {
        await discussionsAPI.update(current.id, formData);
        showAlert('Discussion updated!', 'success');
      } else {
        await discussionsAPI.create(formData);
        showAlert('Discussion created!', 'success');
      }
      fetchData();
      handleClose();
    } catch (error) {
      showAlert('Error saving discussion', 'danger');
    }
  };

  const handleEdit = (disc) => {
    setCurrent(disc);
    setFormData({
      topic: disc.topic, content_text: disc.content_text || '',
      author_id: disc.author_id || '', place_id: disc.place_id || '',
      tags: disc.tags || [], is_question: disc.is_question || false,
      is_answered: disc.is_answered || false
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this discussion?')) {
      try {
        await discussionsAPI.delete(id);
        showAlert('Discussion deleted!', 'success');
        fetchData();
      } catch (error) {
        showAlert('Error deleting discussion', 'danger');
      }
    }
  };

  const handleClose = () => {
    setShowModal(false);
    setCurrent(null);
    setFormData({ topic: '', content_text: '', author_id: '', place_id: '',
      tags: [], is_question: false, is_answered: false });
  };

  return (
    <div>
      <div className="d-flex justify-content-between mb-3">
        <h4>Discussions Management</h4>
        <Button variant="primary" onClick={() => setShowModal(true)}>Create Discussion</Button>
      </div>
      {alert.show && <Alert variant={alert.variant} dismissible>{alert.message}</Alert>}
      <Table striped bordered hover responsive>
        <thead>
          <tr><th>Topic</th><th>Author</th><th>Type</th><th>Replies</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {discussions.map(disc => (
            <tr key={disc.id}>
              <td>{disc.topic}</td>
              <td>{disc.author?.display_name || 'N/A'}</td>
              <td>
                {disc.is_question ? (
                  <Badge bg={disc.is_answered ? 'success' : 'warning'}>
                    {disc.is_answered ? 'Answered' : 'Question'}
                  </Badge>
                ) : <Badge bg="info">Discussion</Badge>}
              </td>
              <td>{disc.reply_count || 0}</td>
              <td>
                <Button variant="warning" size="sm" className="me-2" onClick={() => handleEdit(disc)}>Edit</Button>
                <Button variant="danger" size="sm" onClick={() => handleDelete(disc.id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Modal show={showModal} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{current ? 'Edit' : 'Create'} Discussion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Topic *</Form.Label>
              <Form.Control type="text" value={formData.topic}
                onChange={(e) => setFormData({...formData, topic: e.target.value})} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Content</Form.Label>
              <Form.Control as="textarea" rows={5} value={formData.content_text}
                onChange={(e) => setFormData({...formData, content_text: e.target.value})} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Author</Form.Label>
              <Form.Select value={formData.author_id}
                onChange={(e) => setFormData({...formData, author_id: e.target.value})}>
                <option value="">Select Author</option>
                {users.map(u => <option key={u.id} value={u.id}>{u.display_name}</option>)}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Space</Form.Label>
              <Form.Select value={formData.place_id}
                onChange={(e) => setFormData({...formData, place_id: e.target.value})}>
                <option value="">Select Space</option>
                {places.map(p => <option key={p.id} value={p.id}>{p.display_name || p.name}</option>)}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Check type="checkbox" label="This is a question"
                checked={formData.is_question}
                onChange={(e) => setFormData({...formData, is_question: e.target.checked})} />
            </Form.Group>
            {formData.is_question && (
              <Form.Group className="mb-3">
                <Form.Check type="checkbox" label="Question is answered"
                  checked={formData.is_answered}
                  onChange={(e) => setFormData({...formData, is_answered: e.target.checked})} />
              </Form.Group>
            )}
            <div className="d-flex justify-content-end">
              <Button variant="secondary" onClick={handleClose} className="me-2">Cancel</Button>
              <Button variant="primary" type="submit">{current ? 'Update' : 'Create'}</Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default DiscussionsAdmin;
