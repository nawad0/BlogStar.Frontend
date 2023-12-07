import React, { useState, useEffect } from 'react';
import "./blog-edit.css"
const EditBlogPage = () => {
    const [blogData, setBlogData] = useState({
        title: '',
        description: '',
        // Добавьте другие свойства блога, которые вы хотите редактировать
    });

    const [loading, setLoading] = useState(true);
    const [jwtToken, setJwtToken] = useState('');

    useEffect(() => {
        const storedToken = localStorage.getItem('jwtToken');
        if (storedToken) {
            setJwtToken(storedToken);
            console.log(jwtToken);
        }

        const fetchBlog = async () => {
            try {
                const storedId = localStorage.getItem('blogid');
                console.log(storedId);
                const response = await fetch(`/api/Blogs/${storedId}`);
                const data = await response.json();
                console.log(data);

                // Установите данные блога в состояние
                setBlogData({
                    blogId: data.blogId,
                    creationDate: data.creationDate,
                    title: data.title,
                    description: data.description,
                    ownerUserId: data.ownerUserId,
                    userName: data.userName
                    // Установите другие свойства блога в состояние
                });

                setLoading(false);
            } catch (error) {
                console.error('Error fetching blog:', error.message);
                setLoading(false);
            }
        };

        fetchBlog();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setBlogData({ ...blogData, [name]: value });
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        try {
            const storedId = localStorage.getItem('blogid');
     
            const response = await fetch(`/api/Blogs/${storedId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${jwtToken}`,
                },
                body: JSON.stringify(blogData),
            });

           
            console.log('Blog updated successfully');
            console.log(blogData);
            window.location.href = 'blog';
            // Дополнительные действия после успешного обновления блога

        } catch (error) {
            console.error('Error updating blog:', error.message);
            // Обработка ошибки, например, вывод сообщения пользователю
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="edit-blog-container">
            <h2 className="edit-blog-title">Edit Blog</h2>
            <form className="edit-blog-form" onSubmit={handleFormSubmit}>
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

                {/* Add other form fields for editing other blog properties */}

                <button type="submit" className="form-button">
                    Update Blog
                </button>
            </form>
        </div>
    );

};

export default EditBlogPage;
