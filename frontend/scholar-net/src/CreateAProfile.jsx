import React, { useState } from 'react';
import './CreateAProfile.css';


function CreateAProfile({userID}) {
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [role, setRole] = useState('');



  const makeProfile = async () => {
    try {
      const requestData = {
        name,
        bio,
        role,
        userID,
      };

      const response = await fetch(`http://localhost:3000/profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });
      const responseData = await response.json();

    } catch (error) {
      console.error('Error creating profile:', error);
    }
  };


  return (
    <div className="modal-overlay open">
      <div className="modal-content">
        <h1>Create a new profile</h1>
        <form className='form' onSubmit={(e) => {
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
