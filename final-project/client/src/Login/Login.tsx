import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // Import useNavigate
import axios from "axios"; // For making HTTP requests
import styles from "./_loginForm.module.css";
import musicImage from "../images/music-image.png";
import { useAuth } from "../providers/AuthProvider";
import Header from "../pages/Header";

export interface FormData {
  username: string;
  password: string;
}

const Login = () => {
  const [formData, setFormData] = useState<FormData>({
    username: "",
    password: "",
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const navigate = useNavigate(); // Initialize useNavigate
  const { login } = useAuth(); // Access the login function from AuthContext
  const location = useLocation();

  // Handle form input changes
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "", // Clear error for the current field
    }));
  };

  // Validate form data
  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};
    if (!formData.username) {
      newErrors.username = "Username is required";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const response = await axios.post("http://localhost:3002/api/login", {
        Username: formData.username, // Map username to Username
        Password: formData.password,
      });

      setMessage("Login successful!");
      console.log("Login response:", response.data);
      localStorage.setItem("username", formData.username);

      // Save token to localStorage
      localStorage.setItem("token", response.data.token);
      console.log(localStorage.getItem("token"));
      localStorage.setItem("userType", response.data.user.UserType);

      // Set user as authenticated
      login({ Username: formData.username, Password: formData.password });
      const from = location.state?.from?.pathname || "/"; // Redirect back to the protected route or home
      navigate(from, { replace: true });

      // Navigate to the home page
      navigate("/");
    } catch (error: any) {
      console.error("Login error:", error);
      setMessage(
        error.response?.data?.message || "An error occurred during login"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Header />
      <div className={styles.parentContainer}>
        <h2 className={styles.heading}>Login Form</h2>
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
                className={styles.input}
              />
              {errors.username && (
                <span className={styles.error}>{errors.username}</span>
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
                className={styles.input}
              />
              {errors.password && (
                <span className={styles.error}>{errors.password}</span>
              )}
            </fieldset>

            <button
              type="submit"
              className="update-button"
              disabled={loading}
              style={{ width: "13rem" }}
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
            {message && <p className={styles.message}>{message}</p>}
          </form>
        </div>
      </div>
    </div>
  );
};
export default Login;
