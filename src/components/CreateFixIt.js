import React, { useState } from 'react';
import { Buffer } from 'buffer';
import { Web3Storage } from 'web3.storage';
import { File, NFTStorage } from 'nft.storage';
import { create } from 'ipfs-http-client'
import { InfinitySpin } from 'react-loader-spinner';

const CreateFixIt = ({handleSubmit, title, setTitle, description, setDescription, location, setLocation, ipfsFixIt, createIssue, setImage, setIpfsFixIt, setSelectedLocation}) => {
  const [showOptions, setShowOptions] = useState(false);
  const [selectedOption, setSelectedOption] = useState(0);
  const [loading, setLoading] = useState(false);
  const options = ['NFT.storage (default)', 'Web3.storage', 'IPFS (using Infura)'];

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

  const toggleOptions = () => {
    setShowOptions(!showOptions);
  };

  const handleOptionChange = (option) => {
    setSelectedOption(option);
  };

  const handleUpload = (event) => {
    setLoading(true)
    if (selectedOption == 0) {
      handleNftStorageUpload(event)
    } else if (selectedOption == 1) {
      handleWebStorageUpload(event)
    } else {
      uploadToIPFS(event);
    }
    setTimeout(() => {
      setLoading(false);
    }, 5000);
  }

  const uploadToIPFS = async (event) => {
    event.preventDefault()
    const file = event.target.files[0]
    if (typeof file !== 'undefined') {
      try {
        const result = await client.add(file)
        console.log(result)
        setImage(`https://ipfs.io/ipfs/${result.path}?filename=${file.name}`)
        setIpfsFixIt(`https://ipfs.io/ipfs/${result.path}?filename=${file.name}`)
        //setImage(`https://ipfs.infura.io/ipfs/testme`)
        //setIpfsFixIt(`https://ipfs.infura.io/ipfs/testme`)
      } catch (error){
        console.log("ipfs image upload error: ", error)
      }
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
          <i className="fa fa-window-close"></i>Close
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

      {loading ? (
        <div className="loading-container">
          <InfinitySpin 
            width='200'
            color="#4fa94d"
          />
        </div>
      ) : (
        <div className="uploaded-file">
          <img src={ipfsFixIt} />
        </div>
      )}

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