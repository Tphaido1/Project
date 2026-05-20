import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const OrderDetail = ({ token }) => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadOrder = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await fetch(`${API_URL}/api/orders/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || "Không tìm thấy đơn hàng.");
        }

        const data = await response.json();
        setOrder(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [id, token]);

  if (loading) {
    return <div className="order-page">Đang tải chi tiết đơn hàng...</div>;
  }

  if (error) {
    return (
      <div className="order-page">
        <div className="error">{error}</div>
        <Link to="/orders">Quay lại lịch sử đơn hàng</Link>
      </div>
    );
  }

  return (
    <div className="order-page">
      <h2>Chi tiết đơn hàng</h2>
      <div className="order-card">
        <p>
          <strong>Order ID:</strong> {order._id}
        </p>
        <p>
          <strong>Khách hàng:</strong> {order.user?.name || "N/A"}
        </p>
        <p>
          <strong>Email:</strong> {order.user?.email || "N/A"}
        </p>
        <p>
          <strong>Ngày đặt:</strong> {new Date(order.createdAt).toLocaleString()}
        </p>
        <p>
          <strong>Trạng thái:</strong> {order.status}
        </p>
        <p>
          <strong>Phương thức thanh toán:</strong> {order.paymentMethod}
        </p>
        <p>
          <strong>Tổng tiền:</strong> ${order.totalPrice}
        </p>
        <div className="order-section">
          <h4>Địa chỉ giao hàng</h4>
          <p>{order.shippingAddress?.address}</p>
          <p>{order.shippingAddress?.city}</p>
          <p>{order.shippingAddress?.postalCode}</p>
          <p>{order.shippingAddress?.phone}</p>
        </div>
        <div className="order-section">
          <h4>Sản phẩm</h4>
          <ul>
            {order.orderItems.map((item) => (
              <li key={item.id || item._id}>
                {item.name} x {item.quantity} = ${item.price * item.quantity}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <Link to="/orders">← Quay lại lịch sử đơn hàng</Link>
    </div>
  );
};

export default OrderDetail;
