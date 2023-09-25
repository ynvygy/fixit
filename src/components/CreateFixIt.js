import React, { useState } from 'react';
import { Web3Storage } from 'web3.storage';
import { File, NFTStorage } from 'nft.storage';

const CreateFixIt = ({handleSubmit, title, setTitle, description, setDescription, location, setLocation, uploadToIPFS, ipfsFixIt, createIssue, setImage, setIpfsFixIt, setSelectedLocation}) => {
  const [showOptions, setShowOptions] = useState(false);
  const [selectedOption, setSelectedOption] = useState(0);
  const options = ['NFT.storage (default)', 'Web3.storage', 'IPFS (using Infura)'];

  const toggleOptions = () => {
    setShowOptions(!showOptions);
  };

  const handleOptionChange = (option) => {
    setSelectedOption(option);
  };

  const handleUpload = (event) => {
    if (selectedOption == 0) {
      handleNftStorageUpload(event)
    } else if (selectedOption == 1) {
      handleWebStorageUpload(event)
    } else {
      uploadToIPFS(event);
    }
  }

  const handleWebStorageUpload = async (event) => {
    event.preventDefault()
    const file = event.target.files[0]
    if (typeof file !== 'undefined') {
      const web3StorageClient = new Web3Storage({ token: process.env.REACT_APP_WEB3_STORAGE_KEY });
      try {
        const result = await web3StorageClient.put([file]);
        console.log(result)
        //setImage(`https://ipfs.infura.io/ipfs/testme`)
        //setIpfsFixIt(result)
        setImage(`https://${result}.ipfs.w3s.link/${file.name}`)
        setIpfsFixIt(`https://${result}.ipfs.w3s.link/${file.name}`)
      } catch (error){
        console.log("ipfs image upload error: ", error)
      }
    }
  }

  const handleNftStorageUpload = async (event) => {
    event.preventDefault()
    const file = event.target.files[0]
    if (typeof file !== 'undefined') {
      const nftStorageClient = new NFTStorage({ token: process.env.REACT_APP_NFT_STORAGE_KEY });
      try {
        const nftFile = new File([file], file.name);
        const result = await nftStorageClient.storeBlob(nftFile);
        setImage(`https://${result}.ipfs.nftstorage.link`)
        setIpfsFixIt(`https://${result}.ipfs.nftstorage.link`)
      } catch (error){
        console.log("ipfs image upload error: ", error)
      }
    }
  }

  const handleClose = async () => {
    setSelectedLocation(false)
  }
  
  return(
    <form onSubmit={handleSubmit} className="form">

      <div className="close-container">
        <button onClick={handleClose} className="close-button">
          <i class="fa fa-window-close"></i>Close
        </button>
      </div>
      <h2 className="mb-4 input-form-margin-left-40">FixIt</h2>
      <div className="mb-3">
        <label htmlFor="title" className="form-label">Title:</label>
        <input
          type="text"
          id="title"
          className="form-control"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <label htmlFor="description" className="form-label">Description:</label>
        <textarea
          id="description"
          className="form-control"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <label htmlFor="location" className="form-label">Location:</label>
        <input
          type="text"
          id="location"
          className="form-control"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label>Upload Image:</label>
        <input
          type="file"
          accept="image/*"
          onChange={(event) => handleUpload(event)}
          className="form-control"
        />
      </div>

      <div className="uploaded-file">
        <img src={ipfsFixIt} />
      </div>
    
      <button className="btn btn-block advanced-button dropdown-toggle" onClick={toggleOptions}>Advanced</button>
      {showOptions && (
        <>
        <p>Choose your preferred storage provider</p>
          <ul>
            {options.map((option, index) => (
              <li key={index}>
                <label>
                  <input
                    type="radio"
                    value={option}
                    checked={options[selectedOption] === option}
                    onChange={() => handleOptionChange(index)}
                    className="radio-setup"
                  />
                  {option}
                </label>
              </li>
            ))}
          </ul>
        </>
      )}

      <button type="submit" className="btn btn-primary input-form-margin-left-33 clickable" onClick={createIssue}>Create Issue</button>
    </form>
  )
}

export default CreateFixIt;