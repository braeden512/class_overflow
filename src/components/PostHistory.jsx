import '../styles/Post.css';
import '../App.css';
import { FaTimes } from 'react-icons/fa';

const PostHistory = ({username, schoolName, createdAt, content, postId, onChange}) => {

    return (
        <div>
            <div className='container wide' style={{margin: '5px'}}>
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

                <div style={{display: 'flex', justifyContent: 'center'}}>
                    <button className = 'delete-button' onClick={() => onChange(postId)}><FaTimes /></button>
                </div>
            </div>
        </div>

    );

};

export default PostHistory;