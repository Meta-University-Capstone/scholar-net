import React, { useState } from "react";
import "./CreateAPost.css";
import { useParams } from "react-router-dom";



function CreateAPost({ onClose, userID, profileID }) {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [location, setLocation] = useState("");
  const [field_interest, setFieldInterest] = useState("");





  const handleChange = (e) => {
    if (e.target.name === "title") {
        setTitle(e.target.value);
    } else if (e.target.name === "text") {
        setText(e.target.value);
    } else if (e.target.name === "location") {
        setLocation(e.target.value);
    } else if (e.target.name === "field_interest") {
        setFieldInterest(e.target.value);
    }
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3000/profile/${userID}/${profileID}/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
            userID,
            title,
            location,
            field_interest,
            content: text,
        }),
      });
      if (response.ok) {
        setTitle("");
        setText("");
        setLocation("");
        setFieldInterest("");
        onClose();
      }
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  return (
    <div className="modal-overlay open">
      <div className="modal-content">
        <span className="close-btn" onClick={onClose}>&times;</span>
        <h2>Share an Update 📝</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Title:{" "}
            <input
              type="text"
              name="title"
              value={title}
              onChange={handleChange}
            />
          </label>
          <label>
            Location:{" "}
            <input
              type="text"
              name="location"
              placeholder="City, State"
              value={location}
              onChange={handleChange}
            />
          </label>
          <label>
            Field of Interest:{" "}
            <input
              type="text"
              name="field_interest"
              value={field_interest}
              onChange={handleChange}
            />
          </label>
          <label>
            Content:{" "}
            <textarea
              name="text"
              value={text}
              onChange={handleChange}
            />
          </label>
          <button type="submit">Create a Post</button>
        </form>
      </div>
    </div>
  );
}

export default CreateAPost;
