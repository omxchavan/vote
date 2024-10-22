import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Results = ({ results, onLogout }) => {
  const [maxVotesCandidate, setMaxVotesCandidate] = useState("");
  const [maxVotes, setMaxVotes] = useState(0);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await axios.get('http://localhost:3000/results');
        const { BJP, Congress, 'Shiv Sena': shivsena } = response.data;

        // Prepare an array of candidates and votes
        const candidates = [
          { name: 'BJP', votes: BJP },
          { name: 'Congress', votes: Congress },
          { name: 'Shiv Sena', votes: shivsena }
        ];

        // Find the candidate with the maximum votes
        const maxCandidate = candidates.reduce((max, candidate) => {
          return candidate.votes > max.votes ? candidate : max;
        }, { name: 'Tie', votes: 0 });

        // Check if there's a tie by counting how many candidates have the max votes
        const isTie = candidates.filter(c => c.votes === maxCandidate.votes).length > 1;

        setMaxVotesCandidate(isTie ? 'Tie' : maxCandidate.name);
        setMaxVotes(isTie ? 0 : maxCandidate.votes);
      } catch (error) {
        console.error("Error fetching results:", error);
      }
    };

    fetchResults();
  }, []); // Empty dependency array to run once on mount

  // Mapping of original vote data to new candidate names
  const nameMapping = {
    'Candidate A': 'BJP',
    'Candidate B': 'Congress',
    'Candidate C': 'Shiv Sena',
  };

  // Count votes for each candidate from props
  const voteCounts = results.reduce((acc, { voteData }) => {
    const candidateName = nameMapping[voteData] || voteData; // Use mapped name
    acc[candidateName] = (acc[candidateName] || 0) + 1;
    return acc;
  }, {});

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
              {maxVotesCandidate === 'Tie' ? (
                <strong>It's a tie!</strong>
              ) : (
                <>
                  <strong>{maxVotesCandidate}</strong> has the most votes with <strong>{maxVotes}</strong> votes.
                </>
              )}
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
