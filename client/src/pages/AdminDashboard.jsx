import { Link } from "react-router-dom";

function AdminDashboard(){

    const user = JSON.parse(
        localStorage.getItem("user")
    );

    return(
        <div>

            <h1>Admin Dashboard</h1>

            <h2>Welcome, {user?.name}</h2>

            <p>Email: {user?.email}</p>

            <p>Role: {user?.role}</p>

            <hr />

            <h3>Admin Panel</h3>

            <p>
                You can manage users from here.
            </p>
            <Link to="/admin/users">
                Manage Users
            </Link>

        </div>
    );
}

export default AdminDashboard;