import '../styles/NavBar.css';

import { useNavigate } from "react-router-dom";

const NavBar = () => {

    const navigate = useNavigate();

    // navigation functions
    const goToHome = () => {navigate('/home');}
    const goToForum = () => {navigate('/forum');}
    const goToProfile = () => {navigate('/profile');}
    

    return (
        <>
            <nav className="navbar">
                <div className="nav-left">
                    <button onClick={goToHome}>Home</button>
                    <button onClick={goToForum}>Forum</button>
                </div>
                <div className="nav-right">
                    <button onClick={goToProfile}>Profile</button>
                </div>
            </nav>
        </>
    );

};

export default NavBar;