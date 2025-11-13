import React from 'react';
import './CategoriesSidebar.css';

const CategoriesSidebar = ({ categories, activeCategory, onCategoryChange }) => {
  const defaultCategories = [
    { id: 'all', name: 'All', icon: '📁', color: '#ff9800' },
    { id: 'purpose', name: 'Purpose', icon: '🎯', color: '#ff9800' },
    { id: 'socialimpact', name: '#socialimpact', icon: '🌍', color: '#ff9800' },
    { id: 'karins-diary', name: "Karin's 100 Day Diary", icon: '📔', color: '#ff9800' },
    { id: 'karins-updates', name: "Karin's Updates", icon: '📰', color: '#ff9800' },
    { id: 'karin-meets', name: 'Karin meets', icon: '🤝', color: '#ff9800' }
  ];

  const displayCategories = categories?.length > 0 ? categories : defaultCategories;

  return (
    <aside className="categories-sidebar">
      <h3 className="sidebar-title">Categories</h3>
      <ul className="categories-list">
        {displayCategories.map(category => (
          <li
            key={category.id}
            className={`category-item ${activeCategory === category.id ? 'active' : ''}`}
            onClick={() => onCategoryChange(category.id)}
          >
            <span className="category-icon" style={{ color: category.color }}>
              {category.icon}
            </span>
            <span className="category-name">{category.name}</span>
          </li>
        ))}
      </ul>

      <div className="sidebar-footer">
        <a href="#" className="blog-link">View the blog</a>
      </div>
    </aside>
  );
};

export default CategoriesSidebar;
