import React, { useState } from "react";
import "./CreateAPost.css";
import { useParams } from "react-router";

function CreateAPost({ onClose }) {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [location, setLocation] = useState("");
  const [fieldInterest, setFieldInterest] = useState("");
  const {uid} = useParams();


  const handleChange = (e) => {
    if (e.target.name === "title") {
        setTitle(e.target.value);
    } else if (e.target.name === "text") {
        setText(e.target.value);
    } else if (e.target.name === "location") {
        setLocation(e.target.value);
    } else if (e.target.name === "fieldInterest") {
        setFieldInterest(e.target.value);
    }
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3000/profile/${uid}posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
            userID: uid,
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
              name="fieldInterest"
              value={fieldInterest}
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
