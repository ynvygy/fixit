import React, { useEffect, useState } from 'react';

const FixIt = ({handleSubmit, uploadFixProofToIPFS, fixIssue, fixitContract, selectedIssue, setSelectedIssue, account, comments, setComments, ipfsFixItProof}) => {
  const [newComment, setNewComment] = useState('');
  const [showForm, setShowForm] = useState(false);

  const handleCommentAddition = async () => {
    if (!newComment) {
      alert('Please enter a comment.');
      return;
    }
    const currentTime = new Date();
    const unixTimestamp = Math.floor(currentTime / 1000);
    try {
      await fixitContract.addComment(selectedIssue.issueId, newComment, unixTimestamp);
  
      setComments(prevComments => [
        ...prevComments,
        { text: newComment, commenter: account, timestamp: unixTimestamp },
      ]);
  
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment to the blockchain:', error);
    }
  };

  const handleLike = async () => {
    try {
      await fixitContract.upVote(selectedIssue.issueId);
      setNewComment('');

      setSelectedIssue(prevIssue => ({
        ...prevIssue,
        upvotes: prevIssue.upvotes + 1,
      }));
      
    } catch (error) {
      console.error('Error adding like to the blockchain:', error);
    }
  };

  const handleFixIt = async () => {
    setShowForm(!showForm);
  }

  const handleClose = async () => {
    setSelectedIssue({})
  }

  return(
    <>
      <div className="close-container">
        <button onClick={handleClose} className="close-button">
          <i class="fa fa-window-close"></i>Close
        </button>
      </div>
      <img src={selectedIssue.issueLink} alt="Issue" />
      <div className="likes-container">
        <div className="likes-text">
          <i className="fa-solid fa-heart"></i>{selectedIssue.upvotes}
        </div>
        <button onClick={handleLike} className="like-button">
          <i className="fa fa-thumbs-up"></i> Like
        </button>
        <button onClick={handleFixIt} className="fixit-button">
          <i className="fa-solid fa-wrench"></i>FixIt
        </button>
      </div>
      <p>{selectedIssue.description}</p>
      {showForm && (
        <form onSubmit={handleSubmit} className="form">
          <div className="mb-3">
            <label>Upload Image:</label>
            <input
              type="file"
              accept="image/*"
              onChange={uploadFixProofToIPFS}
              className="form-control"
            />
          </div>
          <div className="uploaded-file">
            <img src={ipfsFixItProof} />
          </div>
          <button type="submit" className="btn btn-primary input-form-margin-left-33 clickable margin-top" onClick={fixIssue}>Fix Issue</button>
        </form>
      )}
      <ul>
        {comments.map((comment, index) => (
          <li key={index}><p>{comment.text}</p><p className="by-text">by {comment.commenter}</p></li> 
        ))}
      </ul>
      <div className="row add-comment-container">
        <input
          type="text"
          className="add-comment-text"
          placeholder="Add a new comment"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button onClick={handleCommentAddition} className="clickable add-comment">
          Add comment
        </button>
      </div>
    </>
  )
}

export default FixIt;