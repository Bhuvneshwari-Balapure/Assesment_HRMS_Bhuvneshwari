import React from 'react';
import './css/FeedScroll.css';

const FeedScroll = () => {
  const feedsData = [
    {
      title: 'Q3 GROWTH REPORT',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    },
    {
      title: 'TEAM ACHIEVEMENTS',
      content: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    },
    {
      title: 'NEW PROJECT LAUNCH',
      content: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
    },
    {
      title: 'EMPLOYEE OF THE MONTH',
      content: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    },
    {
      title: 'Q4 STRATEGIC PLANNING',
      content: 'Egestas sed sed risus pretium quam. Sollicitudin ac orci phasellus egestas tellus rutrum. Est lorem ipsum dolor sit amet.',
    },
    {
      title: 'CLIENT FEEDBACK ANALYSIS',
      content: 'Felis eget nunc lobortis mattis aliquam. Scelerisque in dictum non consectetur a. Porttitor massa id neque aliquam vestibulum.',
    },
    {
      title: 'ANNUAL HR REVIEW',
      content: 'Velit egestas volutpat diam ut. Nec ullamcorper sit amet risus nullam eget felis eget. Nunc sed id semper risus in hendrerit.',
    },
    {
      title: 'TRAINING & DEVELOPMENT',
      content: 'Et malesuada fames ac turpis. Aliquam id diam maecenas ultricies. Volutpat ac tincidunt vitae semper quis lectus nulla at.',
    },
  ];

  return (
    <div className="feed-container">
      <h2>Latest Insights</h2>
      <div className="feed-wrapper">
        <div className="feed-track">
          {feedsData.map((feed, index) => (
            <div key={index} className="feed-item">
              <h3>{feed.title}</h3>
              <p>{feed.content}</p>
            </div>
          ))}
          {feedsData.map((feed, index) => (
            <div key={index + feedsData.length} className="feed-item">
              <h3>{feed.title}</h3>
              <p>{feed.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeedScroll;