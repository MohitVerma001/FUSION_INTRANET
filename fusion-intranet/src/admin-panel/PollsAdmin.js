import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Alert, Badge } from 'react-bootstrap';
import { pollsAPI, usersAPI, placesAPI } from '../services/api';

const PollsAdmin = () => {
  const [polls, setPolls] = useState([]);
  const [users, setUsers] = useState([]);
  const [places, setPlaces] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentPoll, setCurrentPoll] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: '', variant: '' });
  const [pollOptions, setPollOptions] = useState(['', '']);

  const [formData, setFormData] = useState({
    question: '',
    description: '',
    author_id: '',
    place_id: '',
    tags: [],
    end_date: '',
    allow_multiple_votes: false
  });

  useEffect(() => {
    fetchPolls();
    fetchUsers();
    fetchPlaces();
  }, []);

  const fetchPolls = async () => {
    try {
      const response = await pollsAPI.getAll();
      setPolls(response.data.data);
    } catch (error) {
      showAlert('Error fetching polls', 'danger');
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await usersAPI.getAll();
      setUsers(response.data.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchPlaces = async () => {
    try {
      const response = await placesAPI.getAll();
      setPlaces(response.data.data);
    } catch (error) {
      console.error('Error fetching places:', error);
    }
  };

  const showAlert = (message, variant) => {
    setAlert({ show: true, message, variant });
    setTimeout(() => setAlert({ show: false, message: '', variant: '' }), 3000);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleTagsChange = (e) => {
    const tagsArray = e.target.value.split(',').map(tag => tag.trim());
    setFormData({ ...formData, tags: tagsArray });
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...pollOptions];
    newOptions[index] = value;
    setPollOptions(newOptions);
  };

  const addOption = () => {
    setPollOptions([...pollOptions, '']);
  };

  const removeOption = (index) => {
    if (pollOptions.length > 2) {
      setPollOptions(pollOptions.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const pollData = {
        ...formData,
        options: pollOptions.filter(opt => opt.trim() !== '')
      };

      if (currentPoll) {
        await pollsAPI.update(currentPoll.id, pollData);
        showAlert('Poll updated successfully!', 'success');
      } else {
        await pollsAPI.create(pollData);
        showAlert('Poll created successfully!', 'success');
      }
      fetchPolls();
      handleCloseModal();
    } catch (error) {
      showAlert('Error saving poll', 'danger');
    }
  };

  const handleEdit = (poll) => {
    setCurrentPoll(poll);
    setFormData({
      question: poll.question,
      description: poll.description || '',
      author_id: poll.author_id || '',
      place_id: poll.place_id || '',
      tags: poll.tags || [],
      end_date: poll.end_date ? poll.end_date.split('T')[0] : '',
      allow_multiple_votes: poll.allow_multiple_votes || false
    });
    setPollOptions(poll.options?.map(opt => opt.option_text) || ['', '']);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this poll?')) {
      try {
        await pollsAPI.delete(id);
        showAlert('Poll deleted successfully!', 'success');
        fetchPolls();
      } catch (error) {
        showAlert('Error deleting poll', 'danger');
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentPoll(null);
    setFormData({
      question: '',
      description: '',
      author_id: '',
      place_id: '',
      tags: [],
      end_date: '',
      allow_multiple_votes: false
    });
    setPollOptions(['', '']);
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>Polls Management</h4>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          Create New Poll
        </Button>
      </div>

      {alert.show && (
        <Alert variant={alert.variant} onClose={() => setAlert({ ...alert, show: false })} dismissible>
          {alert.message}
        </Alert>
      )}

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Question</th>
            <th>Author</th>
            <th>Place</th>
            <th>Votes</th>
            <th>End Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {polls.map((poll) => (
            <tr key={poll.id}>
              <td>{poll.question}</td>
              <td>{poll.author?.display_name || 'N/A'}</td>
              <td>{poll.place?.display_name || 'N/A'}</td>
              <td>
                <Badge bg="info">{poll.vote_count || 0}</Badge>
              </td>
              <td>{poll.end_date ? new Date(poll.end_date).toLocaleDateString() : 'No end date'}</td>
              <td>
                <Button variant="warning" size="sm" className="me-2" onClick={() => handleEdit(poll)}>
                  Edit
                </Button>
                <Button variant="danger" size="sm" onClick={() => handleDelete(poll.id)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{currentPoll ? 'Edit Poll' : 'Create New Poll'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Question *</Form.Label>
              <Form.Control
                type="text"
                name="question"
                value={formData.question}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Poll Options *</Form.Label>
              {pollOptions.map((option, index) => (
                <div key={index} className="d-flex mb-2">
                  <Form.Control
                    type="text"
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                    required
                    className="me-2"
                  />
                  {pollOptions.length > 2 && (
                    <Button variant="danger" size="sm" onClick={() => removeOption(index)}>
                      Remove
                    </Button>
                  )}
                </div>
              ))}
              <Button variant="secondary" size="sm" onClick={addOption}>
                + Add Option
              </Button>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Author</Form.Label>
              <Form.Select name="author_id" value={formData.author_id} onChange={handleInputChange}>
                <option value="">Select Author</option>
                {users.map(user => (
                  <option key={user.id} value={user.id}>{user.display_name}</option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Space</Form.Label>
              <Form.Select name="place_id" value={formData.place_id} onChange={handleInputChange}>
                <option value="">Select Space</option>
                {places.map(place => (
                  <option key={place.id} value={place.id}>{place.display_name || place.name}</option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Tags (comma-separated)</Form.Label>
              <Form.Control
                type="text"
                value={formData.tags.join(', ')}
                onChange={handleTagsChange}
                placeholder="tag1, tag2, tag3"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>End Date</Form.Label>
              <Form.Control
                type="date"
                name="end_date"
                value={formData.end_date}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Allow multiple votes"
                name="allow_multiple_votes"
                checked={formData.allow_multiple_votes}
                onChange={handleInputChange}
              />
            </Form.Group>

            <div className="d-flex justify-content-end">
              <Button variant="secondary" onClick={handleCloseModal} className="me-2">
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                {currentPoll ? 'Update' : 'Create'} Poll
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default PollsAdmin;
