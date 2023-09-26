import React, { useEffect, useState } from 'react';
import { Buffer } from 'buffer';
import { create } from 'ipfs-http-client'
import { InfinitySpin } from 'react-loader-spinner';

const FixIt = ({handleSubmit, fixIssue, fixitContract, selectedIssue, setSelectedIssue, account, comments, setComments, ipfsFixItProof, setImage, setIpfsFixItProof}) => {
  const [newComment, setNewComment] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const projectId = process.env.REACT_APP_INFURA_API_KEY
  const projectSecret = process.env.REACT_APP_INFURA_API_SECRET
  const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');
  const client = create({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
    apiPath: '/api/v0',
    headers: {
      authorization: auth,
    }
  })

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

  const uploadFixProofToIPFS = async (event) => {
    setLoading(true)
    event.preventDefault()
    const file = event.target.files[0]
    if (typeof file !== 'undefined') {
      try {
        const result = await client.add(file)
        console.log(result)
        setImage(`https://ipfs.io/ipfs/${result.path}?filename=${file.name}`)
        setIpfsFixItProof(`https://ipfs.io/ipfs/${result.path}?filename=${file.name}`)
        //setImage(`https://ipfs.infura.io/ipfs/testme`)
        //setIpfsFixIt(`https://ipfs.infura.io/ipfs/testme`)
      } catch (error){
        console.log("ipfs image upload error: ", error)
      }
    }
    setTimeout(() => {
      setLoading(false);
    }, 5000);
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
          {loading ? (
            <div className="loading-container">
              <InfinitySpin 
                width='200'
                color="#4fa94d"
              />
            </div>
          ) : (
          <div className="uploaded-file">
            <img src={ipfsFixItProof} />
          </div>
          )}
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