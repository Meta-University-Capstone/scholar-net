import React from "react";
import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import './ProfilePage.css'
import Profile from "./Profile";
import Post from "./Post";


function ProfilePage(){
const[profile, setProfile] = useState({})
const [editing, setEditing] = useState(false);
const [userPosts, setUserPosts] = useState([]);
const [editModalOpen, setEditModalOpen] = useState(false);
    const [editedPost, setEditedPost] = useState({
      post: null,
      title: "",
      location: "",
      field_interest: "",
      content: "",
    });

const {userID} = useParams();


    const fetchUserPosts = async () => {
        try {
          const postsResponse = await fetch(`http://localhost:3000/posts/${userID}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });

          if (postsResponse.ok) {
            const posts = await postsResponse.json();
            setUserPosts(posts);
          }
        } catch (error) {
          console.error('Error fetching user posts:', error);
        }
    };

    useEffect(() => {
        const fetchProfile = async () => {
          try {
            const response = await fetch(`http://localhost:3000/profile/${userID}`,{
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            });
            if (response.ok) {
              const profiles = await response.json();
              if (profiles.length > 0) {
                setProfile(profiles[0]);
              }
            }
          } catch (error) {
            console.error('Error fetching profile:', error);
          }
        };
        fetchProfile();
        fetchUserPosts();
    }, [userID]);

    const handleEditPost = (post) => {
      setEditedPost({
        post,
        title: post.title,
        location: post.location,
        field_interest: post.field_interest,
        content: post.content,
      });
      setEditModalOpen(true);
    };

    const handleSaveEdit = async (event) => {
        event.preventDefault();
      try {
        const updatedData = {
          title: editedPost.title,
          location: editedPost.location,
          field_interest: editedPost.field_interest,
          content: editedPost.content,
          updated_at: new Date().toISOString(),
        };
        const response = await fetch(`http://localhost:3000/posts/${editedPost.post.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedData),
        });
        if (!response.ok) {
          throw new Error("Failed to update post");
        }
        setEditedPost({...editedPost,post: null,});
        setEditModalOpen(false);
        fetchUserPosts();
      } catch (error) {
        console.error("Error updating post:", error);
      }
    };

    const handleDeletePost = async (postId) => {
      try {
        const response = await fetch(`http://localhost:3000/posts/${postId}`, {
          method: "DELETE",
        });
        if (!response.ok) {
          throw new Error("Failed to delete post");
        }
        fetchUserPosts();
      } catch (error) {
        console.error("Error deleting post:", error);
      }
    };

    const handleChange = (e) => {
      const { name, value } = e.target;
      setEditedPost({...editedPost,[name]: value,});
    };



  const handleEditClick = () => {
    setEditing(true);
  };

  const handleSaveClick = async () => {
    const response = await fetch(`http://localhost:3000/profile/${userID}/${profile.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userID: profile.userID,
        name: profile.name,
        bio: profile.bio,
        role: profile.role,
      }), id: profile.id,
    });
    if (response.ok) {
        const updatedProfile = await response.json();
        setProfile(updatedProfile);
        setEditing(false);
  };}





    return(
        <>
        <h1>Scholar-Net</h1>
        <Link to={`/`}>
            <button  className="home-btn">Home</button>
        </Link>
        <div className="profile-info">
            <h3>Your Profile</h3>
            <Profile
            name={profile.name}
            role={profile.role}
            bio={profile.bio}
            />
            <button onClick={handleEditClick}>Edit Profile</button>

            {editing && (
                <div className="modal-overlay open">
                    <div className="modal-content">
                        <form>
                            <label>
                                Name:<input type="text" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
                            </label>
                            <label>
                                Bio:<textarea value={profile.bio} onChange={(e) => setProfile({ ...profile, bio: e.target.value })} />
                            </label>
                            <label>
                                Role:<select value={profile.role} onChange={(e) => setProfile({ ...profile, role: e.target.value })}>
                                <option value="">Select a role</option>
                                <option value="High School Student">High School Student</option>
                                <option value="Scholarship Benefactor">Scholarship Benefactor</option>
                                </select>
                            </label>
                            <button onClick={handleSaveClick}>Save Changes</button>
                        </form>
                    </div>
                </div>
            )}

        </div>
        <div className="users-posts">
            <h3>Your Posts</h3>

          {userPosts.map((post) => (
            <Post
            key={post.id}
            id={post.id}
            userID={post.userID}
            usersuid={userID}
            profileID={post.profileID}
            title={post.title}
            postUser={post.postUser}
            content={post.content}
            location={post.location}
            field_interest={post.field_interest}
            likeCount={post.likeCount}
            created_at={post.created_at}
            updated_at={post.updated_at}
            onEdit={() => handleEditPost(post)}
            onDelete={() => handleDeletePost(post.id)}
          />
          ))}
            {editModalOpen && editedPost.post && (
                <div className="modal-overlay open">
                <div className="modal-content">
                    <span className="close-btn" onClick={() => setEditModalOpen(false)}>
                    &times;
                    </span>
                    <h2>Edit Post</h2>
                    <form onSubmit={handleSaveEdit}>
                    <label>
                        Title:{" "}
                        <input
                        type="text"
                        name="title"
                        value={editedPost.title}
                        onChange={handleChange}
                        />
                    </label>
                    <label>
                        Location:{" "}
                        <input
                        type="text"
                        name="location"
                        value={editedPost.location}
                        onChange={handleChange}
                        />
                    </label>
                    <label>
                        Field of Interest:{" "}
                        <input
                        type="text"
                        name="field_interest"
                        value={editedPost.field_interest}
                        onChange={handleChange}
                        />
                    </label>
                    <label>
                        Content:{" "}
                        <textarea
                        name="content"
                        value={editedPost.content}
                        onChange={handleChange}
                        />
                    </label>
                    <button type="submit">Save Changes</button>
                    </form>
                </div>
                </div>
            )}

        </div>
        </>
    )
}

export default ProfilePage
