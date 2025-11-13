import React from 'react';
import './FilterBar.css';

const FilterBar = ({ onSearch, onFilterChange }) => {
  return (
    <div className="filter-bar">
      <div className="filter-left">
        <label className="filter-label">Filter by action:</label>
        <select className="filter-select" onChange={(e) => onFilterChange('action', e.target.value)}>
          <option value="">None</option>
          <option value="recent">Recent</option>
          <option value="popular">Popular</option>
        </select>

        <label className="checkbox-label">
          <input type="checkbox" />
          Filter by shared content
        </label>
      </div>

      <div className="filter-right">
        <input
          type="text"
          placeholder="Type to filter by text"
          className="search-input"
          onChange={(e) => onSearch(e.target.value)}
        />
        <button className="filter-button">Filter by tag</button>
        <select className="sort-select" onChange={(e) => onFilterChange('sort', e.target.value)}>
          <option value="newest">Sort by latest activity: newest first</option>
          <option value="oldest">Sort by latest activity: oldest first</option>
          <option value="popular">Sort by popularity</option>
        </select>
        <span className="page-info">1 2</span>
        <div className="pagination">
          <button className="page-button">&lt;</button>
          <button className="page-button">&gt;</button>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
