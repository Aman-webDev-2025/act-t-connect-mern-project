import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function UserManagement(){
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
    const fetchUsers = async ()=>{
        try{
            setError("");

            const response = await api.get("/users");

            setUsers(response.data.users);
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to load users"
            );
        }
    };

    useEffect(() =>{
        fetchUsers();
    }, []);

    // Handle input
    const handleChange =(e)=>{
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // CREATE / UPDATE
    const handleSubmit = async(e)=>{
        e.preventDefault();

        try{
            setMessage("");
            setError("");

            if(editingId){
                // UPDATE
                await api.put(
                    `/users/${editingId}`,
                    {
                        name: formData.name,
                        email: formData.email,
                    }
                );

                setMessage("User updated successfully");
            } 
            else{
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
        } 
        catch(error){
            setError(
                error.response?.data?.message ||
                "Operation failed"
            );
        }
    };

    // EDIT
    const handleEdit = (user) =>{
        setEditingId(user._id);

        setFormData({
            name: user.name,
            email: user.email,
            password: "",
        });

        setMessage("");
        setError("");
    };

    // DELETE
    const handleDelete = async (id) =>{
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this user?"
        );

        if(!confirmDelete){
            return;
        }

        try{
            setMessage("");
            setError("");

            await api.delete(`/users/${id}`);

            setMessage("User deleted successfully");

            fetchUsers();
        } 
        catch(error){
            setError(
                error.response?.data?.message ||
                "Failed to delete user"
            );
        }
    };

    // Cancel edit
    const handleCancel = () =>{
        setEditingId(null);

        setFormData({
            name: "",
            email: "",
            password: "",
        });

        setMessage("");
        setError("");
    };

    return(
        <div className="min-h-screen bg-gray-100 p-6">

            <div className="mx-auto max-w-6xl">

                {/* Header */}
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">
                            User Management
                        </h1>

                        <p className="mt-1 text-gray-500">
                            Create, view, update and delete users
                        </p>
                    </div>

                    <Link
                        to="/admin"
                        className="rounded-lg bg-gray-800 px-4 py-2 text-white hover:bg-gray-700"
                    >
                        Back to Dashboard
                    </Link>
                </div>

                {/* Messages */}
                {message && (
                    <div className="mb-4 rounded-lg bg-green-100 p-3 text-green-700">
                        {message}
                    </div>
                )}

                {error && (
                    <div className="mb-4 rounded-lg bg-red-100 p-3 text-red-700">
                        {error}
                    </div>
                )}

                {/* CREATE / UPDATE */}
                <div className="mb-8 rounded-xl bg-white p-6 shadow">

                    <h2 className="mb-4 text-xl font-semibold text-gray-800">
                        {editingId
                            ? "Update User"
                            : "Add New User"}
                    </h2>

                    <form
                        onSubmit={handleSubmit}
                        className="grid gap-4 md:grid-cols-3"
                    >

                        <input
                            type="text"
                            name="name"
                            placeholder="Name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="rounded-lg border p-3 outline-none focus:border-blue-500"
                        />

                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="rounded-lg border p-3 outline-none focus:border-blue-500"
                        />

                        {!editingId && (
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="rounded-lg border p-3 outline-none focus:border-blue-500"
                            />
                        )}

                        <div className="flex gap-2 md:col-span-3">

                            <button
                                type="submit"
                                className="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700"
                            >
                                {editingId
                                    ? "Update User"
                                    : "Add User"}
                            </button>

                            {editingId && (
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="rounded-lg bg-gray-500 px-5 py-3 font-medium text-white hover:bg-gray-600"
                                >
                                    Cancel
                                </button>
                            )}

                        </div>

                    </form>
                </div>

                {/* READ */}
                <div className="overflow-hidden rounded-xl bg-white shadow">

                    <div className="border-b p-6">
                        <h2 className="text-xl font-semibold text-gray-800">
                            All Users
                        </h2>
                    </div>

                    <div className="overflow-x-auto">

                        <table className="w-full">

                            <thead className="bg-gray-50">

                                <tr>
                                    <th className="px-6 py-4 text-left">
                                        Name
                                    </th>

                                    <th className="px-6 py-4 text-left">
                                        Email
                                    </th>

                                    <th className="px-6 py-4 text-left">
                                        Role
                                    </th>

                                    <th className="px-6 py-4 text-left">
                                        Actions
                                    </th>
                                </tr>

                            </thead>

                            <tbody>

                                {users.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan="4"
                                            className="px-6 py-8 text-center text-gray-500"
                                        >
                                            No users found
                                        </td>
                                    </tr>
                                ) : (
                                    users.map((user) => (
                                        <tr
                                            key={user._id}
                                            className="border-t"
                                        >

                                            <td className="px-6 py-4">
                                                {user.name}
                                            </td>

                                            <td className="px-6 py-4">
                                                {user.email}
                                            </td>

                                            <td className="px-6 py-4">
                                                <span
                                                    className={`rounded-full px-3 py-1 text-sm ${
                                                        user.role === "admin"
                                                            ? "bg-purple-100 text-purple-700"
                                                            : "bg-blue-100 text-blue-700"
                                                    }`}
                                                >
                                                    {user.role}
                                                </span>
                                            </td>

                                            <td className="px-6 py-4">

                                                <div className="flex gap-2">

                                                    <button
                                                        onClick={() =>
                                                            handleEdit(user)
                                                        }
                                                        className="rounded-lg bg-yellow-500 px-3 py-2 text-white hover:bg-yellow-600"
                                                    >
                                                        Edit
                                                    </button>

                                                    <button
                                                        onClick={() =>
                                                            handleDelete(
                                                                user._id
                                                            )
                                                        }
                                                        className="rounded-lg bg-red-600 px-3 py-2 text-white hover:bg-red-700"
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