import React from 'react';
import NewestStats from './NewestStats';
import LocationStats from './LocationStats';
import LikesStats from './LikesStats';
import FixesStats from './FixesStats'

const BasicStats = ({issues}) => {
  const resolvedIssueCount = issues.reduce((count, issue) => {
    if (issue.isResolved === true) {
      return count + 1;
    }
    return count;
  }, 0);
  
  return (
    <div>
      <h5 className="basic-stats">Issues Created: {issues.length}</h5>
      <h5 className="basic-stats">Issues Fixed: {resolvedIssueCount}</h5>
      <LocationStats title="Top Locations by Reports" issues={issues} />
      <LikesStats title="Top Locations by Likes" issues={issues} />
      <FixesStats title="Top Locations by Fixes" issues={issues} />
      <NewestStats title="Newest Reports" issues={issues} />
    </div>
  );
}

export default BasicStats;