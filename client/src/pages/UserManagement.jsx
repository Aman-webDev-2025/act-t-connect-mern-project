import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../services/api";

function UserManagement() {
    const [users, setUsers] = useState([]);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });

    const [editingId, setEditingId] = useState(null);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    // READ - Get all users
    const fetchUsers = async () => {
        try {
            setError("");
            const response = await api.get("/users");
            setUsers(response.data.users || []);
        } catch (err) {
            setError(
                err.response?.data?.message || "Failed to load users"
            );
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // Handle input
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // CREATE / UPDATE
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setMessage("");
            setError("");

            if (editingId) {
                // UPDATE
                await api.put(`/users/${editingId}`, {
                    name: formData.name,
                    email: formData.email,
                });
                setMessage("User updated successfully");
            } else {
                // CREATE
                await api.post("/users", formData);
                setMessage("User created successfully");
            }

            setFormData({
                name: "",
                email: "",
                password: "",
            });

            setEditingId(null);
            fetchUsers();
        } catch (err) {
            setError(
                err.response?.data?.message || "Operation failed"
            );
        }
    };

    // EDIT
    const handleEdit = (user) => {
        setEditingId(user._id);
        setFormData({
            name: user.name,
            email: user.email,
            password: "",
        });
        setMessage("");
        setError("");
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // DELETE
    const handleDelete = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this user?"
        );
        if (!confirmDelete) return;

        try {
            setMessage("");
            setError("");
            await api.delete(`/users/${id}`);
            setMessage("User deleted successfully");
            fetchUsers();
        } catch (err) {
            setError(
                err.response?.data?.message || "Failed to delete user"
            );
        }
    };

    // Cancel edit
    const handleCancel = () => {
        setEditingId(null);
        setFormData({
            name: "",
            email: "",
            password: "",
        });
        setMessage("");
        setError("");
    };

    return (
        <div>
            <Navbar />

            <div className="page-container">
                <div className="header-flex">
                    <div>
                        <h1>User Management</h1>
                        <p>Create, view, update and delete users</p>
                    </div>
                    <Link to="/admin" className="action-btn secondary">
                        &larr; Back to Admin
                    </Link>
                </div>

                {/* Messages */}
                {message && <div className="alert success">{message}</div>}
                {error && <div className="alert error">{error}</div>}

                {/* CREATE / UPDATE FORM */}
                <div className="card form-card">
                    <h2>{editingId ? "Update User" : "Add New User"}</h2>

                    <form onSubmit={handleSubmit} className="product-form">
                        <div className="form-row">
                            <div className="form-group">
                                <label>Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            {!editingId && (
                                <div className="form-group">
                                    <label>Password</label>
                                    <input
                                        type="password"
                                        name="password"
                                        placeholder="Password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            )}
                        </div>

                        <div className="form-buttons">
                            <button type="submit" className="action-btn">
                                {editingId ? "Update User" : "Add User"}
                            </button>

                            {editingId && (
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="action-btn secondary"
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* READ TABLE */}
                <div className="card table-card">
                    <h2>All Users ({users.length})</h2>

                    <div className="table-responsive">
                        <table>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="empty-cell">
                                            No users found
                                        </td>
                                    </tr>
                                ) : (
                                    users.map((user) => (
                                        <tr key={user._id}>
                                            <td>{user.name}</td>
                                            <td>{user.email}</td>
                                            <td>
                                                <span className={`badge ${user.role === "admin" ? "admin-badge" : "user-badge-tag"}`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="table-actions">
                                                    <button
                                                        onClick={() => handleEdit(user)}
                                                        className="edit-btn"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(user._id)}
                                                        className="delete-btn"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserManagement;