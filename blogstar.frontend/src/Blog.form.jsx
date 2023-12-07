// src/components/BlogsPage.js

import React, { useState, useEffect } from 'react';

const Blog = () => {
    const [blogs, setBlogs] = useState([]);
    const [userBlogs, setUserBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [jwtToken, setJwtToken] = useState('');

    useEffect(() => {
        const storedToken = localStorage.getItem('jwtToken');
        if (storedToken) {
            setJwtToken(storedToken);
            console.log(jwtToken);
        }
        const fetchBlogs = async () => {
            try {
                const response = await fetch('/api/Blogs');
                if (!response.ok) {
                    throw new Error(`Failed to fetch blogs - ${response.statusText}`);
                }
                const data = await response.json();
                setBlogs(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching blogs:', error.message);
                setLoading(false);
            }
        };

        const fetchUserBlogs = async () => {
            try {
                const response = await fetch('api/Blogs/user-blogs', {
                    headers: {
                        Authorization: `Bearer ${storedToken}`, // replace with your actual access token
                    },
                });
                if (!response.ok) {
                    throw new Error(`Failed to fetch user blogs - ${response.statusText}`);
                }
                const data = await response.json();
                setUserBlogs(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching user blogs:', error.message);
                setLoading(false);
            }
        };

        fetchBlogs();
        fetchUserBlogs();
    }, []);

    const [blogData, setBlogData] = useState({
        title: '',
        description: '',
        // Add other blog properties as needed
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setBlogData({ ...blogData, [name]: value });
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('/api/Blogs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${jwtToken}`, // replace with your actual access token
                },
                body: JSON.stringify(blogData),
            });

       

            const newBlog = await response.json();
            console.log('New blog created:', newBlog);

            // Update the list of blogs
            setBlogs((prevBlogs) => [...prevBlogs, newBlog]);

            // Clear the form data
            setBlogData({
                title: '',
                description: '',
                // Add other blog properties as needed
            });
        } catch (error) {
            console.error('Error creating a new blog:', error.message);
            // Handle error, e.g., display an error message to the user
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>Blogs</h1>
            <h2>User Blogs</h2>
            <ul>
                {userBlogs.map((blog) => (
                    <li key={blog.blogId}>
                        <strong>Title:</strong> {blog.title} <br />
                        <strong>Description:</strong> {blog.description} <br />
                        <strong>Owner:</strong> {blog.userName} <br />
                        <strong>Creation Date:</strong> {blog.creationDate} <br />
                        {/* Add other properties as needed */}
                    </li>
                ))}
            </ul>

            <form onSubmit={handleFormSubmit}>
                <label htmlFor="title">Title:</label>
                <input
                    type="text"
                    id="title"
                    name="title"
                    value={blogData.title}
                    onChange={handleInputChange}
                    required
                />

                <label htmlFor="description">Description:</label>
                <textarea
                    id="description"
                    name="description"
                    value={blogData.description}
                    onChange={handleInputChange}
                    required
                />

                {/* Add other form fields as needed */}

                <button type="submit">Create Blog</button>
            </form>
        </div>
    );
};

export default Blog;
   

