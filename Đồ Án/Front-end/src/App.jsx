
import { useContext, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import "./index.css";
import fallbackProducts from "./data";
import { CartContext } from "./context/CartContext";
import ProductDetail from "./components/ProductDetail";
import OrderHistory from "./components/OrderHistory";
import Profile from "./components/Profile";
import AdminProducts from "./components/AdminProducts";
import AdminOrders from "./components/AdminOrders";
import AdminUsers from "./components/AdminUsers";
import OrderDetail from "./components/OrderDetail";
import AuthPage from "./components/AuthPage";
import CartPage from "./components/CartPage";
import { useToast } from "./context/ToastContext";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function App() {
  const {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalPrice,
  } = useContext(CartContext);
  const { showToast } = useToast();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [error, setError] = useState("");
  const [checkoutMessage, setCheckoutMessage] = useState("");
  const [checkoutError, setCheckoutError] = useState("");
  const [authMode, setAuthMode] = useState("login");
  const [token, setToken] = useState(
    localStorage.getItem("token") || ""
  );
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );
  const [authForm, setAuthForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [authError, setAuthError] = useState("");
  const [authSuccess, setAuthSuccess] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortOption, setSortOption] = useState("newest");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [itemsPerPage] = useState(8);
  const [shippingInfo, setShippingInfo] = useState({
    address: "",
    city: "",
    postalCode: "",
    phone: "",
    paymentMethod: "Cash",
  });

  useEffect(() => {
    const loadProducts = async () => {
      setLoadingProducts(true);
      setError("");
      try {
        const params = new URLSearchParams();
        if (searchTerm) params.set("search", searchTerm);
        if (selectedCategory !== "all") params.set("category", selectedCategory);
        params.set("sort", sortOption);
        params.set("page", page);
        params.set("limit", itemsPerPage);

        const response = await fetch(`${API_URL}/api/products?${params.toString()}`);
        if (!response.ok) {
          throw new Error("Không tải được sản phẩm từ backend.");
        }

        const data = await response.json();
        setProducts(data.products);
        setPages(data.pages || 1);
      } catch (err) {
        setError(
          "Không lấy được dữ liệu từ backend. Hiển thị sản phẩm mẫu."
        );
        setProducts(fallbackProducts);
        setPages(1);
      } finally {
        setLoadingProducts(false);
      }
    };

    loadProducts();
  }, [searchTerm, selectedCategory, sortOption, page, itemsPerPage]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await fetch(`${API_URL}/api/products/categories`);
        if (!response.ok) {
          throw new Error("Không tải được danh mục.");
        }
        const data = await response.json();
        setCategories(data);
      } catch {
        setCategories(
          Array.from(
            new Set(fallbackProducts.map((product) => product.category).filter(Boolean))
          )
        );
      }
    };

    loadCategories();
  }, []);

  const searchSource = products.length ? products : fallbackProducts;
  const suggestions = searchTerm
    ? searchSource
        .filter((product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .slice(0, 5)
    : [];

  const handleAuthChange = (field, value) => {
    setAuthForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    setPage(1);
    setShowSuggestions(true);
  };

  const handleSearchSubmit = () => {
    setPage(1);
    setShowSuggestions(false);
  };

  const handleSearchSelect = (value) => {
    setSearchTerm(value);
    setPage(1);
    setShowSuggestions(false);
  };

  const handleShippingChange = (field, value) => {
    setShippingInfo((prev) => ({ ...prev, [field]: value }));
  };

  const handleAuthSubmit = async (event) => {
    event.preventDefault();
    setAuthError("");
    setAuthSuccess("");

    const endpoint = authMode === "login" ? "login" : "register";
    const payload = {
      email: authForm.email,
      password: authForm.password,
    };

    if (authMode === "register") {
      payload.name = authForm.name;
    }

    try {
      const response = await fetch(`${API_URL}/api/auth/${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Lỗi xác thực");
      }

      if (authMode === "login") {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setToken(data.token);
        setUser(data.user);
        setAuthSuccess("Đăng nhập thành công!");
        showToast("Đăng nhập thành công", "success");
      } else {
        setAuthSuccess("Đăng ký thành công! Vui lòng đăng nhập.");
        setAuthMode("login");
      }
      setAuthForm({ name: "", email: "", password: "" });
    } catch (err) {
      setAuthError(err.message);
      showToast(err.message || "Lỗi xác thực", "error");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken("");
    setUser(null);
    setAuthSuccess("Đã đăng xuất.");
  };

  const handleCheckout = async () => {
    setCheckoutError("");
    setCheckoutMessage("");
    if (!token) {
      setCheckoutError("Vui lòng đăng nhập để thanh toán.");
      return;
    }

    if (cart.length === 0) {
      setCheckoutError("Giỏ hàng đang trống.");
      return;
    }

    if (!shippingInfo.address || !shippingInfo.city || !shippingInfo.postalCode || !shippingInfo.phone) {
      setCheckoutError("Vui lòng điền đầy đủ thông tin giao hàng.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          orderItems: cart,
          totalPrice,
          shippingAddress: {
            address: shippingInfo.address,
            city: shippingInfo.city,
            postalCode: shippingInfo.postalCode,
            phone: shippingInfo.phone,
          },
          paymentMethod: shippingInfo.paymentMethod,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Lỗi khi tạo đơn hàng.");
      }

      await response.json();
      clearCart();
      setShippingInfo({
        address: "",
        city: "",
        postalCode: "",
        phone: "",
        paymentMethod: "Cash",
      });
      setCheckoutMessage("Đặt hàng thành công!");
      showToast("Đặt hàng thành công", "success");
    } catch (err) {
      setCheckoutError(`Lỗi: ${err.message}`);
      showToast(err.message || "Lỗi khi đặt hàng", "error");
    }
  };

  const HomePage = () => (
    <>
      <div className="hero">
        <h1>Welcome To StarShop</h1>
        <p>Modern Tech Store</p>
      </div>

      <div className="page-filter-bar">
        <div className="category-chips">
          <button
            className={selectedCategory === "all" ? "chip active" : "chip"}
            onClick={() => {
              setSelectedCategory("all");
              setPage(1);
            }}
          >
            Tất cả
          </button>
          {categories.map((category) => (
            <button
              key={category}
              className={
                selectedCategory === category ? "chip active" : "chip"
              }
              onClick={() => {
                setSelectedCategory(category);
                setPage(1);
              }}
            >
              {category}
            </button>
          ))}
        </div>
        <label className="sort-select compact">
          Sắp xếp
          <select
            value={sortOption}
            onChange={(e) => {
              setSortOption(e.target.value);
              setPage(1);
            }}
          >
            <option value="newest">Mới nhất</option>
            <option value="priceAsc">Giá: Thấp đến cao</option>
            <option value="priceDesc">Giá: Cao đến thấp</option>
            <option value="nameAsc">Tên: A - Z</option>
            <option value="nameDesc">Tên: Z - A</option>
          </select>
        </label>
      </div>

      {loadingProducts ? (
        <div className="loading">Đang tải sản phẩm...</div>
      ) : (
        <>
          {products.length === 0 ? (
            <div className="loading">Không có sản phẩm phù hợp.</div>
          ) : (
            <>
              <div className="grid">
                {products.map((product) => (
                  <div className="card" key={product._id || product.id}>
                    <img src={product.image} alt={product.name} />

                    <h2>{product.name}</h2>

                    <p>${product.price}</p>

                    <div className="card-actions">
                      <button onClick={() => addToCart(product)}>
                        Add To Cart
                      </button>
                      <Link
                        className="details-link"
                        to={`/product/${product._id || product.id}`}
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

              {pages > 1 && (
                <div className="pagination">
                  <button
                    disabled={page <= 1}
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  >
                    Trước
                  </button>
                  {Array.from({ length: pages }, (_, index) => (
                    <button
                      key={index}
                      className={page === index + 1 ? "page-button active" : "page-button"}
                      onClick={() => setPage(index + 1)}
                    >
                      {index + 1}
                    </button>
                  ))}
                  <button
                    disabled={page >= pages}
                    onClick={() => setPage((prev) => Math.min(prev + 1, pages))}
                  >
                    Sau
                  </button>
                </div>
              )}
            </>
          )}
        </>
      )}

      {error && <div className="error">{error}</div>}
    </>
  );

  return (
    <BrowserRouter>
      <nav className="navbar">
        <Link to="/" className="brand">
          StarShop
        </Link>
        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/cart">Cart</Link>
          <Link to="/orders">Order History</Link>
          {!user && <Link to="/auth">Login</Link>}
          {user && <Link to="/profile">Profile</Link>}
          {user?.isAdmin && <Link to="/admin/products">Admin</Link>}
          {user?.isAdmin && <Link to="/admin/orders">Orders</Link>}
          {user?.isAdmin && <Link to="/admin/users">Users</Link>}
        </div>

        <div className="nav-search">
          <div className="nav-search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Tìm sản phẩm..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              onKeyDown={(e) => e.key === "Enter" && handleSearchSubmit()}
            />
            <button className="search-button" onClick={handleSearchSubmit}>
              Search
            </button>
          </div>
          {showSuggestions && suggestions.length > 0 && (
            <div className="nav-suggestions">
              {suggestions.map((product) => (
                <button
                  key={product._id || product.id}
                  type="button"
                  className="suggestion-item"
                  onClick={() => handleSearchSelect(product.name)}
                >
                  {product.name}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="user-actions">
          {user ? (
            <>
              <span>Xin chào, {user.name}</span>
              <button className="auth-logout" onClick={handleLogout}>
                Đăng xuất
              </button>
            </>
          ) : (
            <span>Chưa đăng nhập</span>
          )}
          <span className="cart-count">Cart ({cart.length})</span>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/auth"
          element={
            <AuthPage
              authMode={authMode}
              setAuthMode={setAuthMode}
              authForm={authForm}
              handleAuthChange={handleAuthChange}
              handleAuthSubmit={handleAuthSubmit}
              authError={authError}
              authSuccess={authSuccess}
              user={user}
            />
          }
        />
        <Route
          path="/cart"
          element={
            <CartPage
              cart={cart}
              addToCart={addToCart}
              removeFromCart={removeFromCart}
              updateQuantity={updateQuantity}
              clearCart={clearCart}
              totalPrice={totalPrice}
              shippingInfo={shippingInfo}
              handleShippingChange={handleShippingChange}
              handleCheckout={handleCheckout}
              checkoutMessage={checkoutMessage}
              checkoutError={checkoutError}
            />
          }
        />
        <Route
          path="/product/:id"
          element={<ProductDetail addToCart={addToCart} />}
        />
        <Route
          path="/orders"
          element={<OrderHistory token={token} />}
        />
        <Route
          path="/orders/:id"
          element={<OrderDetail token={token} />}
        />
        <Route
          path="/profile"
          element={<Profile token={token} />}
        />
        <Route
          path="/admin/products"
          element={<AdminProducts token={token} user={user} />}
        />
        <Route
          path="/admin/orders"
          element={<AdminOrders token={token} user={user} />}
        />
        <Route
          path="/admin/users"
          element={<AdminUsers token={token} user={user} />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
