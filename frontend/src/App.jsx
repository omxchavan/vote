import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import axios from 'axios';
import Admin from './Admin'; // Import the Admin component
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import './App.css'; // Custom CSS file
import 'animate.css';


// Import your candidate images
import candidateA from './assets/modi.png'; // Image for BJP
import candidateB from './assets/cong.png'; // Image for Congress (replace with actual image path)
import candidateC from './assets/shiv.png'; // Image for Shiv Sena (replace with actual image path)
import BlockchainCards from './BlockchainCards'; // Import BlockchainCards component

function App() {
  const [voterID, setVoterID] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [blockchain, setBlockchain] = useState([]); // State to hold blockchain data

  // Mapping of candidate IDs to their names
  const candidateMapping = {
    'A': 'BJP',
    'B': 'Congress',
    'C': 'Shiv Sena',
  };

  // Function to fetch blockchain data from the server
  const fetchBlockchain = async () => {
    try {
      const response = await axios.get('http://localhost:3000/blockchain');
      setBlockchain(response.data); // Update blockchain state with the response
    } catch (error) {
      console.error("Error fetching blockchain data:", error);
    }
  };

  // Function to cast a vote
  const castVote = async () => {
    if (!voterID || !selectedCandidate) {
      setMessage('Please enter a valid Voter ID and select a candidate.');
      return;
    }

    setLoading(true); // Set loading when API call starts
    try {
      const candidateName = candidateMapping[selectedCandidate]; // Get the candidate name from the mapping

      const response = await axios.post('http://localhost:3000/vote', { voterID, candidate: candidateName });
      setMessage(response.data.message);
      setSelectedCandidate(null); // Reset selected candidate after voting

      // Fetch the updated blockchain after a successful vote
      await fetchBlockchain();

    } catch (error) {
      console.error("Error casting vote:", error);
      setMessage("Error casting vote.");
    } finally {
      setLoading(false); // Stop loading once API call is done
    }
  };

  // Fetch the blockchain data on component mount
  useEffect(() => {
    fetchBlockchain();
  }, []);

  return (
    <Router>
      <div className="container mt-5">
        <h1 className="text-center">Blockchain Voting System</h1>

        <Routes>
          <Route path="/" element={
            !isAdmin ? (
              <>
                {/* Input for Voter ID */}
                <div className="form-group">
                  <label>Token:</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter token"
                    value={voterID}
                    onChange={(e) => setVoterID(e.target.value)}
                  />
                </div>

                {/* Cards for candidates */}
                <div className="row">
                  <div className="col-md-4">
                    <div 
                      className={`card ${selectedCandidate === 'A' ? 'border-success' : ''}`} 
                      onClick={() => setSelectedCandidate('A')} 
                      style={{ cursor: 'pointer' }}
                    >
                      <img src={candidateA} className="card-img-top" alt="BJP" />
                      <div className="card-body">
                        <h5 className="card-title">BJP</h5> 
                        <p className="card-text">Description for BJP.</p>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div 
                      className={`card ${selectedCandidate === 'B' ? 'border-success' : ''}`} 
                      onClick={() => setSelectedCandidate('B')} 
                      style={{ cursor: 'pointer' }}
                    >
                      <img src={candidateB} className="card-img-top" alt="Congress" />
                      <div className="card-body">
                        <h5 className="card-title">Congress</h5> 
                        <p className="card-text">Description for Congress.</p>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div 
                      className={`card ${selectedCandidate === 'C' ? 'border-success' : ''}`} 
                      onClick={() => setSelectedCandidate('C')} 
                      style={{ cursor: 'pointer' }}
                    >
                      <img src={candidateC} className="card-img-top" alt="Shiv Sena" />
                      <div className="card-body">
                        <h5 className="card-title">Shiv Sena</h5> 
                        <p className="card-text">Description for Shiv Sena.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Button to submit the vote */}
                <button className="btn btn-primary mt-3" onClick={castVote} disabled={loading || !selectedCandidate}>
                  {loading ? "Casting Vote..." : "Cast Vote"}
                </button>

                {/* Message to display voting status */}
                {message && <p className="text-danger mt-3">{message}</p>}

                {/* Admin Login Button */}
                <button className="btn btn-primary mt-3" onClick={() => setIsAdmin(true)}>
                  Admin Login
                </button>

                {/* Link to Blockchain Cards Page */}
                <Link to="/blockchain" className="btn btn-secondary mt-3">
                  Go to Blockchain 
                </Link>
              </>
            ) : (
              <Admin setIsAdmin={setIsAdmin} />
            )
          } />
          
          <Route path="/blockchain" element={<BlockchainCards blockchain={blockchain} />} /> {/* Blockchain Cards Page */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;