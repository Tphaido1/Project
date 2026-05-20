import { useEffect, useState } from "react";
import { useToast } from "../context/ToastContext";
import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const AdminProducts = ({ token, user }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { showToast } = useToast();
  const [form, setForm] = useState({
    name: "",
    price: "",
    image: "",
    category: "",
    description: "",
    stock: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_URL}/api/products?limit=1000&page=1`);
        if (!response.ok) {
          throw new Error("Không thể tải sản phẩm.");
        }
        const data = await response.json();
        setProducts(data.products || data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setForm({
      name: "",
      price: "",
      image: "",
      category: "",
      description: "",
      stock: "",
    });
    setImageFile(null);
    setEditingId(null);
    setError("");
    setSuccess("");
  };

  const openModal = (product = null) => {
    if (product) {
      setEditingId(product._id || product.id);
      setForm({
        name: product.name || "",
        price: product.price?.toString() || "",
        image: product.image || "",
        category: product.category || "",
        description: product.description || "",
        stock: product.stock?.toString() || "",
      });
      setImageFile(null);
    } else {
      resetForm();
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    resetForm();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    const method = editingId ? "PUT" : "POST";
    const url = editingId
      ? `${API_URL}/api/products/${editingId}`
      : `${API_URL}/api/products`;

    try {
      let imageUrl = form.image;
      if (imageFile) {
        const fd = new FormData();
        fd.append("image", imageFile);
        const upResp = await fetch(`${API_URL}/api/upload`, {
          method: "POST",
          body: fd,
        });
        if (!upResp.ok) {
          const d = await upResp.json();
          throw new Error(d.message || "Không upload ảnh được");
        }
        const upData = await upResp.json();
        imageUrl = upData.url;
      }
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...form,
          image: imageUrl,
          price: Number(form.price),
          stock: Number(form.stock),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Lỗi khi lưu sản phẩm.");
      }

      const data = await response.json();
      if (editingId) {
        setProducts((prev) =>
          prev.map((item) => (item._id === data._id ? data : item))
        );
        setSuccess("Cập nhật sản phẩm thành công.");
        showToast("Cập nhật sản phẩm thành công", "success");
      } else {
        setProducts((prev) => [...prev, data]);
        setSuccess("Tạo sản phẩm thành công.");
        showToast("Tạo sản phẩm thành công", "success");
      }
      closeModal();
    } catch (err) {
      setError(err.message);
      try { showToast(err.message || "Lỗi khi lưu sản phẩm", "error"); } catch(e){}
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${API_URL}/api/products/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Không xóa được sản phẩm.");
      }

      setProducts((prev) => prev.filter((item) => item._id !== id));
      setSuccess("Xóa sản phẩm thành công.");
      setError("");
      showToast("Xóa sản phẩm thành công", "success");
    } catch (err) {
      setError(err.message);
      showToast(err.message || "Không xóa được sản phẩm", "error");
    }
  };

  if (!user?.isAdmin) {
    return (
      <div className="order-page">
        <p>Bạn cần quyền admin để truy cập trang quản lý sản phẩm.</p>
        <Link to="/">Quay lại trang chủ</Link>
      </div>
    );
  }

  return (
    <div className="order-page">
      <h2>Quản lý sản phẩm</h2>
      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}
      <button className="admin-add-button" onClick={() => openModal()}>
        Tạo sản phẩm mới
      </button>

      {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : (
        <div className="order-list">
          {products.map((product) => (
            <div className="order-card" key={product._id || product.id}>
              <h3>{product.name}</h3>
              <p>Giá: ${product.price}</p>
              <p>Danh mục: {product.category || "Chưa có"}</p>
              <p>Kho: {product.stock || 0}</p>
              <div className="admin-actions">
                <button onClick={() => openModal(product)}>Sửa</button>
                <button onClick={() => handleDelete(product._id || product.id)}>
                  Xóa
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>{editingId ? "Sửa sản phẩm" : "Tạo sản phẩm mới"}</h3>
            <form className="auth-form" onSubmit={handleSubmit}>
              <label>
                Tên
                <input
                  value={form.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  required
                />
              </label>
              <label>
                Giá
                <input
                  type="number"
                  value={form.price}
                  onChange={(e) => handleChange("price", e.target.value)}
                  required
                />
              </label>
              <label>
                Ảnh (upload hoặc URL)
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files[0])}
                />
                <input
                  placeholder="Hoặc dán URL ảnh"
                  value={form.image}
                  onChange={(e) => handleChange("image", e.target.value)}
                />
              </label>
              <label>
                Danh mục
                <input
                  value={form.category}
                  onChange={(e) => handleChange("category", e.target.value)}
                />
              </label>
              <label>
                Mô tả
                <input
                  value={form.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                />
              </label>
              <label>
                Kho
                <input
                  type="number"
                  value={form.stock}
                  onChange={(e) => handleChange("stock", e.target.value)}
                />
              </label>
              <div className="admin-actions">
                <button type="submit">
                  {editingId ? "Cập nhật" : "Tạo"}
                </button>
                <button type="button" onClick={closeModal}>
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
