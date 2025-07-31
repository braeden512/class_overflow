import { useEffect, useState } from "react";
import "../App.css";
import "../styles/ResponseList.css";

const ResponseList = ({ question_id, refreshKey }) => {
  const [responses, setResponses] = useState([]);

  useEffect(() => {
    fetch(`http://localhost/class_overflow/api/get_responses.php?question_id=${question_id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setResponses(data.responses);
        } else {
          console.error("Failed to fetch responses:", data.error);
        }
      })
      .catch(err => console.error("Fetch error:", err));
  }, [question_id, refreshKey]);

  const topLevel = responses.filter(r => !r.parent_response_id);
  const children = responses.filter(r => r.parent_response_id);

  const getReplies = parentId =>
    children.filter(r => r.parent_response_id === parentId);

  return (
    <>
      <div className="response-container">
      {topLevel.length === 0 ? (
        <p>No responses yet.</p>
      ) : (
        topLevel.map(res => (
          <>
            <hr style={{color: 'red'}} className='line' />
            <div key={res.id} className="response-card">
              <p>{res.content}</p>
              <p className="tiny-text">by {res.username} on {res.created_at}</p>
              {getReplies(res.id).map(reply => (
                <div key={reply.id} className="response-reply" style={{ marginLeft: "30px", borderLeft: "2px solid #ccc", paddingLeft: "10px" }}>
                  <p>{reply.content}</p>
                  <p className="tiny-text">by {reply.username} on {reply.created_at}</p>
                </div>
              ))}
            </div>
          </>
        ))
      )}
    </div>
    </>
  );
};

export default ResponseList;
