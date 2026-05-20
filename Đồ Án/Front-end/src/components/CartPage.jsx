import { Link } from "react-router-dom";

const CartPage = ({
  cart,
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  totalPrice,
  shippingInfo,
  handleShippingChange,
  handleCheckout,
  checkoutMessage,
  checkoutError,
}) => {
  return (
    <div className="cart-page">
      <div className="cart-box">
        <h2>Shopping Cart</h2>

        {cart.length === 0 ? (
          <div>
            <p>Chưa có sản phẩm trong giỏ.</p>
            <Link to="/">Tiếp tục mua sắm</Link>
          </div>
        ) : (
          cart.map((item) => (
            <div className="cart-item" key={item.id}>
              <div className="cart-item-info">
                <span>{item.name}</span>
                <div className="quantity-controls">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) =>
                      updateQuantity(item.id, Number(e.target.value))
                    }
                  />
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>
              </div>

              <button onClick={() => removeFromCart(item.id)}>
                Remove
              </button>
            </div>
          ))
        )}

        <h3>Total: ${totalPrice}</h3>

        <div className="checkout-form">
          <h3>Thông tin giao hàng</h3>
          <label>
            Địa chỉ
            <input
              value={shippingInfo.address}
              onChange={(e) => handleShippingChange("address", e.target.value)}
              required
            />
          </label>
          <label>
            Thành phố
            <input
              value={shippingInfo.city}
              onChange={(e) => handleShippingChange("city", e.target.value)}
              required
            />
          </label>
          <label>
            Mã bưu điện
            <input
              value={shippingInfo.postalCode}
              onChange={(e) => handleShippingChange("postalCode", e.target.value)}
              required
            />
          </label>
          <label>
            Số điện thoại
            <input
              value={shippingInfo.phone}
              onChange={(e) => handleShippingChange("phone", e.target.value)}
              required
            />
          </label>
          <label>
            Phương thức thanh toán
            <select
              value={shippingInfo.paymentMethod}
              onChange={(e) => handleShippingChange("paymentMethod", e.target.value)}
            >
              <option value="Cash">Cash</option>
              <option value="Card">Card</option>
            </select>
          </label>
        </div>

        <button className="checkout-button" onClick={handleCheckout}>
          Place Order
        </button>

        {checkoutMessage && <div className="success">{checkoutMessage}</div>}
        {checkoutError && <div className="error">{checkoutError}</div>}
      </div>
    </div>
  );
};

export default CartPage;
