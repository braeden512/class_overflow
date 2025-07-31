import { useState } from "react";
import "../App.css";
import { FaReply } from 'react-icons/fa';

const CreateResponseButton = ({ question_id = null, parent_response_id = null, handlePostCreation }) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ content: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ content: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = JSON.parse(localStorage.getItem("user"));
    const user_id = user ? user.id : null;

    if (!user_id) {
      setError("You must be logged in to respond.");
      return;
    }

    const postData = {
      content: formData.content,
      user_id: user_id,
    };

    if (question_id && !parent_response_id) {
      postData.question_id = question_id;
    } else if (!question_id && parent_response_id) {
      postData.parent_response_id = parent_response_id;
    } else {
      setError("Invalid target. Cannot respond to both a question and a response.");
      return;
    }

    try {
      const response = await fetch("http://localhost/class_overflow/api/create_response.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        setFormData({ content: "" });
        setShowForm(false);
        if (handlePostCreation) handlePostCreation();
      } else {
        setError(data.error || "Error creating response");
      }
    } catch (err) {
      console.error("Submit error", err);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <>
      <button className="reply-button" onClick={() => setShowForm(true)}>
        <FaReply />
      </button>

      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-button" onClick={() => setShowForm(false)}>×</button>
            <h2>Create a New Response</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
            {success && <p style={{ color: "green" }}>Response created successfully!</p>}
            <form className="form" onSubmit={handleSubmit}>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                required
              />
              <button type="submit" className="button">Submit</button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default CreateResponseButton;
