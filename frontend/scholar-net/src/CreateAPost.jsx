import React, { useState } from "react";
import "./CreateAPost.css";

function CreateAPost({ userID, onClose }) {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");

  const handleChange = (e) => {
    if (e.target.name === "title") {
      setTitle(e.target.value);
    } else if (e.target.name === "text") {
      setText(e.target.value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3000/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userID,
          title,
          content: text,
        }),
      });
      if (response.ok) {
        setTitle("");
        setText("");
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
            Text:{" "}
            <textarea
              name="text"
              value={text}
              onChange={handleChange}
            />
          </label>
          <button type="submit">Create an Update Post</button>
        </form>
      </div>
    </div>
  );
}

export default CreateAPost;
