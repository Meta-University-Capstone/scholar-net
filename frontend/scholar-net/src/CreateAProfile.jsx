import React, { useState } from 'react';
import './CreateAProfile.css';

function CreateAProfile() {
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [role, setRole] = useState('');

  const {uid} = useParams();

  const makeProfile = async () => {
    try {
      const response = await fetch(`http://localhost:3000/profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          bio,
          role,
          userID: uid,
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('Profile created:', data);
    } catch (error) {
      console.error('Error creating profile:', error);
    }
  };

  return (
    <div id="create-form" className="modal-overlay">
      <div className="modal-content">
        <h1>Create a new profile</h1>
        <form onSubmit={(e) => {
          e.preventDefault();
          makeProfile();
        }}>
          <input type="text" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} />
          <textarea type="text" placeholder="What's your goal? What do you hope to acheive?" value={bio} onChange={(e) => setBio(e.target.value)} />
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="">Select a role</option>
            <option value="High School Student">High School Student</option>
            <option value="Scholarship Benefactor">Scholarship Benefactor</option>
          </select>
          <button className="create-button" type="submit">Create Profile</button>
        </form>
      </div>
    </div>
  );
}

export default CreateAProfile;
