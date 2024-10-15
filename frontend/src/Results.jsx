import React from 'react';

const Results = ({ results, onLogout }) => {
  return (
    <div className="container mt-5">
      <h2 className="text-center">Voting Results</h2>
      <ul className="list-group">
        {results.map((block) => (
          <li className="list-group-item" key={block.index}>
            {block.voteData}
          </li>
        ))}
      </ul>
      <button className="btn btn-danger mt-3" onClick={onLogout}>Logout</button>
    </div>
  );
};

export default Results;
