import React from 'react';
import './ContentTabs.css';

const ContentTabs = ({ activeTab, onTabChange, contentCounts }) => {
  const tabs = [
    { id: 'all', label: `All Content (${contentCounts.total || 0})`, icon: '📄' },
    { id: 'blogs', label: `Blog Posts (${contentCounts.blogs || 0})`, icon: '📝' },
    { id: 'documents', label: `Documents (${contentCounts.documents || 0})`, icon: '📄' },
    { id: 'discussions', label: `Discussions (${contentCounts.discussions || 0})`, icon: '💬' },
    { id: 'polls', label: `Polls (${contentCounts.polls || 0})`, icon: '📊' },
    { id: 'videos', label: `Videos (${contentCounts.videos || 0})`, icon: '🎥' },
    { id: 'events', label: `Events (${contentCounts.events || 0})`, icon: '📅' }
  ];

  return (
    <div className="content-tabs">
      <div className="tabs-left">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => onTabChange(tab.id)}
          >
            <span className="tab-icon">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>
      <div className="tabs-right">
        <button className="view-toggle active" title="Grid view">
          <span>⊞</span>
        </button>
        <button className="view-toggle" title="List view">
          <span>☰</span>
        </button>
      </div>
    </div>
  );
};

export default ContentTabs;
