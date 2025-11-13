import React, { useState, useEffect } from 'react';
import { Table, Button, Alert } from 'react-bootstrap';
import { postsAPI } from '../services/api';

const PostsAdmin = () => {
  const [posts, setPosts] = useState([]);
  const [alert, setAlert] = useState({ show: false, message: '', variant: '' });

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await postsAPI.getAll();
      setPosts(response.data.data);
    } catch (error) {
      showAlert('Error fetching posts', 'danger');
    }
  };

  const showAlert = (message, variant = 'info') => {
    setAlert({ show: true, message, variant });
    setTimeout(() => setAlert({ show: false, message: '', variant: '' }), 3000);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await postsAPI.delete(id);
        showAlert('Post deleted successfully', 'success');
        fetchPosts();
      } catch (error) {
        showAlert('Error deleting post', 'danger');
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

      <h4 className="mb-3">Manage Posts/News</h4>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Subject</th>
            <th>Author</th>
            <th>Published</th>
            <th>Views</th>
            <th>Likes</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {posts.map(post => (
            <tr key={post.id}>
              <td>{post.id}</td>
              <td>{post.subject}</td>
              <td>{post.author?.display_name}</td>
              <td>{new Date(post.published).toLocaleDateString()}</td>
              <td>{post.view_count}</td>
              <td>{post.like_count}</td>
              <td>
                <Button size="sm" variant="danger" onClick={() => handleDelete(post.id)}>
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

export default PostsAdmin;
