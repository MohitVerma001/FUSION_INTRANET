import React, { useState } from 'react';
import { Container, Tabs, Tab } from 'react-bootstrap';
import UsersAdmin from './UsersAdmin';
import PlacesAdmin from './PlacesAdmin';
import DocumentsAdmin from './DocumentsAdmin';
import EventsAdmin from './EventsAdmin';
import PostsAdmin from './PostsAdmin';
import PollsAdmin from './PollsAdmin';
import VideosAdmin from './VideosAdmin';
import DiscussionsAdmin from './DiscussionsAdmin';

const AdminPanel = () => {
  const [key, setKey] = useState('users');

  return (
    <Container className="mt-4 admin-panel">
      <div className="admin-header">
        <h2 className="mb-0">FUSION Intranet Admin Panel</h2>
        <p className="mb-0 mt-2 opacity-75">Manage all content types and users</p>
      </div>
      <Tabs
        id="admin-tabs"
        activeKey={key}
        onSelect={(k) => setKey(k)}
        className="mb-3"
      >
        <Tab eventKey="users" title="Users">
          <UsersAdmin />
        </Tab>
        <Tab eventKey="places" title="Spaces">
          <PlacesAdmin />
        </Tab>
        <Tab eventKey="posts" title="Blog Posts">
          <PostsAdmin />
        </Tab>
        <Tab eventKey="documents" title="Documents">
          <DocumentsAdmin />
        </Tab>
        <Tab eventKey="events" title="Events">
          <EventsAdmin />
        </Tab>
        <Tab eventKey="polls" title="Polls">
          <PollsAdmin />
        </Tab>
        <Tab eventKey="videos" title="Videos">
          <VideosAdmin />
        </Tab>
        <Tab eventKey="discussions" title="Discussions">
          <DiscussionsAdmin />
        </Tab>
      </Tabs>
    </Container>
  );
};

export default AdminPanel;
