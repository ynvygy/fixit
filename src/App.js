import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers'; 
import LeafletMap from './components/LeafletMap';
import CreateFixIt from './components/CreateFixIt';
import FixIt from './components/FixIt';
import BasicStats from './components/BasicStats';
import MainPage from './components/MainPage';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { Nav } from 'react-bootstrap';
import fixitContractData from './data/fixit-contract.json';

function App() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [ipfsFixIt, setIpfsFixIt] = useState(null);
  const [ipfsFixItProof, setIpfsFixItProof] = useState(null); 
  const [image, setImage] = useState('')
  const [selectedLocation, setSelectedLocation] = useState(false);
  const [account, setAccount] = useState("");
  const [accounts, setAccounts] = useState([]);
  const [fixitContract, setFixitContract] = useState({});
  const [issues, setIssues] = useState([]);
  const [selectedIssue, setSelectedIssue] = useState({});
  const [comments, setComments] = useState([]);

  const fixitAddress = fixitContractData.contract.address;
  const fixitAbi = fixitContractData.contract.abi;

  const savedWalletAddress = localStorage.getItem("walletAddress");

  useEffect(() => {
    async function loadBlockchainData() {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(provider);

        const signer = provider.getSigner();
        setSigner(signer);

        const networkId = await provider.getNetwork().chainId;
        //const contractInstance = new ethers.Contract(
        //  FixItContract.networks[networkId].address,
        //  FixItContract.abi,
        //  signer
        //);
        //setContract(contractInstance);
      } catch (error) {
        console.error('Error connecting to ethers.js:', error);
      }
    }

    //if (savedWalletAddress) {
    //  setAccount(savedWalletAddress);
    //}

    const initializeContract = async () => {
      if (savedWalletAddress) {
        try {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
          setProvider(provider);
          setSigner(signer);

          window.ethereum.on("accountsChanged", handleAccountsChanged);

          const accounts = await provider.listAccounts();
          setAccounts(accounts);
          setAccount(savedWalletAddress);

          const fixitContract = new ethers.Contract(fixitAddress, fixitAbi, signer);
          setFixitContract(fixitContract);
          console.log(fixitContract, 'contract')
          const getIssues = await fixitContract.getIssues();

          console.log(getIssues);
          setIssues(getIssues.slice(1))
        } catch (error) {
          console.error(error);
        }
      }
    };

    initializeContract();

    loadBlockchainData();
  }, [savedWalletAddress, fixitAddress, fixitAbi]);

  const connectWallet = async () => {
    try {
      if (typeof window.ethereum !== "undefined") {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const provider = new ethers.providers.Web3Provider(
          window.ethereum
        );
        const signer = provider.getSigner();
        setProvider(provider);
        setSigner(signer);
        
        window.ethereum.on("accountsChanged", handleAccountsChanged);

        const accounts = await provider.listAccounts();
        setAccounts(accounts);
        setAccount(accounts[0]);

        const fixitContract = new ethers.Contract(fixitAddress, fixitAbi, signer);
        console.log(fixitContract)
        setFixitContract(fixitContract)
        localStorage.setItem("walletAddress", accounts[0]);
      } else {
        console.log("Please install MetaMask to use this application");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const disconnectHandler = () => {
    localStorage.removeItem("walletAddress");
    setAccount(null);
  };

  const createIssue = async () => {
    try {
      if (fixitContract) {
        const currentTimeUnix = new Date().getTime();
        const currentTimeUnixInSeconds = Math.floor(currentTimeUnix / 1000);
        const tx = await fixitContract.createIssue(title, description, location, JSON.stringify([selectedLocation.lat.toFixed(5), selectedLocation.lng.toFixed(5)]), ipfsFixIt, currentTimeUnixInSeconds);
        await tx.wait();

        window.location.reload()
      }
    } catch (error) {
      console.error('Error creating issue:', error);
    }
  };

  const fixIssue = async () => {
    try {
      if (fixitContract) {
        const tx = await fixitContract.fixIssue(selectedIssue.issueId, ipfsFixItProof);
        await tx.wait();

        window.location.reload()
      }
    } catch (error) {
      console.error('Error fixing issue:', error);
    }
  }
  
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const handleAccountsChanged = (newAccounts) => {
    setAccounts(newAccounts);
    setAccount(newAccounts[0]);
    localStorage.setItem("walletAddress", newAccounts[0]);
  };

  const openSelectedIssue = async (issue) => {
    console.log(issue)
    setSelectedIssue(issue)
    fetchComments()
    const element = document.querySelector(".leaflet-popup");
    element.style.display = "none";
  }

  const fetchComments = async () => {
    try {
      if (selectedIssue.issueId) {
        const comments = await fixitContract.getComments(selectedIssue.issueId);

        setComments(comments);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  return (
    <div className="container mx-auto main-container">
      {!account ? <MainPage connectWallet={connectWallet}/> :
      <div className="row">
        <div className="col-md-8">
          <LeafletMap 
          selectedLocation={selectedLocation} 
          setSelectedLocation={setSelectedLocation} 
          issues={issues}
          openSelectedIssue={openSelectedIssue}
          selectedIssue={selectedIssue}
          setSelectedIssue={setSelectedIssue}/>
        </div>
      
        <div className="col-md-4">
          <div className="brand-container">
            <div className="connected-text">
              <Nav.Link className="nav-link" onClick={disconnectHandler}>
                Stop FixinIt ({account.slice(0, 6) + '...' + account.slice(38, 42)})
              </Nav.Link>
            </div>
          </div>
          <div className="container d-flex justify-content-center align-items-center input-form-container">
            <div className="row">
              <p>{console.log(selectedLocation)}</p>
              {(!selectedLocation && Object.keys(selectedIssue).length === 0) ? <BasicStats issues={issues}/> : 
                (Object.keys(selectedIssue).length > 0 ? <FixIt
                    selectedIssue={selectedIssue} 
                    setSelectedIssue={setSelectedIssue}
                    handleSubmit={handleSubmit}
                    fixIssue={fixIssue}
                    fixitContract={fixitContract}
                    account={account}
                    comments={comments}
                    setComments={setComments}
                    ipfsFixItProof={ipfsFixItProof}
                    setImage={setImage}
                    setIpfsFixItProof={setIpfsFixItProof}
                  /> :
                  <CreateFixIt 
                    handleSubmit={handleSubmit}
                    title={title}
                    setTitle={setTitle}
                    description={description}
                    setDescription={setDescription}
                    setLocation={setLocation}
                    ipfsFixIt={ipfsFixIt}
                    createIssue={createIssue}
                    setImage={setImage}
                    setIpfsFixIt={setIpfsFixIt}
                    setSelectedLocation={setSelectedLocation}
                  />
                )
              }
            </div>
          </div>
        </div>
      </div>}
    </div>

  );
}

export default App;
