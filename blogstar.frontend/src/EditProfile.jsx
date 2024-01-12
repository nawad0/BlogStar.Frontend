import React, { useState, useEffect } from 'react';
import axios from 'axios' 
import { useParams, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './CreateArticle.css'; // Include your custom styles
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useDropzone } from 'react-dropzone';

const EditProfile = ({create}) => {
    const [userData, setUserData] = useState({
        userName: '',
        email: '',
        // other properties...
    });
    const [userImage, setUserImage] = useState(null);
    const [loading, setLoading] = useState(true);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setUserData({ ...userData, userImagePath: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };
    useEffect(() => {
        const fetchUser = async () => {
            const storedToken = localStorage.getItem('jwtToken');
            try {
                const response = await axios.get('auth/user', {
                    headers: {
                        Authorization: `Bearer ${storedToken}`,
                        'Content-Type': 'application/json',
                    },
                });

                setUserData(response.data);
            } catch (error) {
                console.error('Error fetching favorite articles:', error.response?.data || error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [loading]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserData({ ...userData, [name]: value });
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
 
        

        try {
            const storedToken = localStorage.getItem('jwtToken');
            const response = await fetch(`/auth/user/${userData.userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${storedToken}`,
                },
                body: JSON.stringify(userData),
            });

            console.log('Blog updated successfully');
            console.log(userData);
            create();
        } catch (error) {
            console.error('Error updating blog:', error.message);
        }
        
        const loginData ={
            userName: userData.userName,
            password: userData.password
        };
        try {
            console.log(userData);
            const response = await fetch('auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginData),
            });

            const data = await response.json();
           
            if (response.ok) {
                // Save the token upon successful authentication
                
                localStorage.setItem('jwtToken', data.token);
                console.log(data.token);
                setLoading(false);
            } else {
                console.error('Login Failed');
            }
        } catch (error) {
            console.error('Login Error', error);
        }
  
        setLoading(false);
        create();
    };
    
    return (
        <div>
            <form onSubmit={handleFormSubmit}>
                <div>
                    <label htmlFor="userName">User Name:</label>
                    <input
                        type="text"
                        id="userName"
                        name="userName"
                        value={userData.userName}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={userData.email}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="userImage">Profile Image:</label>
                    <input
                        type="file"
                        id="userImage"
                        name="userImage"
                        onChange={handleImageChange}
                    />
                </div>
                <button type="submit">Update Profile</button>
            </form>
        </div>
    );
};

export default EditProfile;
