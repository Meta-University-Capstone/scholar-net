import Post from './Post'
import './FeedList.css'
import { useState } from 'react'

function FeedList(props){
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editedPost, setEditedPost] = useState({
      post: null,
      title: "",
      location: "",
      field_interest: "",
      content: "",
    });

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
        props.refreshPosts();
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

        props.refreshPosts();
      } catch (error) {
        console.error("Error deleting post:", error);
      }
    };

    const handleChange = (e) => {
      const { name, value } = e.target;
      setEditedPost({...editedPost,[name]: value,});
    };


    return(
            <div className="feed">
              {props.setPosts.map((post) => (
                <Post
                  key={post.id}
                  id={post.id}
                  userID={post.userID}
                  usersuid={props.userID}
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
        );
        }

export default FeedList
