import React, { useState } from 'react';
import { Container, Tabs, Tab } from 'react-bootstrap';
import UsersAdmin from './UsersAdmin';
import PlacesAdmin from './PlacesAdmin';
import DocumentsAdmin from './DocumentsAdmin';
import EventsAdmin from './EventsAdmin';
import PostsAdmin from './PostsAdmin';

const AdminPanel = () => {
  const [key, setKey] = useState('users');

  return (
    <Container className="mt-4">
      <h2 className="mb-4">Admin Panel</h2>
      <Tabs
        id="admin-tabs"
        activeKey={key}
        onSelect={(k) => setKey(k)}
        className="mb-3"
      >
        <Tab eventKey="users" title="Users">
          <UsersAdmin />
        </Tab>
        <Tab eventKey="places" title="Places">
          <PlacesAdmin />
        </Tab>
        <Tab eventKey="documents" title="Documents">
          <DocumentsAdmin />
        </Tab>
        <Tab eventKey="events" title="Events">
          <EventsAdmin />
        </Tab>
        <Tab eventKey="posts" title="Posts/News">
          <PostsAdmin />
        </Tab>
      </Tabs>
    </Container>
  );
};

export default AdminPanel;
