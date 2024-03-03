import logo from './logo.svg';
import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [pincode, setPincode] = useState('');
  const [filteredPincodeData, setFilteredPincodeData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPincodeData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
      const data = await response.json();
//Delivery
      if (data && data[0] && data[0].PostOffice) {
        setFilteredPincodeData(data[0].PostOffice);
        setError(null);
      } else {
        setError('Invalid pincode');
      }
    } catch (error) {
      setError('Error fetching data');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const filterValue = e.target.value.toLowerCase();
    const filteredData = filteredPincodeData.filter((office) =>
      office.Name.toLowerCase().includes(filterValue)
    );
    setFilteredPincodeData(filteredData);
  };

  return (
    <div className="App">
      <h1>Pincode Lookup</h1>
      <div>
        <label>Enter Pincode:</label>
        <input
          type="text"
          maxLength="6"
          value={pincode}
          onChange={(e) => setPincode(e.target.value)}
        />
        <button onClick={fetchPincodeData}>Lookup</button>
      </div>

      {loading && <div className="loader">Loading...</div>}

      {error && <div className="error">{error}</div>}

      {filteredPincodeData.length === 0 && !loading && !error && (
        <div className="error">Couldn’t find the postal data you’re looking for…</div>
      )}

      { <div>
        <label>Filter by Post Office Name:</label>
        <input type="text" onChange={handleFilterChange} />
      </div> }

      <div className="result-container">
        {filteredPincodeData.map((office) => (
          <div key={office.Name} className="result">
            <p>
              <strong>Post Office:</strong> {office.Name}
            </p>
            <p>
              <strong>Branch Type - Delivery Status:</strong> {office.DeliveryStatus}
            </p>
          
            
            <p>
              <strong>District:</strong> {office.District}
            </p>
            <p>
              <strong>State:</strong> {office.State}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
