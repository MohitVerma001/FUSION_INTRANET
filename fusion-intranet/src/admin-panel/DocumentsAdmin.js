import React, { useState, useEffect } from 'react';
import { Table, Button, Alert } from 'react-bootstrap';
import { documentsAPI } from '../services/api';

const DocumentsAdmin = () => {
  const [documents, setDocuments] = useState([]);
  const [alert, setAlert] = useState({ show: false, message: '', variant: '' });

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await documentsAPI.getAll();
      setDocuments(response.data.data);
    } catch (error) {
      showAlert('Error fetching documents', 'danger');
    }
  };

  const showAlert = (message, variant = 'info') => {
    setAlert({ show: true, message, variant });
    setTimeout(() => setAlert({ show: false, message: '', variant: '' }), 3000);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      try {
        await documentsAPI.delete(id);
        showAlert('Document deleted successfully', 'success');
        fetchDocuments();
      } catch (error) {
        showAlert('Error deleting document', 'danger');
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

      <h4 className="mb-3">Manage Documents</h4>

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
          {documents.map(doc => (
            <tr key={doc.id}>
              <td>{doc.id}</td>
              <td>{doc.subject}</td>
              <td>{doc.author?.display_name}</td>
              <td>{new Date(doc.published).toLocaleDateString()}</td>
              <td>{doc.view_count}</td>
              <td>{doc.like_count}</td>
              <td>
                <Button size="sm" variant="danger" onClick={() => handleDelete(doc.id)}>
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

export default DocumentsAdmin;
