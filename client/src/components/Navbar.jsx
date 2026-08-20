import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
    const { user, logout } = useAuth();

    return (
        <div style={{ background: "#222", padding: "12px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <div>
                <Link to="/dashboard" style={{ color: "#fff", marginRight: "15px", fontWeight: "bold" }}>
                    Dashboard
                </Link>
                <Link to="/products" style={{ color: "#fff", marginRight: "15px" }}>
                    Products
                </Link>
                <Link to="/profile" style={{ color: "#fff", marginRight: "15px" }}>
                    Profile
                </Link>
                {user?.role === "admin" && (
                    <>
                        <Link to="/admin" style={{ color: "#fff", marginRight: "15px" }}>
                            Admin
                        </Link>
                        <Link to="/admin/users" style={{ color: "#fff", marginRight: "15px" }}>
                            Manage Users
                        </Link>
                    </>
                )}
            </div>

            <div>
                {user && (
                    <span style={{ color: "#eee", marginRight: "15px" }}>
                        {user.name} ({user.role})
                    </span>
                )}
                <button
                    onClick={logout}
                    style={{ background: "#dc2626", color: "white", padding: "6px 12px", border: "none", borderRadius: "4px", cursor: "pointer" }}
                >
                    Logout
                </button>
            </div>
        </div>
    );
}

export default Navbar;
