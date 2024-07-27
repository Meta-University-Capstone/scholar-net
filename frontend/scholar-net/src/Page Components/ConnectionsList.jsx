import React from 'react';
import { useState, useEffect } from 'react';
import './ConnectionsList.css';
import { Link } from 'react-router-dom';


const ConnectionsList = ({userID}) => {
    const [connections, setConnections] = useState([]);

    useEffect(() => {
        const fetchConnections = async () => {
          try {
            const response = await fetch(`http://localhost:3000/connections/${userID}`);
            if (response.ok) {
              const data = await response.json();
              setConnections(data)
            } else {
              console.error('Failed to fetch connections');
            }
          } catch (error) {
            console.error('Error fetching connections:', error);
          }
        };
        if (userID) {
          fetchConnections();
        }
    }, [userID])

    return (
      <div className="connection">
        {connections.length > 0 ? (
            connections.map((connection) => (
                <div key={connection.id} className="connection">
                    <Link to={`/other_user/${connection.profile.id}`}>
                        <h3>{connection.profile.name}</h3>
                    </Link>
                    <p>{connection.profile.role}</p>
                </div>
            ))
        ) : (
            <p>No connections found.</p>
        ) }
      </div>
    )
}

export default ConnectionsList
