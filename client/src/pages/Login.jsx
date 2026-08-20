import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await api.post("/auth/login", formData);

            login(response.data.token, response.data.user);

            setMessage("Login successful");

            if (response.data.user.role === "admin") {
                navigate("/admin");
            } else {
                navigate("/dashboard");
            }
        } catch (error) {
            setMessage(
                error.response?.data?.message || "Login failed"
            );
        }
    };

    return (
        <div>
            <h1>Login</h1>

            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />

                <br />

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />

                <br />

                <button type="submit">Login</button>
            </form>

            <p>{message}</p>

            <Link to="/register">Don't have an account? Register</Link>
        </div>
    );
}

export default Login;