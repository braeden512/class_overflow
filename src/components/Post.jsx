import '../styles/Post.css';
import '../App.css';
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import CreateResponseButton from './CreateResponseButton';
import ResponseList from './ResponseList';

const Post = ({ id, username, schoolName, createdAt, content }) => {
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [userId, setUserId] = useState(null);
  const [hasLiked, setHasLiked] = useState(false);
  const [hasDisliked, setHasDisliked] = useState(false);
  const [showResponses, setShowResponses] = useState(false);
  const [responseRefresh, setResponseRefresh] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) setUserId(user.id);
  }, []);

  useEffect(() => {
    fetch('http://localhost/class_overflow/api/get_post_likes.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ question_id: id }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.like_count != null) setLikes(data.like_count);
        if (data.dislike_count != null) setDislikes(data.dislike_count);
      })
      .catch(console.error);
  }, [id]);

  const sendUpdate = (payload, toggleFn) => {
    fetch('http://localhost/class_overflow/api/update_like_dislike.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setLikes(data.like_count);
          setDislikes(data.dislike_count);
          toggleFn();
        } else {
          console.error(data.error);
        }
      })
      .catch(console.error);
  };

  const handleLike = () => {
    if (!userId) return console.error('User not logged in');
    sendUpdate(
      { post_id: id, user_id: userId, like: hasLiked ? 0 : 1, dislike: 0 },
      () => {
        setHasLiked(prev => !prev);
        if (hasDisliked) setHasDisliked(false);
      }
    );
  };

  const handleDislike = () => {
    if (!userId) return console.error('User not logged in');
    sendUpdate(
      { post_id: id, user_id: userId, like: 0, dislike: hasDisliked ? 0 : 1 },
      () => {
        setHasDisliked(prev => !prev);
        if (hasLiked) setHasLiked(false);
      }
    );
  };

  const triggerResponseRefresh = () => {
    setResponseRefresh(prev => !prev);
  };

  return (
    <div>
      <div className='container wide' style={{ margin: '5px' }}>
        <div className='postHeader'>
          <div className='postHeader left'>
            <h2 className='postHeading'>{username}</h2>
            <h2 className='postSubheading'>({schoolName})</h2>
          </div>
          <div className='postHeader right'>
            <h2 className='postSubheading'>{createdAt}</h2>
          </div>
        </div>
        <p className='normal post'>{content}</p>

        <div className='postInfo'>
          <div className='postInfo left'>
            <button className='like-button' onClick={handleLike}>
              <FaThumbsUp /> {likes}
            </button>
            <button className='dislike-button' onClick={handleDislike}>
              <FaThumbsDown /> {dislikes}
            </button>
          </div>
          <div className='postInfo right'>
            <CreateResponseButton question_id={id} handlePostCreation={triggerResponseRefresh} />
          </div>
        </div>

        <button className='show-response-button' onClick={() => setShowResponses(!showResponses)}>
          {showResponses ? "Hide Responses" : "Show Responses"}
        </button>

        {showResponses && (
          <ResponseList question_id={id} refreshKey={responseRefresh} />
        )}
      </div>
    </div>
  );
};

export default Post;
