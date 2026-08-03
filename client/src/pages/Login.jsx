import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function Login(){

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [message, setMessage] = useState("");

    const handleChange = (e) =>{
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) =>{

        e.preventDefault();

        try{

            const response = await api.post(
                "/auth/login",
                formData
            );

            localStorage.setItem(
                "token",
                response.data.token
            );

            localStorage.setItem(
                "user",
                JSON.stringify(response.data.user)
            );

            setMessage("Login successful");

            if (response.data.user.role === "admin") {
    navigate("/admin");
} 
else{
    navigate("/dashboard");
}

        } 
        catch(error){

            setMessage(
                error.response?.data?.message ||
                "Login failed"
            );

        }
    };

    return(
        <div>

            <h1>Login</h1>

            <form onSubmit={handleSubmit}>

                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                />

                <br />

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                />

                <br />

                <button type="submit">
                    Login
                </button>

            </form>

            <p>{message}</p>

            <Link to="/register">
                Don't have an account? Register
            </Link>

        </div>
    );
}

export default Login;