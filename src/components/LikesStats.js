import React from 'react';

const LikesStats = ({ title, issues }) => {
  const sortedIssuesByLikes = issues.sort((a, b) => {
    const upvoteComparison = b.upvoteCount.toNumber() - a.upvoteCount.toNumber();
  
    if (upvoteComparison === 0) {
      return a.location.localeCompare(b.location);
    }
  
    return upvoteComparison;
  });

  return (
    <div className="basic-stats">
      <h5>{title}</h5>
      <ul>
        {sortedIssuesByLikes.slice(0,3).map((item) => (
          <li key={item.id} className="list-item">
            <span className="left-text">{item.location}</span>
            <span className="right-text">{item.upvoteCount.toNumber()}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LikesStats;