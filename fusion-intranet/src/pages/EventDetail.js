import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Badge, Button, Form, Spinner, Alert } from 'react-bootstrap';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { getEventById, updateEvent } from '../services/supabase';

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [editForm, setEditForm] = useState({
    subject: '',
    content_text: '',
    location: '',
    phone: '',
    start_date: '',
    end_date: '',
    tags: []
  });

  useEffect(() => {
    loadEvent();
  }, [id]);

  const loadEvent = async () => {
    try {
      setLoading(true);
      const data = await getEventById(id);
      if (!data) {
        setError('Event not found');
        return;
      }
      setEvent(data);
      setEditForm({
        subject: data.subject || '',
        content_text: data.content_text || '',
        location: data.location || '',
        phone: data.phone || '',
        start_date: data.start_date ? new Date(data.start_date).toISOString().slice(0, 16) : '',
        end_date: data.end_date ? new Date(data.end_date).toISOString().slice(0, 16) : '',
        tags: Array.isArray(data.tags) ? data.tags : []
      });
    } catch (err) {
      setError('Failed to load event: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await updateEvent(id, {
        subject: editForm.subject,
        content_text: editForm.content_text,
        location: editForm.location,
        phone: editForm.phone,
        start_date: editForm.start_date ? new Date(editForm.start_date).toISOString() : null,
        end_date: editForm.end_date ? new Date(editForm.end_date).toISOString() : null,
        tags: editForm.tags
      });
      await loadEvent();
      setIsEditing(false);
    } catch (err) {
      setError('Failed to save: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditForm({
      subject: event.subject || '',
      content_text: event.content_text || '',
      location: event.location || '',
      phone: event.phone || '',
      start_date: event.start_date ? new Date(event.start_date).toISOString().slice(0, 16) : '',
      end_date: event.end_date ? new Date(event.end_date).toISOString().slice(0, 16) : '',
      tags: Array.isArray(event.tags) ? event.tags : []
    });
    setIsEditing(false);
  };

  const handleTagsChange = (e) => {
    const tagsString = e.target.value;
    const tagsArray = tagsString.split(',').map(tag => tag.trim()).filter(tag => tag);
    setEditForm({ ...editForm, tags: tagsArray });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'Not specified';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (error || !event) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">{error || 'Event not found'}</Alert>
        <Button onClick={() => navigate('/events')}>Back to Events</Button>
      </Container>
    );
  }

  return (
    <Container className="mt-4 mb-5">
      <Row className="mb-3">
        <Col>
          <Button variant="outline-secondary" onClick={() => navigate('/events')}>
            Back to Events
          </Button>
          {!isEditing && (
            <Button
              variant="primary"
              className="ms-2"
              onClick={() => setIsEditing(true)}
            >
              Edit
            </Button>
          )}
        </Col>
      </Row>

      <Card className="shadow">
        <Card.Body>
          {isEditing ? (
            <>
              <Form.Group className="mb-3">
                <Form.Label><strong>Event Title</strong></Form.Label>
                <Form.Control
                  type="text"
                  value={editForm.subject}
                  onChange={(e) => setEditForm({ ...editForm, subject: e.target.value })}
                  placeholder="Event title"
                />
              </Form.Group>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label><strong>Start Date & Time</strong></Form.Label>
                    <Form.Control
                      type="datetime-local"
                      value={editForm.start_date}
                      onChange={(e) => setEditForm({ ...editForm, start_date: e.target.value })}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label><strong>End Date & Time</strong></Form.Label>
                    <Form.Control
                      type="datetime-local"
                      value={editForm.end_date}
                      onChange={(e) => setEditForm({ ...editForm, end_date: e.target.value })}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label><strong>Location</strong></Form.Label>
                    <Form.Control
                      type="text"
                      value={editForm.location}
                      onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                      placeholder="Event location"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label><strong>Contact Phone</strong></Form.Label>
                    <Form.Control
                      type="text"
                      value={editForm.phone}
                      onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                      placeholder="Contact phone number"
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label><strong>Description</strong></Form.Label>
                <ReactQuill
                  theme="snow"
                  value={editForm.content_text}
                  onChange={(content) => setEditForm({ ...editForm, content_text: content })}
                  modules={{
                    toolbar: [
                      [{ 'header': [1, 2, 3, false] }],
                      ['bold', 'italic', 'underline', 'strike'],
                      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                      ['link', 'image'],
                      ['clean']
                    ]
                  }}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label><strong>Tags</strong></Form.Label>
                <Form.Control
                  type="text"
                  value={editForm.tags.join(', ')}
                  onChange={handleTagsChange}
                  placeholder="Enter tags separated by commas"
                />
                <Form.Text className="text-muted">
                  Separate tags with commas (e.g., meeting, conference, workshop)
                </Form.Text>
              </Form.Group>

              <div className="d-flex gap-2">
                <Button
                  variant="success"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
                <Button
                  variant="secondary"
                  onClick={handleCancel}
                  disabled={saving}
                >
                  Cancel
                </Button>
              </div>
            </>
          ) : (
            <>
              <Card.Title as="h2" className="mb-3">{event.subject}</Card.Title>

              <Card.Subtitle className="mb-3 text-muted">
                <div className="d-flex flex-wrap align-items-center gap-2">
                  <span>
                    Organized by <strong>{event.author?.display_name || 'Unknown'}</strong>
                  </span>
                  {event.place && (
                    <>
                      <span>•</span>
                      <span>in <strong>{event.place.name}</strong></span>
                    </>
                  )}
                </div>
              </Card.Subtitle>

              <Row className="mb-4">
                <Col md={6}>
                  <Card className="bg-light">
                    <Card.Body>
                      <h6 className="text-muted mb-2">
                        <i className="bi bi-calendar-event me-2"></i>Start
                      </h6>
                      <div>{formatDateTime(event.start_date)}</div>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={6}>
                  <Card className="bg-light">
                    <Card.Body>
                      <h6 className="text-muted mb-2">
                        <i className="bi bi-calendar-check me-2"></i>End
                      </h6>
                      <div>{formatDateTime(event.end_date)}</div>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              {(event.location || event.phone) && (
                <Row className="mb-4">
                  {event.location && (
                    <Col md={event.phone ? 6 : 12}>
                      <Card className="bg-light">
                        <Card.Body>
                          <h6 className="text-muted mb-2">
                            <i className="bi bi-geo-alt me-2"></i>Location
                          </h6>
                          <div>{event.location}</div>
                        </Card.Body>
                      </Card>
                    </Col>
                  )}
                  {event.phone && (
                    <Col md={event.location ? 6 : 12}>
                      <Card className="bg-light">
                        <Card.Body>
                          <h6 className="text-muted mb-2">
                            <i className="bi bi-telephone me-2"></i>Contact
                          </h6>
                          <div>{event.phone}</div>
                        </Card.Body>
                      </Card>
                    </Col>
                  )}
                </Row>
              )}

              {event.tags && event.tags.length > 0 && (
                <div className="mb-3">
                  {event.tags.map((tag, index) => (
                    <Badge key={index} bg="success" className="me-1 mb-1">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              {event.content_text && (
                <div
                  className="mb-4"
                  dangerouslySetInnerHTML={{ __html: event.content_text }}
                  style={{ lineHeight: '1.6' }}
                />
              )}

              {event.images && event.images.length > 0 && (
                <div className="mb-4">
                  <h5>Event Images</h5>
                  <Row>
                    {event.images.map((image, index) => (
                      <Col key={index} md={4} className="mb-3">
                        <Card>
                          <Card.Img
                            variant="top"
                            src={image.image_ref}
                            alt={image.image_name}
                            style={{ height: '200px', objectFit: 'cover' }}
                          />
                          {image.image_name && (
                            <Card.Body>
                              <Card.Text className="small text-muted">
                                {image.image_name}
                              </Card.Text>
                            </Card.Body>
                          )}
                        </Card>
                      </Col>
                    ))}
                  </Row>
                </div>
              )}

              <div className="d-flex justify-content-between text-muted border-top pt-3">
                <span>
                  <i className="bi bi-eye"></i> {event.view_count || 0} views
                </span>
                <span>
                  <i className="bi bi-heart"></i> {event.like_count || 0} likes
                </span>
                <span>
                  <i className="bi bi-people"></i> {event.follower_count || 0} followers
                </span>
              </div>

              {event.updated && event.updated !== event.published && (
                <div className="text-muted small mt-2">
                  Last updated: {new Date(event.updated).toLocaleString()}
                </div>
              )}
            </>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default EventDetail;
