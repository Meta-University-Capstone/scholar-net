import Post from './Post'
import './FeedList.css'
import { useState, useEffect } from 'react'

function murmurHash3(str, seed = 0) {
    const bytes = new TextEncoder().encode(str);
    let h1 = seed ^ bytes.length;
    let i = 0;
    let len = bytes.length;

    while (len >= 4) {
        let k1 = bytes[i] | (bytes[i + 1] << 8) | (bytes[i + 2] << 16) | (bytes[i + 3] << 24);
        i += 4;
        len -= 4;

        k1 = ((k1 * 0xcc9e2d51) >>> 0);
        k1 = (k1 << 15) | (k1 >>> (32 - 15));
        k1 = ((k1 * 0x1b873593) >>> 0);
        h1 ^= k1;
        h1 = (h1 << 13) | (h1 >>> (32 - 13));
        h1 = ((h1 * 5 + 0xe6546b64) >>> 0);
    }

    let k1 = 0;
    switch (len) {
        case 3:
            k1 ^= bytes[i + 2] << 16;
        case 2:
            k1 ^= bytes[i + 1] << 8;
        case 1:
            k1 ^= bytes[i];
            k1 = ((k1 * 0xcc9e2d51) >>> 0);
            k1 = (k1 << 15) | (k1 >>> (32 - 15));
            k1 = ((k1 * 0x1b873593) >>> 0);
            h1 ^= k1;
    }

    h1 ^= bytes.length;
    h1 = h1 ^ (h1 >>> 16);
    h1 = ((h1 * 0x85ebca6b) >>> 0);
    h1 = h1 ^ (h1 >>> 13);
    h1 = ((h1 * 0xc2b2ae35) >>> 0);
    h1 = h1 ^ (h1 >>> 16);

    return h1 >>> 0;
}

class BloomFilter {
    constructor(size, numHashFunctions) {
      this.size = size;
      this.numHashFunctions = numHashFunctions;
      this.bitArray = new Array(size).fill(false);
    }

    add(element) {
      const hashValues = this.getHashValues(element);
      hashValues.forEach(hash => {
        this.bitArray[hash] = true;
      });
    }

    contains(element) {
      const hashValues = this.getHashValues(element);
      return hashValues.every(hash => this.bitArray[hash]);
    }

    getHashValues(element) {
      const hashes = [];
      for (let i = 0; i < this.numHashFunctions; i++) {
        hashes.push(murmurHash3(element.toString(), i) % this.size);
      }
      return hashes;
    }
  }


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

    const bloomFilterSize = 128;
    const numHashFunctions = 3;
    const bloomFilter = new BloomFilter(bloomFilterSize, numHashFunctions);


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

    useEffect(() => {
        if (profile.Connections && Array.isArray(profile.Connections)) {
          profile.Connections.forEach(connection => {
            bloomFilter.add(connection);
          });
        }
      }, [profile.Connections]);


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
        score += bioSimilarity * 15;


        if (profile.Connections && bloomFilter.contains(post.userID)) {
            score += 5;
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
