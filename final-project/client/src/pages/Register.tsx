import { useState } from 'react';
import styles from '../styles/_registrationForm.module.css';
import { ValidateForm } from '../utils/validateForm';
import axios from 'axios';
import musicImage from '../images/music-image.png';


export interface FormData {
    username: string;
    email: string;
    address: string;
    password: string;
    confirmPassword: string;
    userType: 'Regular' | 'Musician';
    profilePicture: File | null;
}

export default function Register() {
    const [formData, setFormData] = useState<FormData>({
        username: '',
        email: '',
        address: '',
        password: '',
        confirmPassword: '',
        userType: 'Regular',
        profilePicture: null,
    });

    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [preview, setPreview] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setFormData({ ...formData, profilePicture: file });

        if (file) {
            const reader = new FileReader();
            reader.onload = () => setPreview(reader.result as string);
            reader.readAsDataURL(file);
        } else {
            setPreview(null);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const validationErrors = ValidateForm(formData);
        if (validationErrors) {
            setErrors(validationErrors);
            return;
        }

        const { username, email, password, userType, profilePicture } = formData;

        const formDataToSend = new FormData();
        formDataToSend.append('Username', username);
        formDataToSend.append('Email', email);
        formDataToSend.append('Password', password);
        formDataToSend.append('UserType', userType);
        formDataToSend.append('Latitude', '0'); // Replace with actual latitude if needed
        formDataToSend.append('Longitude', '0'); // Replace with actual longitude if needed
        if (profilePicture) formDataToSend.append('ProfilePicture', profilePicture);

        try {
            const response = await axios.post('http://localhost:3002/api/register', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            console.log('Registration successful:', response.data);
            alert('Registration successful!');
        } catch (error) {
            console.error('Registration failed:', error.response?.data || error.message);
            alert(error.response?.data.message || 'Registration failed.');
        }
    };

    return (
        <div className={styles.parentContainer}>
        <h2 className={styles.heading}>Registration Form</h2>
        <div className={styles.container}>
            <div className={styles.imageSection}>
                <img src={musicImage} alt="music image" className={styles.image} />
            </div>
            <form onSubmit={handleSubmit} className={styles.form}>
                <fieldset className={styles.fieldset}>
                    <legend>Username</legend>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                    />
                    {errors.username && <span className={styles.error}>{errors.username}</span>}
                </fieldset>

                <fieldset className={styles.fieldset}>
                    <legend>Email</legend>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                    {errors.email && <span className={styles.error}>{errors.email}</span>}
                </fieldset>

                <fieldset className={styles.fieldset}>
                    <legend>Address</legend>
                    <input
                        type="text"
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                    />
                    {errors.address && <span className={styles.error}>{errors.address}</span>}
                </fieldset>

                <fieldset className={styles.fieldset}>
                    <legend>Password</legend>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                    />
                    {errors.password && <span className={styles.error}>{errors.password}</span>}
                </fieldset>

                <fieldset className={styles.fieldset}>
                    <legend>Confirm Password</legend>
                    <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                    />
                    {errors.confirmPassword && (
                        <span className={styles.error}>{errors.confirmPassword}</span>
                    )}
                </fieldset>

                <fieldset className={styles.fieldset}>
                    <legend>User Type</legend>
                    <select
                        id="userType"
                        name="userType"
                        value={formData.userType}
                        onChange={handleChange}
                    >
                        <option value="Regular">Regular</option>
                        <option value="Musician">Musician</option>
                    </select>
                </fieldset>

                <fieldset className={styles.fieldset}>
                    <legend>Profile Picture</legend>
                    <input
                        type="file"
                        id="profilePicture"
                        name="profilePicture"
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                    {preview && (
                        <div className={styles.preview}>
                            <img src={preview} alt="Profile Preview" className={styles.image} />
                        </div>
                    )}
                </fieldset>

                <button type="submit" className={styles.button}>
                    Register
                </button>
            </form>
        </div>
        </div>


    );
}
