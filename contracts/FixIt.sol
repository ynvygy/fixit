// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

contract FixIt {
    struct Issue {
        uint256 issueId;
        address creator;
        string title;
        string description;
        string location;
        string coordinates;
        bool isResolved;
        string ipfsFixIt;
        uint256 creationTimestamp;
        uint256 upvoteCount;
        //uint256 downvoteCount;
        string ipfsFixProof;
        //uint256 fixedTimestamp;
    }

    struct Comment {
        string text;
        address commenter;
        uint256 timestamp;
    }

    mapping(uint256 => Issue) public issues;
    mapping(uint256 => Comment[]) public issueComments;

    uint256 public issueCounter;

    event IssueCreated(
        uint256 indexed issueId,
        address indexed creator,
        string title
    );

    event IssueFixed(uint256 indexed issueId, address indexed fixer);

    function createIssue(
        string memory _title,
        string memory _description,
        string memory _location,
        string memory _coordinates,
        string memory _ipfsFixIt,
        uint256 _timestamp
    ) external {
        issueCounter++;
        issues[issueCounter] = Issue({
            issueId: issueCounter,
            creator: msg.sender,
            title: _title,
            description: _description,
            location: _location,
            coordinates: _coordinates,
            isResolved: false,
            ipfsFixIt: _ipfsFixIt,
            creationTimestamp: _timestamp,
            upvoteCount: 0,
            //downvoteCount: 0,
            ipfsFixProof: ""
            //fixedTimestamp: 0
        });
        emit IssueCreated(issueCounter, msg.sender, _title);
    }

    function fixIssue(uint256 _issueId, string memory _ipfsFixProof) external {
        Issue storage issue = issues[_issueId];
        issue.ipfsFixProof = _ipfsFixProof;
        issue.isResolved = true;

        emit IssueFixed(_issueId, msg.sender);
    }

    function markAsResolved(uint256 _issueId) external {
        issues[_issueId].isResolved = true;
    }

    function upVote(uint256 _issueId) external {
        Issue storage issue = issues[_issueId];
        issue.upvoteCount += 1;
    }

    //function downVote(uint256 _issueId) external {
    //    Issue storage issue = issues[_issueId];
    //    issue.downvoteCount += 1;
    //}

    function getIssues() public view returns (Issue[] memory) {
        Issue[] memory allIssues = new Issue[](issueCounter);

        for (uint256 i = 0; i < issueCounter; i++) {
            allIssues[i] = issues[i];
        }

        return allIssues;
    }

    function addComment(
        uint256 _issueId,
        string memory _text,
        uint256 _timestamp
    ) public {
        Comment memory newComment = Comment({
            text: _text,
            commenter: msg.sender,
            timestamp: _timestamp
        });

        issueComments[_issueId].push(newComment);
    }

    function getComments(
        uint256 _issueId
    ) public view returns (Comment[] memory) {
        return issueComments[_issueId];
    }
}
