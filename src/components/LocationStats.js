import React from 'react';

const LocationStats = ({ title, issues }) => {
  const countLocations = (issues) => {
    const locationCounts = {};

    issues.forEach((issue) => {
      console.log(issue.location)
      const location = issue.location;
      if (locationCounts[location]) {
        locationCounts[location]++;
      } else {
        locationCounts[location] = 1;
      }
    });

    return locationCounts;
  };

  const locationCounts = countLocations(issues);

  const sortedLocations = Object.keys(locationCounts).sort(
    (a, b) => locationCounts[b] - locationCounts[a]
  );

  return (
    <div className="basic-stats">
      <h5>{title}</h5>
      <ul>
        {sortedLocations.slice(0,3).map((item) => (
          <li key={item.id} className="list-item">
            <span className="left-text">{item}</span>
            <span className="right-text">{locationCounts[item]}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LocationStats;