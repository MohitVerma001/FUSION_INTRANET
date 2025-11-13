import React from 'react';
import './ContentCard.css';

const ContentCard = ({ content }) => {
  const getContentTypeIcon = () => {
    const type = content.content_type || content.type;
    switch (type) {
      case 'post':
      case 'blog':
        return '📝';
      case 'document':
        return '📄';
      case 'poll':
        return '📊';
      case 'event':
        return '📅';
      case 'video':
        return '🎥';
      default:
        return '📄';
    }
  };

  const extractTextFromHTML = (html) => {
    if (!html) return '';
    const text = html.replace(/<[^>]*>/g, '');
    return text.substring(0, 200) + (text.length > 200 ? '...' : '');
  };

  const getContentText = () => {
    if (content.content_body?.text) {
      return extractTextFromHTML(content.content_body.text);
    }
    if (content.content?.text) {
      return extractTextFromHTML(content.content.text);
    }
    if (content.poll_description) {
      return content.poll_description;
    }
    if (content.description) {
      return content.description;
    }
    return 'No description available';
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getThumbnail = () => {
    if (content.content_images && content.content_images.length > 0) {
      return content.content_images[0].ref;
    }
    return null;
  };

  return (
    <div className="content-card">
      <div className="card-header">
        <span className="content-type-badge">
          <span className="type-icon">{getContentTypeIcon()}</span>
          {content.content_type || content.type}
        </span>
      </div>

      {getThumbnail() && (
        <div className="card-thumbnail">
          <img src={getThumbnail()} alt={content.subject} />
        </div>
      )}

      <div className="card-body">
        <h3 className="card-title">{content.subject || content.poll_question || content.question || content.title}</h3>
        <p className="card-excerpt">{getContentText()}</p>

        {content.author && (
          <div className="card-author">
            <span className="author-name">{content.author.displayName}</span>
            {content.author.jive?.username && (
              <span className="author-username">@{content.author.jive.username}</span>
            )}
          </div>
        )}

        <div className="card-footer">
          <div className="card-meta">
            <span className="meta-item">
              👁 {content.view_count || content.viewCount || 0}
            </span>
            <span className="meta-item">
              ❤️ {content.like_count || content.likeCount || 0}
            </span>
            {content.tags && content.tags.length > 0 && (
              <span className="meta-item">
                🏷 {content.tags.length}
              </span>
            )}
          </div>
          <div className="card-date">
            {formatDate(content.published || content.start_date)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentCard;
