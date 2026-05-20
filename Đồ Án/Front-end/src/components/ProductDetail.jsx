import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const ProductDetail = ({ addToCart }) => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`${API_URL}/api/products/${id}`);
        if (!response.ok) {
          throw new Error("Không tìm thấy sản phẩm.");
        }
        const data = await response.json();
        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return <div className="product-detail">Đang tải sản phẩm...</div>;
  }

  if (error) {
    return (
      <div className="product-detail">
        <p className="error">{error}</p>
        <Link to="/">Quay lại trang chủ</Link>
      </div>
    );
  }

  return (
    <div className="product-detail">
      <Link to="/">← Quay lại trang chủ</Link>
      <h2>{product.name}</h2>
      <img src={product.image} alt={product.name} />
      <p>{product.description || "No description available."}</p>
      <p>Giá: ${product.price}</p>
      <p>Danh mục: {product.category || "N/A"}</p>
      <p>Kho hàng: {product.stock ?? "Chưa cập nhật"}</p>
      <div className="detail-actions">
        <button onClick={() => addToCart(product)}>Add To Cart</button>
        <Link to="/orders" className="details-link">
          Xem lịch sử đơn hàng
        </Link>
      </div>
    </div>
  );
};

export default ProductDetail;
