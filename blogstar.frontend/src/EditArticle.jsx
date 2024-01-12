import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './CreateArticle.css'; // Include your custom styles
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';


const EditArticle = () => {
    const [articleData, setArticleData] = useState({
        title: '',
        content: '',
    });
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [jwtToken, setJwtToken] = useState('');
    const navigateTo = useNavigate();
    useEffect(() => {
        const storedToken = localStorage.getItem('jwtToken');
        if (storedToken) {
            setJwtToken(storedToken);
        }

        const fetchArticle = async () => {
            try {
                const response = await fetch(`/api/articles/${id}`);
                const data = await response.json();
               
                setArticleData(data);
                
                setLoading(false);
            } catch (error) {
                console.error('Error fetching article:', error.message);
                setLoading(false);
            }
        };

        fetchArticle();
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setArticleData({ ...articleData, [name]: value });
    };

    const handleContentChange = (value) => {
        setArticleData({ ...articleData, content: value });
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`/api/articles/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${jwtToken}`,
                },
                body: JSON.stringify(articleData),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const responseData = await response.json();
            console.log('Update successful', responseData);
            navigateTo(`/articles/${articleData.blogId}`);
            // Optionally, redirect or perform other actions on success
        } catch (error) {
            console.error('Error updating article:', error.message);
            // Optionally, set state for error and display it to the user
        }
    };

    const modules = {
        toolbar: [
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['link', 'image', 'video'],
            ['blockquote', 'code-block'],
            [{ 'script': 'sub' }, { 'script': 'super' }],
            [{ 'indent': '-1' }, { 'indent': '+1' }],
            [{ 'align': [] }], // Add align button
            [{ 'direction': 'rtl' }],
            [{ 'size': ['small', false, 'large', 'huge'] }],
            [{ 'color': [] }, { 'background': [] }],
            ['clean'],
        ],
    };

    // ... (remaining code)


    const formats = [
        'header',
        'bold', 'italic', 'underline', 'strike',
        'list', 'bullet',
        'link', 'image', 'video',
        'blockquote', 'code-block',
        'script',
        'indent', 'direction',
        'size', 'color', 'background',
    ];

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mt-5">
            <form onSubmit={handleFormSubmit}>
                <div className="mb-3">
                    <label htmlFor="title" className="form-label">Title:</label>
                    <input
                        type="text"
                        className="form-control"
                        id="title"
                        name="title"
                        value={articleData.title}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="content" className="form-label">Content:</label>
                    <ReactQuill
                        theme="snow"
                        value={articleData.content}
                        onChange={handleContentChange}
                        modules={modules}
                        formats={formats}
                        placeholder="Write something amazing..."
                        required
                    />
                </div>

                <button type="submit" className="btn btn-primary">Update Article</button>
            </form>
        </div>
    );
};

export default EditArticle;
