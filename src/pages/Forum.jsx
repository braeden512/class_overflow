import React, { useState, useEffect, useCallback } from 'react';
import NavBar from '../components/NavBar.jsx';
import Post from '../components/Post.jsx';
import CreatePostButton from '../components/CreatePostButton.jsx';
import FilterPost from '../components/FilterPost.jsx';
import * as tf from '@tensorflow/tfjs';
import * as use from '@tensorflow-models/universal-sentence-encoder';
import '../App.css';
import '../styles/Forum.css';
import { FaSearch, FaFilter, FaTimes } from 'react-icons/fa';

const Forum = () => {
    const [posts, setPosts] = useState([]);
    const [filteredPosts, setFilteredPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [filters, setFilters] = useState({ universities: [], classes: [] });
    const [searchText, setSearchText] = useState('');
    const [model, setModel] = useState(null);
    const [searchPost, setSearchPost] = useState(false);

    const fetchPosts = useCallback(async () => {
        try {
            const response = await fetch("http://localhost/class_overflow/api/show_post.php");
            const data = await response.json();

            if (data.success) {
                setPosts(data.posts);
                setFilteredPosts(data.posts);
            } else {
                setError(data.error || 'Failed to fetch posts');
            }
        } catch (err) {
            console.error('Error fetching posts:', err);
            setError('Could not fetch posts. Try again later.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    useEffect(() => {
        const loadModel = async () => {
            const loadedModel = await use.load();
            setModel(loadedModel);
        };
        loadModel();
    }, []);

    const applyAllFilters = async (filtersToApply, search = searchText) => {
        setSearchPost(true);

        const { universities, classes } = filtersToApply;
        let filtered = posts.filter(post => {
            const matchUni = universities.length === 0 || universities.includes(post.school_name);
            const matchClass = classes.length === 0 || classes.includes(post.class_name);
            return matchUni && matchClass;
        });

        if (search.trim() && model) {
            const embeddings = await model.embed([search, ...filtered.map(p => p.content)]);
            const queryEmbedding = embeddings.slice([0, 0], [1]);
            const postEmbeddings = embeddings.slice([1]);

            const similarities = await tf.matMul(postEmbeddings, queryEmbedding, false, true).data();

            filtered = filtered.map((post, idx) => ({
                ...post,
                similarity: similarities[idx],
            }))
            .sort((a, b) => b.similarity - a.similarity); // most relevant first
        }

        setFilteredPosts(filtered);
        setSearchPost(false);
    };

    const handleApplyFilter = (newFilters) => {
        setFilters(newFilters);
        applyAllFilters(newFilters);
    };

    const handleSearch = () => {
        applyAllFilters(filters);
    };

    const handleClearSearch = () => {
        setSearchText('');
        applyAllFilters(filters, '');
    };

    const allUniversities = [...new Set(posts.map(p => p.school_name))];
    const allClasses = [...new Set(posts.map(p => p.class_name))];

    return (
        <>
            <NavBar />
            <div className='forum-container'>
            <div className='search-container'>
                <input
                    className='search-input'
                    type='text'
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder='Search'
                />
                
                {searchText && (
                    <button className='search-button' onClick={handleClearSearch}><FaTimes /></button>
                )}
                
                <button className='search-button' onClick={handleSearch}><FaSearch /></button>
                <button className='filter-button' onClick={() => setShowFilterModal(true)}><FaFilter /></button>
            </div>

                <hr className='line' />

                {showFilterModal && (
                    <FilterPost
                        universities={allUniversities}
                        classes={allClasses}
                        onApply={handleApplyFilter}
                        onClose={() => setShowFilterModal(false)}
                    />
                )}

                {loading ? (
                    <div>Loading the posts...</div>
                ) : error ? (
                    <div>Error: {error}</div>
                ) : searchPost ? (
                    <div>Searching for the posts...</div>

                ) : (filteredPosts.map((post) => (
                        <Post
                            key={post.question_id}
                            id={post.question_id}
                            type='question'
                            username={post.title}
                            schoolName={post.school_name}
                            createdAt={post.created_at}
                            content={post.content}
                        />
                    ))
                )}

                <CreatePostButton handlePostCreation={fetchPosts} />
            </div>
        </>
    );
};

export default Forum;