import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";

function AdminDashboard() {
    const { user } = useAuth();

    return (
        <div>
            <Navbar />

            <div className="page-container">
                <h1>Admin Dashboard</h1>

                <div className="welcome-banner">
                    <h2>Welcome, {user?.name} (Admin)</h2>
                    <p>Email: {user?.email}</p>
                </div>

                <div className="dashboard-grid">
                    <div className="card">
                        <h3>👥 User Management</h3>
                        <p>View, create, edit roles, and delete registered users.</p>
                        <Link to="/admin/users" className="card-btn">
                            Manage Users &rarr;
                        </Link>
                    </div>

                    <div className="card">
                        <h3>📦 Product Management</h3>
                        <p>Manage product catalog, image uploads, search, and pricing.</p>
                        <Link to="/products" className="card-btn">
                            Manage Products &rarr;
                        </Link>
                    </div>

                    <div className="card">
                        <h3>👤 Admin Profile</h3>
                        <p>Update your personal information and change admin password.</p>
                        <Link to="/profile" className="card-btn">
                            Go to Profile &rarr;
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;