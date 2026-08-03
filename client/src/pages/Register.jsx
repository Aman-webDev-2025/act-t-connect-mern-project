import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function Register(){

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: ""
    });

    const [message, setMessage] = useState("");

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

    };

    const handleSubmit = async(e)=>{

        e.preventDefault();

        try{

            await api.post(
                "/auth/register",
                formData
            );

            setMessage("Registration successful");

            setTimeout(() => {
                navigate("/login");
            }, 1000);

        } 
        catch(error){

            setMessage(
                error.response?.data?.message ||
                "Registration failed"
            );

        }
    };

    return(
        <div>

            <h1>Register</h1>

            <form onSubmit={handleSubmit}>

                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={formData.name}
                    onChange={handleChange}
                />

                <br />

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
                    Register
                </button>

            </form>

            <p>{message}</p>

            <Link to="/login">
                Already have an account? Login
            </Link>

        </div>
    );
}

export default Register;