import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge } from 'react-bootstrap';
import { documentsAPI } from '../services/api';

const Documents = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await documentsAPI.getAll();
      setDocuments(response.data.data);
    } catch (error) {
      console.error('Error fetching documents:', error);
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
      <h2 className="mb-4">Documents</h2>
      <Row>
        {documents.map(doc => (
          <Col md={6} lg={4} key={doc.id} className="mb-4">
            <Card className="h-100 shadow-sm">
              <Card.Body>
                <Card.Title>{doc.subject}</Card.Title>
                <Card.Text>
                  <small className="text-muted">
                    By {doc.author?.display_name} | {new Date(doc.published).toLocaleDateString()}
                  </small>
                </Card.Text>
                <div className="mb-2">
                  {doc.tags && doc.tags.map((tag, index) => (
                    <Badge key={index} bg="secondary" className="me-1">{tag}</Badge>
                  ))}
                </div>
                <div className="d-flex justify-content-between text-muted">
                  <small>Views: {doc.view_count}</small>
                  <small>Likes: {doc.like_count}</small>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Documents;
