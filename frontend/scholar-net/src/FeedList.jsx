import Post from './Post'
import './FeedList.css'
import { useState, useEffect } from 'react'

function FeedList(props){
    const [editModalOpen, setEditModalOpen] = useState(false);
    const[profile, setProfile] = useState({})
    const [userPosts, setUserPosts] = useState([]);
    const [sortedPosts, setSortedPosts] = useState([]);
    const [editedPost, setEditedPost] = useState({
      post: null,
      title: "",
      location: "",
      field_interest: "",
      content: "",
    });

    useEffect(() => {
        const fetchProfile = async () => {
          try {
            const response = await fetch(`http://localhost:3000/profile/${props.userID}`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
            });
            if (response.ok) {
              const profiles = await response.json();
              if (profiles.length > 0) {
                setProfile(profiles[0]);
              }
            } else {
              throw new Error('Failed to fetch profile');
            }
          } catch (error) {
            console.error('Error fetching profile:', error);
          }
        };

        const fetchUserPosts = async () => {
          try {
            const postsResponse = await fetch(`http://localhost:3000/posts/${props.userID}`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
            });

            if (postsResponse.ok) {
              const posts = await postsResponse.json();
              setUserPosts(posts);
            } else {
              throw new Error('Failed to fetch user posts');
            }
          } catch (error) {
            console.error('Error fetching user posts:', error);
          }
        };

        const fetchData = async () => {
          await fetchProfile();
          await fetchUserPosts();
        };

        fetchData();
    }, [props.userID]);


    useEffect(() => {
        const sortAndSetPosts = () => {
            const sorted = sortPostsByScore(props.posts, profile);
            setSortedPosts(sorted);
        };
        sortAndSetPosts();
    }, [props.posts, profile]);

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



      const calculateScore = (profile, post) => {
        try{
            let score = 0;

        if (profile.name === post.postUser) {
          score += 10;
        }

        const bioSimilarity = calculateStringSimilarity(profile.bio, post.content);
        score += bioSimilarity * 5;

        const gpa = ['3.0', '3.5', '3.8', '4.0'];
        gpa.forEach(gpa => {
          if (post.content.toLowerCase().includes(gpa.toLowerCase())) {
            score += 4;
          }
        });

        if (profile.connections && profile.connections.includes(post.userID)) {
          score += 15;
        }
        return score;

      }catch(error){
        return 0
      };}


  const calculateStringSimilarity = (str1, str2) => {
    if(str2===undefined || str1===undefined){
        return 0;
    }
    const maxLength = Math.max(str1.length, str2.length);
    const distance = levenshteinDistance(str1, str2);
    const similarity = 1 - distance / maxLength;
    return similarity;
  };

  const levenshteinDistance = (a, b) => {
    const matrix = Array.from(Array(a.length + 1), (_, i) => Array(b.length + 1).fill(i));
    for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
    for (let i = 0; i <= b.length; i++) matrix[0][i] = i;
    for (let i = 1; i <= a.length; i++) {
      for (let j = 1; j <= b.length; j++) {
        const cost = a[i - 1] === b[j - 1] ? 0 : 1;
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j - 1] + cost
        );
      }
    }
    return matrix[a.length][b.length];
  };


  const sortPostsByScore = (posts, profile) => {
    if (!profile || !posts) {
        return posts
      }
    posts.sort((a, b) => {
      const scoreA = calculateScore(profile, a);
      const scoreB = calculateScore(profile, b);
      return scoreB - scoreA;
    });
    return posts;
  };


    return(
            <div className="feed">
              {sortedPosts.map((post) => (
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
                  profile={post.profile}
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
