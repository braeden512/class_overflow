import NavBar from '../components/NavBar.jsx';
import '../App.css';

const Home = () => {

    return (
        <>
            <NavBar />
            <div className="page-content">
                <div className="container wide">
                    <h1 className="title">Welcome to Collegiate Forum</h1>
                    <hr className="line"></hr>
                    <h2 className="subheading" style={{ marginTop: '10px' }}>What Is Collegiate Forum?</h2>
                    <p className="normal">A student focused Q&A platform designed to help you ask and answer class related questions.</p>
                    <hr className="line"></hr>
                    <h2 className="subheading">Who Is This For?</h2>
                    <p className="normal">Any student who wants to better understand their class material and connect with their peers.</p>
                    <hr className="line"></hr>
                    <h2 className="subheading">How Does It Help You?</h2>
                    <p className="normal" style={{ marginBottom: '0px' }}><li><b>No more searching through irrelevant posts</b>. You can quickly find discussions tailored to your exact courses.</li></p><br/>
                    <p className="normal" style={{ marginTop: '0px' }}><li><b>Becoming a learning leader</b>. Share what you know and empower others to succeed alongside you.</li></p>
                </div>
            </div>
        </>
    );

};

export default Home;
