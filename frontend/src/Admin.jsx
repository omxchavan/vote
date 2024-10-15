import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import './Admin.css'; // Custom CSS file
import Results from './Results'; // Import Results component

const Admin = ({ setIsAdmin }) => {
  const [adminID, setAdminID] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [results, setResults] = useState([]);
  const [message, setMessage] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);

  // Function to handle admin login
  const handleAdminLogin = () => {
    if (adminID === 'om' && adminPassword === '123') {
      fetchResults();
    } else {
      setMessage('Invalid Admin ID or Password.');
    }
  };

  // Function to fetch results
  const fetchResults = async () => {
    try {
      const response = await axios.get('http://localhost:3000/blockchain');
      setResults(response.data);
      setLoggedIn(true); // Set login status to true
    } catch (error) {
      console.error("Error fetching results:", error);
      setMessage("Error fetching results.");
    }
  };

  // If the admin is logged in, display the results component
  if (loggedIn) {
    return <Results results={results} onLogout={() => setIsAdmin(false)} />;
  }

  return (
    <div className="container mt-5">
      <h2 className="text-center">Admin Login</h2>
      <div className="form-group">
        <label>Admin ID:</label>
        <input
          type="text"
          className="form-control"
          placeholder="Enter Admin ID"
          value={adminID}
          onChange={(e) => setAdminID(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>Admin Password:</label>
        <input
          type="password"
          className="form-control"
          placeholder="Enter Admin Password"
          value={adminPassword}
          onChange={(e) => setAdminPassword(e.target.value)}
        />
      </div>
      <button className="btn btn-primary" onClick={handleAdminLogin}>
        Login
      </button>
      {message && <p className="text-danger mt-3">{message}</p>}
    </div>
  );
};

export default Admin;
