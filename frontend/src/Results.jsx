import React from 'react';

const Results = ({ results, onLogout }) => {
  console.log("Results Data: ", results.map(result => result.voteData)); // Log only voteData

  // Mapping of original vote data to new candidate names
  const nameMapping = {
    'Candidate A': 'BJP',
    'Candidate B': 'Congress',
    'Candidate C': 'Shiv Sena',
  };

  // Count votes for each candidate
  const voteCounts = results.reduce((acc, { voteData }) => {
    const candidateName = nameMapping[voteData] || voteData; // Use mapped name
    acc[candidateName] = (acc[candidateName] || 0) + 1;
    return acc;
  }, {});

  // Find the candidate with the maximum votes
  const maxVotesCandidate = Object.keys(voteCounts).reduce((a, b) =>
    voteCounts[a] > voteCounts[b] ? a : b
  );

  return (
    <div className="container mt-5">
      <div className="card">
        <div className="card-header bg-primary text-white text-center">
          <h2>Voting Results</h2>
        </div>
        <div className="card-body">
          <div className="mb-3">
            <h5>Total Votes for Each Candidate:</h5>
            <ul className="list-group mb-3">
              {Object.entries(voteCounts).map(([candidate, count]) => (
                <li className="list-group-item d-flex justify-content-between align-items-center" key={candidate}>
                  {candidate}
                  <span className="badge bg-info rounded-pill">{count} votes</span>
                </li>
              ))}
            </ul>
            <div className="alert alert-success text-center">
              <strong>{maxVotesCandidate}</strong> has the most votes with <strong>{voteCounts[maxVotesCandidate]}</strong> votes.
            </div>
          </div>
        </div>
        <div className="card-footer text-center">
          <button className="btn btn-danger mt-3" onClick={onLogout}>Logout</button>
        </div>
      </div>
    </div>
  );
};

export default Results;