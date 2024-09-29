import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import { create } from 'ipfs-http-client'; 
import { Buffer } from 'buffer'; 
import './App.css'; 
import logo from './logo.png'; 
import storageImage from './dec.jpeg'; 

const providerUrl = "http://127.0.0.1:8545";
const web3 = new Web3(new Web3.providers.HttpProvider(providerUrl));

const contractABI = [
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "userAddress",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "name",
                "type": "string"
            }
        ],
        "name": "UserRegistered",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "userAddress",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "name",
                "type": "string"
            }
        ],
        "name": "UserUpdated",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_name",
                "type": "string"
            }
        ],
        "name": "registerUser",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_name",
                "type": "string"
            }
        ],
        "name": "updateUser",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_userAddress",
                "type": "address"
            }
        ],
        "name": "getUser",
        "outputs": [
            {
                "internalType": "string",
                "name": "name",
                "type": "string"
            },
            {
                "internalType": "address",
                "name": "userAddress",
                "type": "address"
            },
            {
                "internalType": "bool",
                "name": "isRegistered",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": 'getAllUsers',
        'outputs': [
            {
              'internalType': 'address[]',
              'name': '',
              'type': 'address[]'
            }
          ],
          'stateMutability': 'view',
          'type': 'function'
    }
];
const contractAddress = '0x3041Cf8de9551D7E9432b7C4d7E911BCaC891A0B'; 

const projectId = '6f36ec5e2f4b4b66977ea799d16fd3e2';
const projectSecret = '32UTaHq6j+ou4q7HpnZm82QMea0vQYvO+SaWLSUal0/JtrOBQSMNEQ';


const auth = 'Basic ' + Buffer.from(`${projectId}:${projectSecret}`).toString('base64');
const ipfs = create({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
    headers: { authorization: auth },
});

function App() {
    const [file, setFile] = useState(null);
    const [fileHash, setFileHash] = useState('');
    const [downloadHash, setDownloadHash] = useState('');
    const [account, setAccount] = useState('');
    const [username, setUsername] = useState('');
    const [feedback, setFeedback] = useState('');
    const [contactSubmitted, setContactSubmitted] = useState(false);

    useEffect(() => {
        const loadAccount = async () => {
            const accounts = await web3.eth.getAccounts();
            if (accounts.length > 0) {
                setAccount(accounts[0]);
            } else {
                alert('Please connect your wallet.');
            }
        };
        loadAccount();
    }, []);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) {
            alert("Please select a file");
            return;
        }

        try {
            const addedFile = await ipfs.add(file);
            setFileHash(addedFile.path);
            alert(`File uploaded successfully! Hash: ${addedFile.path}`);
        } catch (error) {
            console.error("Error uploading file to IPFS:", error);
            alert("File upload failed!");
        }
    };

    const handleDownload = async () => {
        if (!fileHash) {
            alert("Please enter a valid file hash.");
            return;
        }
        const link = `https://ipfs.infura.io/ipfs/${fileHash}`;
        window.open(link, '_blank');
    };

    const handleDownloadFile = async () => {
        if (!downloadHash) {
            alert("Please enter a valid hash to download.");
            return;
        }
        const link = `https://ipfs.infura.io/ipfs/${downloadHash}`;
        window.open(link, '_blank');
    };

    const handleSubmitFeedback = (event) => {
        event.preventDefault();
        alert(`Feedback submitted: ${feedback}`);
        setContactSubmitted(true);
        setFeedback('');
    };

    return (
        <div className="app-container">
            <header className="app-header">
                <nav className="navbar">
                    <img src={logo} alt="Logo" className="app-logo" />
                    <ul className="nav-links">
                        <li><a href="#home">Home</a></li>
                        <li><a href="#upload">Upload</a></li>
                        <li><a href="#info">About Us</a></li>
                        <li><a href="#download">Download</a></li>
                        <li><a href="#contact">Contact Us</a></li>
                    </ul>
                </nav>
            </header>

            <main className="app-main">
                <section id="upload" className="upload-section">
                    <h2>Upload Your Files</h2>
                    <div className="upload-card">
                        <input type="file" onChange={handleFileChange} className="file-input" />
                        <button onClick={handleUpload} className="upload-btn">Upload File</button>
                    </div>
                    {fileHash && (
                        <div className="file-hash">
                            <p>File Hash: {fileHash}</p>
                            <button onClick={handleDownload} className="download-btn">Download File</button>
                        </div>
                    )}
                </section>

                <section id="info" className="info-section">
                    <h2>About Decentralized Cloud Storage</h2>
                    <div className="info-card">
                        <img src={storageImage} alt="Decentralized Storage" className="info-image" />
                        <p>
                            Decentralized cloud storage allows users to store their files on a distributed network,
                            enhancing security and privacy. It eliminates the need for central authorities and 
                            empowers users with greater control over their data.
                        </p>
                    </div>
                </section>

                <section id="download" className="download-section">
                    <h2>Download Files by Hash</h2>
                    <div className="download-card">
                        <input
                            type="text"
                            placeholder="Enter file hash (CID)"
                            value={downloadHash}
                            onChange={(e) => setDownloadHash(e.target.value)}
                            className="hash-input"
                        />
                        <button onClick={handleDownloadFile} className="download-btn">Download File</button>
                    </div>
                </section>

                <section id="contact" className="contact-section">
                    <h2>Give Us Your Feedback</h2>
                    <form onSubmit={handleSubmitFeedback} className="feedback-form">
                        <label>Your Feedback:</label>
                        <textarea 
                            value={feedback} 
                            onChange={(e) => setFeedback(e.target.value)} 
                            placeholder="We'd love to hear from you!" 
                            required 
                            className="feedback-text"
                        />
                        <button type="submit" className="submit-btn">Submit Feedback</button>
                    </form>
                    {contactSubmitted && <p className="feedback-success">Thank you for your feedback!</p>}
                </section>
            </main>

            <footer className="app-footer">
                <p>&copy; 2024 Your Company Name. All rights reserved.</p>
            </footer>
        </div>
    );
}

export default App;
