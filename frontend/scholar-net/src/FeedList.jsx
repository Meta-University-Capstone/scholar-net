import Post from './Post'
import './FeedList.css'
import { useState, useEffect } from 'react'

function FeedList(props){
    const [posts, setPosts] = useState([])

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

    useEffect(() => {
        getPosts()
    }, [])


    function renderPosts(post){
        return(
            <Post
                key={post.id}
                id={post.id}
                userID={props.userID}
                profileID={props.profileID}
                title={post.title}
                postUser={post.postUser}
                content={post.content}
                location={post.location}
                field_interest={post.field_interest}
                likeCount={post.likeCount}
                created_at={post.created_at}
                updated_at={post.updated_at}/>
        )
    }


    return(
        <>
            <div className="feed">
                {posts.map(renderPosts)}
            </div>
        </>
    )
}

export default FeedList
