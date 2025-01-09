import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./_registrationForm.module.css";
import { ValidateForm } from "../utils/validateForm";
import axios from "axios";
import musicImage from "../images/music-image.png";
import Header from "../pages/Header";

export interface FormData {
  username: string;
  email: string;
  address: string;
  password: string;
  confirmPassword: string;
  userType: "Regular" | "Musician";
  profilePicture: File | null;
}

export interface FormData {
  username: string;
  email: string;
  address: string;
  password: string;
  confirmPassword: string;
  userType: "Regular" | "Musician";
  profilePicture: File | null;
}

export default function Register() {
  const [formData, setFormData] = useState<FormData>({
    username: "",
    email: "",
    address: "",
    password: "",
    confirmPassword: "",
    userType: "Regular",
    profilePicture: null,
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [preview, setPreview] = useState<string | null>(null);
  const [, setCoordinates] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
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
  console.log(import.meta.env.VITE_GEOCODING_API_KEY);

  const geocodeAddress = async (address: string) => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json`,
        {
          params: {
            address: address,
            key: import.meta.env.VITE_GEOCODING_API_KEY, // Replace with your actual API key
          },
        }
      );

      if (response.data.status === "OK") {
        const location = response.data.results[0].geometry.location;
        setCoordinates({ lat: location.lat, lng: location.lng });
        return location;
      } else {
        throw new Error("Geocoding failed. Check the address.");
      }
    } catch (error) {
      console.error("Error in geocoding:", error);
      alert("Failed to fetch location. Please check the address.");
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = ValidateForm(formData);
    if (validationErrors) {
      setErrors(validationErrors);
      return;
    }

    try {
      // Get latitude and longitude from the address
      const { lat, lng } = await geocodeAddress(formData.address);

      // Append data to FormData for the backend
      const { username, email, password, userType, profilePicture } = formData;
      const formDataToSend = new FormData();
      formDataToSend.append("Username", username);
      formDataToSend.append("Email", email);
      formDataToSend.append("Password", password);
      formDataToSend.append("UserType", userType);
      formDataToSend.append("Latitude", lat.toString());
      formDataToSend.append("Longitude", lng.toString());
      if (profilePicture)
        formDataToSend.append("ProfilePicture", profilePicture);

      // Submit to your API
      await axios.post("http://localhost:3002/api/register", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Automatically sign in the user
      const loginResponse = await axios.post(
        "http://localhost:3002/api/login",
        {
          Username: username,
          Password: password,
        }
      );

      localStorage.setItem("token", loginResponse.data.token);
      navigate("/");
    } catch (error) {
      console.error(
        "Registration or login failed:",
        error.response?.data || error.message
      );
      alert(error.response?.data.message || "Registration or login failed.");
    }
  };

  return (
    <div>
      <Header />
      <div className={styles.parentContainer}>
        <h2 className={styles.heading}>Registration Form</h2>
        <div className={styles.container}>
          <div className={styles.imageSection}>
            <img src={musicImage} alt="music image" className={styles.image} />
          </div>
          <form onSubmit={handleSubmit} className={styles.form}>
            <fieldset className={styles.fieldset}>
              <legend className={styles.legend}>Username</legend>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
              />
              {errors.username && (
                <span className={styles.error}>{errors.username}</span>
              )}
            </fieldset>

            <fieldset className={styles.fieldset}>
              <legend className={styles.legend}>Email</legend>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && (
                <span className={styles.error}>{errors.email}</span>
              )}
            </fieldset>

            <fieldset className={styles.fieldset}>
              <legend className={styles.legend}>Address</legend>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
              />
              {errors.address && (
                <span className={styles.error}>{errors.address}</span>
              )}
            </fieldset>

            <fieldset className={styles.fieldset}>
              <legend className={styles.legend}>Password</legend>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
              />
              {errors.password && (
                <span className={styles.error}>{errors.password}</span>
              )}
            </fieldset>

            <fieldset className={styles.fieldset}>
              <legend className={styles.legend}>Confirm Password</legend>
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
              <legend className={styles.legend}>User Type</legend>
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
              <legend className={styles.legend}>Profile Picture</legend>
              <input
                type="file"
                id="profilePicture"
                name="profilePicture"
                accept="image/*"
                onChange={handleFileChange}
              />
              {preview && (
                <div className={styles.preview}>
                  <img
                    src={preview}
                    alt="Profile Preview"
                    className={styles.image}
                  />
                </div>
              )}
            </fieldset>

            <button
              type="submit"
              className="update-button"
              style={{ width: "11rem" }}
            >
              Register
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
