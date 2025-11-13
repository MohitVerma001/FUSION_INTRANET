import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Alert } from 'react-bootstrap';
import { videosAPI, usersAPI, placesAPI } from '../services/api';

const VideosAdmin = () => {
  const [videos, setVideos] = useState([]);
  const [users, setUsers] = useState([]);
  const [places, setPlaces] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: '', variant: '' });
  const [formData, setFormData] = useState({
    title: '', description: '', video_url: '', thumbnail_url: '',
    duration: '', author_id: '', place_id: '', tags: []
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [videosRes, usersRes, placesRes] = await Promise.all([
        videosAPI.getAll(), usersAPI.getAll(), placesAPI.getAll()
      ]);
      setVideos(videosRes.data.data);
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
      if (currentVideo) {
        await videosAPI.update(currentVideo.id, formData);
        showAlert('Video updated!', 'success');
      } else {
        await videosAPI.create(formData);
        showAlert('Video created!', 'success');
      }
      fetchData();
      handleClose();
    } catch (error) {
      showAlert('Error saving video', 'danger');
    }
  };

  const handleEdit = (video) => {
    setCurrentVideo(video);
    setFormData({
      title: video.title, description: video.description || '',
      video_url: video.video_url || '', thumbnail_url: video.thumbnail_url || '',
      duration: video.duration || '', author_id: video.author_id || '',
      place_id: video.place_id || '', tags: video.tags || []
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this video?')) {
      try {
        await videosAPI.delete(id);
        showAlert('Video deleted!', 'success');
        fetchData();
      } catch (error) {
        showAlert('Error deleting video', 'danger');
      }
    }
  };

  const handleClose = () => {
    setShowModal(false);
    setCurrentVideo(null);
    setFormData({ title: '', description: '', video_url: '', thumbnail_url: '',
      duration: '', author_id: '', place_id: '', tags: [] });
  };

  return (
    <div>
      <div className="d-flex justify-content-between mb-3">
        <h4>Videos Management</h4>
        <Button variant="primary" onClick={() => setShowModal(true)}>Create Video</Button>
      </div>
      {alert.show && <Alert variant={alert.variant} dismissible>{alert.message}</Alert>}
      <Table striped bordered hover responsive>
        <thead>
          <tr><th>Title</th><th>Author</th><th>Views</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {videos.map(video => (
            <tr key={video.id}>
              <td>{video.title}</td>
              <td>{video.author?.display_name || 'N/A'}</td>
              <td>{video.view_count || 0}</td>
              <td>
                <Button variant="warning" size="sm" className="me-2" onClick={() => handleEdit(video)}>Edit</Button>
                <Button variant="danger" size="sm" onClick={() => handleDelete(video.id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Modal show={showModal} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{currentVideo ? 'Edit' : 'Create'} Video</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Title *</Form.Label>
              <Form.Control type="text" value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" rows={3} value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Video URL *</Form.Label>
              <Form.Control type="url" value={formData.video_url}
                onChange={(e) => setFormData({...formData, video_url: e.target.value})} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Thumbnail URL</Form.Label>
              <Form.Control type="url" value={formData.thumbnail_url}
                onChange={(e) => setFormData({...formData, thumbnail_url: e.target.value})} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Duration (seconds)</Form.Label>
              <Form.Control type="number" value={formData.duration}
                onChange={(e) => setFormData({...formData, duration: e.target.value})} />
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
            <div className="d-flex justify-content-end">
              <Button variant="secondary" onClick={handleClose} className="me-2">Cancel</Button>
              <Button variant="primary" type="submit">{currentVideo ? 'Update' : 'Create'}</Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default VideosAdmin;
