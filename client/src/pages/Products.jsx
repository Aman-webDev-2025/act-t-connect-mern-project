import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";

function Products() {
    const [products, setProducts] = useState([]);

    // Form inputs
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [category, setCategory] = useState("Electronics");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState(null);

    // Edit state
    const [editingId, setEditingId] = useState(null);

    // Search, Filter, Pagination, Sorting
    const [search, setSearch] = useState("");
    const [filterCategory, setFilterCategory] = useState("all");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [sort, setSort] = useState("desc");

    const [message, setMessage] = useState("");

    // Fetch Products (Search, Filter, Pagination, Sort)
    const fetchProducts = async (currentPage = page) => {
        try {
            const res = await api.get(
                `/products?search=${search}&category=${filterCategory}&page=${currentPage}&limit=5&sort=${sort}`
            );
            setProducts(res.data.products || []);
            setTotalPages(res.data.totalPages || 1);
            setPage(res.data.currentPage || 1);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchProducts(1);
    }, [search, filterCategory, sort]);

    // Create or Update Product
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const formData = new FormData();
            formData.append("name", name);
            formData.append("price", price);
            formData.append("category", category);
            formData.append("description", description);

            if (image) {
                formData.append("image", image);
            }

            if (editingId) {
                // Update
                await api.put(`/products/${editingId}`, formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                setMessage("Product updated successfully");
            } else {
                // Create
                await api.post("/products", formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                setMessage("Product created successfully");
            }

            // Reset form
            setName("");
            setPrice("");
            setCategory("Electronics");
            setDescription("");
            setImage(null);
            setEditingId(null);

            fetchProducts(page);
        } catch (error) {
            setMessage(
                error.response?.data?.message || "Operation failed"
            );
        }
    };

    // Edit Button Click
    const handleEdit = (product) => {
        setEditingId(product._id);
        setName(product.name);
        setPrice(product.price);
        setCategory(product.category);
        setDescription(product.description || "");
        setImage(null);
        setMessage("");
    };

    // Delete Product
    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure to delete this product?");
        if (!confirmDelete) return;

        try {
            await api.delete(`/products/${id}`);
            setMessage("Product deleted successfully");
            fetchProducts(page);
        } catch (error) {
            setMessage("Failed to delete product");
        }
    };

    // Cancel Edit
    const handleCancel = () => {
        setEditingId(null);
        setName("");
        setPrice("");
        setCategory("Electronics");
        setDescription("");
        setImage(null);
    };

    return (
        <div>
            <Navbar />

            <h1>Product Management</h1>

            {/* CREATE / UPDATE FORM */}
            <form onSubmit={handleSubmit}>
                <h2>{editingId ? "Edit Product" : "Add New Product"}</h2>

                <label>Name:</label>
                <input
                    type="text"
                    placeholder="Product Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <br />

                <label>Price:</label>
                <input
                    type="number"
                    placeholder="Price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                />
                <br />

                <label>Category:</label>
                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                >
                    <option value="Electronics">Electronics</option>
                    <option value="Clothing">Clothing</option>
                    <option value="Books">Books</option>
                    <option value="Other">Other</option>
                </select>
                <br />
                <br />

                <label>Description:</label>
                <input
                    type="text"
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <br />

                <label>Image Upload:</label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImage(e.target.files[0])}
                />
                <br />

                <button type="submit">
                    {editingId ? "Update Product" : "Add Product"}
                </button>

                {editingId && (
                    <button
                        type="button"
                        onClick={handleCancel}
                        style={{ marginLeft: "10px", background: "#666" }}
                    >
                        Cancel
                    </button>
                )}

                {message && <p>{message}</p>}
            </form>

            <hr />

            {/* SEARCH & FILTER CONTROLS */}
            <div style={{ width: "90%", maxWidth: "1000px", margin: "20px auto", display: "flex", gap: "10px", flexWrap: "wrap" }}>
                <input
                    type="text"
                    placeholder="Search by name..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{ flex: 1, minWidth: "200px" }}
                />

                <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    style={{ minWidth: "150px" }}
                >
                    <option value="all">All Categories</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Clothing">Clothing</option>
                    <option value="Books">Books</option>
                    <option value="Other">Other</option>
                </select>

                <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    style={{ minWidth: "150px" }}
                >
                    <option value="desc">Newest First</option>
                    <option value="asc">Oldest First</option>
                </select>
            </div>

            {/* PRODUCT TABLE */}
            <table>
                <thead>
                    <tr>
                        <th>Image</th>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Category</th>
                        <th>Description</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.length === 0 ? (
                        <tr>
                            <td colSpan="6" style={{ textAlign: "center" }}>
                                No products found
                            </td>
                        </tr>
                    ) : (
                        products.map((p) => (
                            <tr key={p._id}>
                                <td>
                                    {p.image ? (
                                        <img
                                            src={`http://localhost:5000${p.image}`}
                                            alt={p.name}
                                            width="50"
                                            height="50"
                                            style={{ objectFit: "cover", borderRadius: "4px" }}
                                        />
                                    ) : (
                                        "No Image"
                                    )}
                                </td>
                                <td>{p.name}</td>
                                <td>${p.price}</td>
                                <td>{p.category}</td>
                                <td>{p.description}</td>
                                <td>
                                    <button
                                        onClick={() => handleEdit(p)}
                                        style={{ background: "#eab308", marginRight: "5px" }}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(p._id)}
                                        style={{ background: "#dc2626" }}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            {/* PAGINATION */}
            <div style={{ textAlign: "center", margin: "20px" }}>
                <button
                    onClick={() => {
                        if (page > 1) {
                            setPage(page - 1);
                            fetchProducts(page - 1);
                        }
                    }}
                    disabled={page === 1}
                    style={{ marginRight: "10px" }}
                >
                    Previous
                </button>

                <span>
                    Page {page} of {totalPages}
                </span>

                <button
                    onClick={() => {
                        if (page < totalPages) {
                            setPage(page + 1);
                            fetchProducts(page + 1);
                        }
                    }}
                    disabled={page === totalPages}
                    style={{ marginLeft: "10px" }}
                >
                    Next
                </button>
            </div>
        </div>
    );
}

export default Products;
