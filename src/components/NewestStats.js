import React from 'react';

const NewestStats = ({ title, issues }) => {
  const sortedIssuesByNewest = issues.sort((a, b) => b.creationTimestamp.toNumber() - a.creationTimestamp.toNumber());

  function TimestampToDate(timestamp) {
    const date = new Date(timestamp * 1000);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
  
    const dateString = `${day} / ${month} / ${year}`;
  
    return dateString;
  }

  return (
    <div className="basic-stats">
      <h5>{title}</h5>
      <ul>
        {sortedIssuesByNewest.slice(0,3).map((item) => (
          <li key={item.id} className="list-item">
            <span className="left-text">{item.location}</span>
            <span className="right-text">{TimestampToDate(item.creationTimestamp.toNumber())}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NewestStats;