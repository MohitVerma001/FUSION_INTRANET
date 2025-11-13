import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Badge, Button, Form, Spinner, Alert } from 'react-bootstrap';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { getPostById, updatePost } from '../services/supabase';

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [editForm, setEditForm] = useState({
    subject: '',
    content_text: '',
    tags: []
  });

  useEffect(() => {
    loadPost();
  }, [id]);

  const loadPost = async () => {
    try {
      setLoading(true);
      const data = await getPostById(id);
      if (!data) {
        setError('Post not found');
        return;
      }
      setPost(data);
      setEditForm({
        subject: data.subject || '',
        content_text: data.content_text || '',
        tags: Array.isArray(data.tags) ? data.tags : []
      });
    } catch (err) {
      setError('Failed to load post: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await updatePost(id, {
        subject: editForm.subject,
        content_text: editForm.content_text,
        tags: editForm.tags
      });
      await loadPost();
      setIsEditing(false);
    } catch (err) {
      setError('Failed to save: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditForm({
      subject: post.subject || '',
      content_text: post.content_text || '',
      tags: Array.isArray(post.tags) ? post.tags : []
    });
    setIsEditing(false);
  };

  const handleTagsChange = (e) => {
    const tagsString = e.target.value;
    const tagsArray = tagsString.split(',').map(tag => tag.trim()).filter(tag => tag);
    setEditForm({ ...editForm, tags: tagsArray });
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

  if (error || !post) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">{error || 'Post not found'}</Alert>
        <Button onClick={() => navigate('/posts')}>Back to Posts</Button>
      </Container>
    );
  }

  return (
    <Container className="mt-4 mb-5">
      <Row className="mb-3">
        <Col>
          <Button variant="outline-secondary" onClick={() => navigate('/posts')}>
            Back to Posts
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
                <Form.Label><strong>Title</strong></Form.Label>
                <Form.Control
                  type="text"
                  value={editForm.subject}
                  onChange={(e) => setEditForm({ ...editForm, subject: e.target.value })}
                  placeholder="Post title"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label><strong>Content</strong></Form.Label>
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
                  Separate tags with commas (e.g., news, update, important)
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
              <Card.Title as="h2" className="mb-3">{post.subject}</Card.Title>

              <Card.Subtitle className="mb-3 text-muted">
                <div className="d-flex flex-wrap align-items-center gap-2">
                  <span>
                    Posted by <strong>{post.author?.display_name || 'Unknown'}</strong>
                  </span>
                  <span>•</span>
                  <span>{new Date(post.published).toLocaleDateString()}</span>
                  {post.place && (
                    <>
                      <span>•</span>
                      <span>in <strong>{post.place.name}</strong></span>
                    </>
                  )}
                </div>
              </Card.Subtitle>

              {post.tags && post.tags.length > 0 && (
                <div className="mb-3">
                  {post.tags.map((tag, index) => (
                    <Badge key={index} bg="primary" className="me-1 mb-1">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              {post.content_text && (
                <div
                  className="mb-4"
                  dangerouslySetInnerHTML={{ __html: post.content_text }}
                  style={{ lineHeight: '1.6' }}
                />
              )}

              {post.images && post.images.length > 0 && (
                <div className="mb-4">
                  <h5>Images</h5>
                  <Row>
                    {post.images.map((image, index) => (
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
                  <i className="bi bi-eye"></i> {post.view_count || 0} views
                </span>
                <span>
                  <i className="bi bi-heart"></i> {post.like_count || 0} likes
                </span>
                <span>
                  <i className="bi bi-people"></i> {post.follower_count || 0} followers
                </span>
              </div>

              {post.updated && post.updated !== post.published && (
                <div className="text-muted small mt-2">
                  Last updated: {new Date(post.updated).toLocaleString()}
                </div>
              )}
            </>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default PostDetail;
