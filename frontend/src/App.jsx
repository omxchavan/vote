import React, { useState } from 'react';
import axios from 'axios';
import Admin from './Admin'; // Import the Admin component
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import './App.css'; // Custom CSS file

// Import your candidate images (Ensure the paths are correct)
import candidateA from './assets/modi.jpg'; // Replace with actual image paths
import candidateB from './assets/modi.jpg'; // Replace with actual image paths
import candidateC from './assets/modi.jpg'; // Replace with actual image paths

function App() {
  const [voterID, setVoterID] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState(null); // Change candidate state to hold selected candidate
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Function to cast a vote
  const castVote = async () => {
    if (!voterID || !selectedCandidate) {
      setMessage('Please enter a valid Voter ID and select a candidate.');
      return;
    }

    setLoading(true); // Set loading when API call starts
    try {
      const response = await axios.post('http://localhost:3000/vote', { voterID, candidate: selectedCandidate });
      setMessage(response.data.message);
      setSelectedCandidate(null); // Reset selected candidate after voting
    } catch (error) {
      console.error("Error casting vote:", error);
      setMessage("Error casting vote.");
    } finally {
      setLoading(false); // Stop loading once API call is done
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center">Rocket Voting System</h1>

      {!isAdmin ? (
        <>
          {/* Input for Voter ID */}
          <div className="form-group">
            <label>Voter ID:</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter Voter ID"
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
                <img src={candidateA} className="card-img-top" alt="Candidate A" />
                <div className="card-body">
                  <h5 className="card-title">Naru Modi</h5> {/* Update with actual candidate name */}
                  <p className="card-text">Description for Naru Modi.</p>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div 
                className={`card ${selectedCandidate === 'B' ? 'border-success' : ''}`} 
                onClick={() => setSelectedCandidate('B')} 
                style={{ cursor: 'pointer' }}
              >
                <img src={candidateB} className="card-img-top" alt="Candidate B" />
                <div className="card-body">
                  <h5 className="card-title">Thala</h5> {/* Update with actual candidate name */}
                  <p className="card-text">Description for Thala.</p>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div 
                className={`card ${selectedCandidate === 'C' ? 'border-success' : ''}`} 
                onClick={() => setSelectedCandidate('C')} 
                style={{ cursor: 'pointer' }}
              >
                <img src={candidateC} className="card-img-top" alt="Candidate C" />
                <div className="card-body">
                  <h5 className="card-title">Captain Jagdale</h5> {/* Update with actual candidate name */}
                  <p className="card-text">Description for Candidate C.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Button to submit the vote */}
          <button className="btn btn-success mt-3" onClick={castVote} disabled={loading || !selectedCandidate}>
            {loading ? "Casting Vote..." : "Cast Vote"}
          </button>

          {/* Message to display voting status */}
          {message && <p className="text-danger mt-3">{message}</p>}

          {/* Admin Login Button */}
          <button className="btn btn-secondary mt-3" onClick={() => setIsAdmin(true)}>
            Admin Login
          </button>
        </>
      ) : (
        <Admin setIsAdmin={setIsAdmin} />
      )}
    </div>
  );
}

export default App;
