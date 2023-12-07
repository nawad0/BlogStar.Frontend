import React, { useState, useEffect } from 'react';
import "./blog-create.css"

const CreateBlogPage = () => {
    const [blogData, setBlogData] = useState({
        title: '',
        description: '',
        // Add other blog properties as needed
    });
    const [redirectTo, setRedirectTo] = useState(null);
    const [blogs, setBlogs] = useState([]);
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setBlogData({ ...blogData, [name]: value });
    };
        useEffect(() => {
        if (redirectTo) {
            window.location.href = redirectTo;
        }
       
       
    }, [redirectTo]);

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        console.log(blogData);
      
        try {
            const storedToken = localStorage.getItem('jwtToken');
            const response = await fetch('/api/Blogs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${storedToken}`, // replace with your actual access token
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

    return (
        <form className="blog-form" onSubmit={handleFormSubmit}>
            <label htmlFor="title" className="form-label">
                Title:
            </label>
            <input
                type="text"
                id="title"
                name="title"
                value={blogData.title}
                onChange={handleInputChange}
                className="form-input"
                required
            />

            <label htmlFor="description" className="form-label">
                Description:
            </label>
            <textarea
                id="description" 
                name="description"
                value={blogData.description}
                onChange={handleInputChange}
                className="form-textarea"
                required
            />

            {/* Add other form fields as needed */}

            <button type="submit" className="form-button">
                Create Blog
            </button>
        </form>
    );

};

export default CreateBlogPage;