import NavBar from '../components/NavBar.jsx';
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import '../App.css';
import '../styles/Profile.css';
import PostHistory from '../components/PostHistory.jsx';

const Profile = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [college, setCollege] = useState("");  // College or School, depending on what you save
    // control whether the checkbox is checked or not
    const [darkMode, setDarkMode] = useState(false);

    // for the user post history
    const [userPosts, setUserPosts] = useState([]); // state to hold the fetched post
    const [loading, setLoading] = useState(true); // state to track loading status
    const [error, setError] = useState(""); // state to track any fetch errors

    // Use useCallback to avoid re-creating the fetchPosts function
    const fetchPosts = useCallback(async () => {
        const user = JSON.parse(localStorage.getItem("user"));

        try {
            const response = await fetch(`http://localhost/class_overflow/api/post_history.php?user_id=${user.id}`); // show post from only the user
            const data = await response.json();

            if (data.success) {
                setUserPosts(data.posts); // update the post state with fetched data
            } else {
                setError(data.error || 'Failed to fetch post');
            }
        } catch (error){ // catch any error during the fetch process
            console.error('Error fetching post:', error);
            setError('Could not fetch post. Try again later')
        } finally {
            setLoading(false); // loading is finished if it was successful in getting the post or there was an error
        }
        
    }, []); // left an empty array since it does not depend on external variable

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]); // have a dependency array to re-run the code if the fetchPosts function changes


    // function to delete post by user id
    const handleDeletePost = async (post_id) => {
        const user = JSON.parse(localStorage.getItem("user"));

        // confirmation of the deletion
        var delete_choice = window.confirm("Are you sure you want to delete the post?");

        if(!delete_choice) {
            return;
        }

        const response = await fetch("http://localhost/class_overflow/api/delete_post.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                user_id: user.id,
                post_id: post_id
            }),
        })

        const result = await response.json();

        if (result.success) {
            // deletes the post
            setUserPosts(prevPost => prevPost.filter(post => post.question_id !== post_id));
            console.log("Post deleted");
        }
        else {
            console.error("Failed to delete post:", result.error);
        }

    };

    // only do this once after the component is rendered
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        console.log("User object from localStorage:", user); // Debugging step to check the object structure

        if (user) {
            setUsername(user.username);
            setCollege(user.school);  // Set the college (school) value from localStorage
            setDarkMode(user.dark_mode === 1);
            // change the css body to dark-mode class so it visually displays the dark mode
            document.body.classList.toggle("dark-mode", user.dark_mode === 1);

        } else {
            navigate("/login");  // Redirect to login if the user is not logged in
        }
    }, [navigate]);

    const handleDarkModeChange = async (event) => {
        const newValue = event.target.checked;
        setDarkMode(newValue);
        document.body.classList.toggle("dark-mode", newValue);

        const user = JSON.parse(localStorage.getItem("user"));

        // changing dark_mode for user in database
        const response = await fetch("http://localhost/class_overflow/api/profile.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                user_id: user.id,
                dark_mode: newValue ? 1 : 0,
            }),
        });

        const result = await response.json();

        if (result.success) {
            // Update localStorage user data
            const updatedUser = { ...user, dark_mode: newValue ? 1 : 0 };
            localStorage.setItem("user", JSON.stringify(updatedUser));
            console.log("Dark mode updated successfully.");
        }
        else {
            console.error("Failed to update dark mode:", result.error);
        }
    };

    function logOut() {
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("user");
        navigate("/login");
    }

    return (
        <>
            <NavBar />
            {/* centers the page */}
            <div className="page-content">
                <div className='container wide' style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                    <h1 className='title'>{username}'s Profile</h1>
                    <button className='button' onClick={logOut}>Logout</button>
                    <hr className='line'></hr>
                    <div className='container' style={{ display: 'flex', alignItems: 'center' }}>
                        <p className='normal' style={{ marginRight: '10px' }}>Dark Mode</p>
                        <input
                            type="checkbox"
                            id="darkMode"
                            checked={darkMode}
                            onChange={handleDarkModeChange}
                        />
                    </div>
                    <br />
                    <div className='container' style={{ display: 'flex', alignItems: 'center' }}>
                        <p className='normal'>College: {college}</p>  {/* Displays the school name */}
                    </div>
                    <hr className='line'></hr>
                    <p className='normal'>Post History</p>
                    { loading ? (
                        <div>Loading the posts...</div>
                    ) : error ? (
                        <div>Error: {error}</div>
                    ) : (
                        userPosts.map((post) => (
                            // add a fixed width constraint in profile.css
                            <div key={post.question_id} className='post-history'> 
                                <PostHistory
                                // get the info from the database and pass them as props for PostHistory.jsx
                                username = {post.title}// if user want to display their username or just anonymous
                                schoolName = {post.school_name}// school name
                                createdAt = {post.created_at} // when the post was created
                                content = {post.content} // post content

                                // need to pass both as props
                                postId = {post.question_id}
                                onChange = {handleDeletePost}
                                ></PostHistory>

                            </div>

                        )))}
    
                </div>
            </div>
        </>
    );
};

export default Profile;
