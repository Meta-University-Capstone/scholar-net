import React, { useEffect } from "react"
import { Link } from "react-router-dom";
import { useState } from "react";

function Search(){
    const [searchTerm, setSearchTerm]= useState('');
    const [posts, setPosts] = useState([]);

    async function getPosts() {
        try {
          const response = await fetch(`http://localhost:3000/posts`,{
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
          );
          if (!response.ok) {
            throw new Error('Failed to fetch posts');
          }
          const data = await response.json();
          setPosts(data);
        } catch (error) {
          console.error('Error fetching posts:', error);
        }
    }


    async function handleSearchDisplay(query){
        try {
            const response = await fetch(`http://localhost:3000/search/${query}`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
            });

            if (!response.ok) {
              throw new Error('Failed to search posts');
            }

            const data = await response.json();
            setPosts(data);
        } catch (error) {
            console.error('Error searching posts:', error);
        }
    }

    function handleChange(e) {
        setSearchTerm(e.target.value);
    }

    function handleSearch() {
        if (searchTerm.trim() !== '') {
            handleSearchDisplay(searchTerm);
        } else {
            getPosts();
        }
    }

    useEffect(() => {
        getPosts();
    }, []);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString();
    };



    return(
        <>
        <h1>Scholar-Net</h1>
        <Link to={`/`}>
            <button  className="home-btn">Home</button>
        </Link>
        <div className="search-bar">
        <input
          type="text"
          value={searchTerm}
          onChange={handleChange}
          placeholder="Search......"
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      <div className="posts">
        {posts.map((post) => (
          <div key={post.id} className="post">
            <h3>{post.title}</h3>
            <p>{post.content}</p>
            <p>Location: {post.location}</p>
            <p>Field of Interest: {post.field_interest}</p>
            <p>Like Count: {post.likeCount}</p>
            <p>Created: {formatDate(post.created_at)}</p>
            <p>Posted by: {post.postUser}</p>
          </div>
        ))}
      </div>
    </>
  );
}


export default Search
