import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../services/api";

function Dashboard() {
    const user = JSON.parse(localStorage.getItem("user"));
    const [totalProducts, setTotalProducts] = useState(0);

    useEffect(() => {
        const getStats = async () => {
            try {
                const res = await api.get("/products");
                setTotalProducts(res.data.totalProducts || 0);
            } catch (error) {
                console.log(error);
            }
        };

        getStats();
    }, []);

    return (
        <div>
            <Navbar />

            <h1>Dashboard</h1>

            {user && (
                <>
                    <h2>Welcome, {user.name}</h2>
                    <p>Email: {user.email}</p>
                    <p>Role: {user.role}</p>
                </>
            )}

            <hr />

            <h3>Quick Stats</h3>
            <p>Total Products: <b>{totalProducts}</b></p>

            <hr />

            <h3>Navigation</h3>
            <p>
                <Link to="/products">Go to Products (CRUD, Upload, Search, Pagination)</Link>
            </p>
            <p>
                <Link to="/profile">Go to Profile & Change Password</Link>
            </p>

            {user?.role === "admin" && (
                <p>
                    <Link to="/admin/users">Go to User Management</Link>
                </p>
            )}
        </div>
    );
}

export default Dashboard;