import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Badge } from 'react-bootstrap';
import { postsAPI } from '../services/api';

const Posts = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await postsAPI.getAll();
      setPosts(response.data.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
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
      <h2 className="mb-4">News & Updates</h2>
      <Row>
        {posts.map(post => (
          <Col md={12} key={post.id} className="mb-4">
            <Card
              className="shadow-sm"
              style={{ cursor: 'pointer' }}
              onClick={() => navigate(`/posts/${post.id}`)}
            >
              <Card.Body>
                <Card.Title as="h3">{post.subject}</Card.Title>
                <Card.Subtitle className="mb-3 text-muted">
                  Posted by {post.author?.display_name} on {new Date(post.published).toLocaleDateString()}
                  {post.place && ` in ${post.place.name}`}
                </Card.Subtitle>
                <div className="mb-3">
                  {post.tags && post.tags.map((tag, index) => (
                    <Badge key={index} bg="primary" className="me-1">{tag}</Badge>
                  ))}
                </div>
                <div className="d-flex justify-content-between text-muted">
                  <span>
                    <i className="bi bi-eye"></i> {post.view_count} views
                  </span>
                  <span>
                    <i className="bi bi-heart"></i> {post.like_count} likes
                  </span>
                  <span>
                    <i className="bi bi-people"></i> {post.follower_count} followers
                  </span>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Posts;
