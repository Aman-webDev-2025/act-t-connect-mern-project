import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";

function Profile() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("");
    const [profileMessage, setProfileMessage] = useState("");

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [passwordMessage, setPasswordMessage] = useState("");

    // Load profile on start
    const fetchProfile = async () => {
        try {
            const response = await api.get("/users/profile");
            setName(response.data.user.name);
            setEmail(response.data.user.email);
            setRole(response.data.user.role);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    // Update Name & Email
    const handleProfileUpdate = async (e) => {
        e.preventDefault();

        try {
            const response = await api.put("/users/profile", {
                name: name,
                email: email,
            });

            // Update user in localStorage
            localStorage.setItem("user", JSON.stringify(response.data.user));

            setProfileMessage(response.data.message || "Profile updated successfully");
        } catch (error) {
            setProfileMessage(
                error.response?.data?.message || "Failed to update profile"
            );
        }
    };

    // Change Password
    const handlePasswordChange = async (e) => {
        e.preventDefault();

        try {
            const response = await api.put("/users/change-password", {
                currentPassword: currentPassword,
                newPassword: newPassword,
            });

            setPasswordMessage(response.data.message || "Password changed successfully");
            setCurrentPassword("");
            setNewPassword("");
        } catch (error) {
            setPasswordMessage(
                error.response?.data?.message || "Failed to change password"
            );
        }
    };

    return (
        <div>
            <Navbar />

            <h1>My Profile</h1>

            {/* Profile Update Form */}
            <form onSubmit={handleProfileUpdate}>
                <h2>Update Profile</h2>

                <label>Name:</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <br />

                <label>Email:</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <br />

                <label>Role:</label>
                <input
                    type="text"
                    value={role}
                    disabled
                />
                <br />

                <button type="submit">Save Profile</button>

                {profileMessage && <p>{profileMessage}</p>}
            </form>

            <hr />

            {/* Change Password Form */}
            <form onSubmit={handlePasswordChange}>
                <h2>Change Password</h2>

                <label>Current Password:</label>
                <input
                    type="password"
                    placeholder="Enter current password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                />
                <br />

                <label>New Password:</label>
                <input
                    type="password"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                />
                <br />

                <button type="submit">Change Password</button>

                {passwordMessage && <p>{passwordMessage}</p>}
            </form>
        </div>
    );
}

export default Profile;
