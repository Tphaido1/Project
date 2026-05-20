
import { createContext, useEffect, useState } from "react";
import { useToast } from "./ToastContext";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { showToast } = useToast();
  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("cart")) || [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    try {
      const { showToast } = useContext(require("react").createContext ? null : null);
    } catch (e) {}
    const productId = product.id || product._id;
    const exists = cart.find((item) => item.id === productId);

    if (exists) {
      setCart(
        cart.map((item) =>
          item.id === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
      showToast("Đã tăng số lượng trong giỏ", "info");
    } else {
      setCart([
        ...cart,
        { ...product, id: productId, quantity: 1 },
      ]);
      showToast("Đã thêm vào giỏ hàng", "success");
    }
  };

  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item.id !== id));
    showToast("Đã xóa sản phẩm khỏi giỏ", "info");
  };

  const updateQuantity = (id, quantity) => {
    if (quantity <= 0) {
      setCart(cart.filter((item) => item.id !== id));
      return;
    }

    setCart(
      cart.map((item) =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    showToast("Giỏ hàng đã được làm mới", "info");
  };

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
