import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { spacesAPI } from '../services/api';
import TopNavigation from '../components/TopNavigation';
import SecondaryNav from '../components/SecondaryNav';
import SpaceHeader from '../components/SpaceHeader';
import ContentTabs from '../components/ContentTabs';
import FilterBar from '../components/FilterBar';
import CategoriesSidebar from '../components/CategoriesSidebar';
import ContentCard from '../components/ContentCard';
import './SpacePage.css';

const SpacePage = () => {
  const { id = '2867' } = useParams();
  const [spaceData, setSpaceData] = useState(null);
  const [allContent, setAllContent] = useState([]);
  const [filteredContent, setFilteredContent] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [activeCategory, setActiveCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchSpaceData();
  }, [id]);

  useEffect(() => {
    filterContent();
  }, [activeTab, activeCategory, searchQuery, allContent]);

  const fetchSpaceData = async () => {
    try {
      setLoading(true);
      const response = await spacesAPI.getById(id);
      const data = response.data.data;

      setSpaceData(data.space);

      const combined = [
        ...(data.posts || []),
        ...(data.documents || []),
        ...(data.events || []),
        ...(data.polls || [])
      ].sort((a, b) => {
        const dateA = new Date(a.published || a.start_date || 0);
        const dateB = new Date(b.published || b.start_date || 0);
        return dateB - dateA;
      });

      setAllContent(combined);
      setFilteredContent(combined);
    } catch (error) {
      console.error('Error fetching space data:', error);
      setAllContent([]);
      setFilteredContent([]);
    } finally {
      setLoading(false);
    }
  };

  const filterContent = () => {
    let filtered = [...allContent];

    if (activeTab !== 'all') {
      filtered = filtered.filter(item => {
        const type = item.content_type || item.type;
        return type === activeTab || (activeTab === 'blogs' && type === 'post');
      });
    }

    if (searchQuery) {
      filtered = filtered.filter(item => {
        const subject = item.subject || item.question || item.title || '';
        return subject.toLowerCase().includes(searchQuery.toLowerCase());
      });
    }

    setFilteredContent(filtered);
  };

  const getContentCounts = () => {
    return {
      total: allContent.length,
      blogs: allContent.filter(c => c.type === 'post').length,
      documents: allContent.filter(c => c.type === 'document').length,
      discussions: 0,
      polls: allContent.filter(c => c.type === 'poll').length,
      videos: 0,
      events: allContent.filter(c => c.type === 'event').length
    };
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-page">
      <TopNavigation />
      <SecondaryNav />
      <SpaceHeader space={spaceData} />

      <div className="space-navigation">
        <div className="nav-tabs">
          <button className="nav-tab">News & Channels</button>
          <button className="nav-tab">Content & Guidelines</button>
          <button className="nav-tab">Activity</button>
          <button className="nav-tab active">Content</button>
          <button className="nav-tab">People</button>
          <button className="nav-tab">Subspaces</button>
          <button className="nav-tab">More ▼</button>
        </div>
        <div className="nav-actions">
          <button className="action-button">Actions ▼</button>
        </div>
      </div>

      <ContentTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        contentCounts={getContentCounts()}
      />

      <FilterBar
        onSearch={setSearchQuery}
        onFilterChange={(type, value) => console.log('Filter:', type, value)}
      />

      <div className="space-content">
        <CategoriesSidebar
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />

        <main className="content-grid">
          {filteredContent.length > 0 ? (
            filteredContent.map((content) => (
              <ContentCard key={content.id} content={content} />
            ))
          ) : (
            <div className="no-content">
              <p>No content available</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default SpacePage;
