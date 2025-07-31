import '../styles/Post.css';
import '../App.css';
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import CreateResponseButton from './CreateResponseButton';

const Response = ({ id, username, createdAt, content }) => {

    const [likes, setLikes] = useState(0);
    const [dislikes, setDislikes] = useState(0);

    useEffect(() => {
        fetch('http://localhost/class_overflow/api/get_post_likes.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                question_id: id,
            }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.like_count !== undefined && data.dislike_count !== undefined) {
                setLikes(data.like_count);
                setDislikes(data.dislike_count);
            } else {
                console.error('Error fetching counts:', data);
            }
        })
        .catch(error => {
            console.error('Fetch error:', error);
        });
    }, [id]);

    return (
        <div>
            <div className='response-wrapper'>
                <div className='container wide response'>
                    <div className='postHeader'>
                        <div className='postHeader left'>
                            <h2 className='postHeading'>{username}</h2>
                        </div>
                        <div className='postHeader right'>
                            <h2 className='postHeading' style={{color: 'rgb(82, 82, 82)'}}>{createdAt}</h2>
                        </div>
                    </div>
                    <p className='normal'>{content}</p>
                    <div className='postInfo'>
                        <div className='postInfo left'>
                            <button className = 'like-button'><FaThumbsUp />{likes}</button>
                            <button className = 'dislike-button'><FaThumbsDown />{dislikes}</button>
                        </div>
                        <div className='postInfo right'>
                            <CreateResponseButton />
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );

};

export default Response;