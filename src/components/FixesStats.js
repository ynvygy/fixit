import React from 'react';

const FixesStats = ({ title, issues }) => {
  const groupedData = issues.reduce((acc, item) => {
    const location = item.location;
    if (!acc[location]) {
      acc[location] = [];
    }
    acc[location].push(item);
    return acc;
  }, {});

  const locationCounts = Object.keys(groupedData).map((location) => ({
    location,
    count: groupedData[location].filter((item) => item.isResolved === true).length,
  }));

  locationCounts.sort((a, b) => b.count - a.count);

  return (
    <div className="basic-stats">
      <h5>{title}</h5>
      <ul>
        {locationCounts.slice(0,3).map((item, index) => (
          <li key={item.id} className="list-item">
            <span className="left-text">{item.location}</span>
            <span className="right-text">{item.count}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FixesStats;