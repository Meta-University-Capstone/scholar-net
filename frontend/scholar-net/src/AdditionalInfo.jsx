import React, { useState } from "react";
import './AdditionalInfo.css'

function AdditionalInfo({ onClose, userID, profileID}) {
  const [age, setAge] = useState(0);
  const [gpa, setGPA] = useState(0);
  const [personalStatement, setPersonalStatement] = useState("");
  const [interests, setInterests] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case "age":
        setAge(parseInt(value));
        break;
      case "gpa":
        setGPA(parseFloat(value));
        break;
      case "personalStatement":
        setPersonalStatement(value);
        break;
      case "interests":
        setInterests(value);
        break;
      default:
        break;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3000/additional_info/${userID}/${profileID}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userID,
          age,
          gpa,
          personal_statement: personalStatement,
          interests,
        }),
      });
      if (response.ok) {
        setAge(0);
        setGPA(0);
        setPersonalStatement("");
        setInterests("");
        onClose();
        const data = await response.json();
        setAdditionalInfo([...additionalInfo, data]);
      }
    } catch (error) {
      console.error('Error submitting additional info:', error);
    }
  };

  return (
    <div className="modal-overlay open">
      <div className="modal-content">
        <span className="close-btn" onClick={onClose}>&times;</span>
        <h2>Submit Additional Information</h2>
        <p>This helps Scholarship Benefactors learn more about you!</p>
        <form onSubmit={handleSubmit}>
          <label>
            Age:
            <input
              type="number"
              name="age"
              value={age}
              onChange={handleChange}
            />
          </label>
          <label>
            GPA:
            <input
              type="number"
              step="0.01"
              name="gpa"
              value={gpa}
              onChange={handleChange}
            />
          </label>
          <label>
            Personal Statement:
            <textarea
              name="personalStatement"
              value={personalStatement}
              onChange={handleChange}
            />
          </label>
          <label>
            Interests:
            <input
              type="text"
              name="interests"
              value={interests}
              onChange={handleChange}
            />
          </label>
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
}

export default AdditionalInfo;
