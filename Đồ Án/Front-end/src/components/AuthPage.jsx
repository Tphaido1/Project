import { Link } from "react-router-dom";

const AuthPage = ({
  authMode,
  setAuthMode,
  authForm,
  handleAuthChange,
  handleAuthSubmit,
  authError,
  authSuccess,
  user,
}) => {
  return (
    <div className="auth-page">
      <div className="auth-panel">
        <div className="auth-tabs">
          <button
            className={authMode === "login" ? "active" : ""}
            onClick={() => setAuthMode("login")}
          >
            Đăng nhập
          </button>
          <button
            className={authMode === "register" ? "active" : ""}
            onClick={() => setAuthMode("register")}
          >
            Đăng ký
          </button>
        </div>

        {user ? (
          <div className="success">
            Bạn đã đăng nhập với email: {user.email}
            <div>
              <Link to="/">Quay lại trang chủ</Link>
            </div>
          </div>
        ) : (
          <form className="auth-form" onSubmit={handleAuthSubmit}>
            {authMode === "register" && (
              <label>
                Tên
                <input
                  type="text"
                  value={authForm.name}
                  onChange={(e) => handleAuthChange("name", e.target.value)}
                  required
                />
              </label>
            )}

            <label>
              Email
              <input
                type="email"
                value={authForm.email}
                onChange={(e) => handleAuthChange("email", e.target.value)}
                required
              />
            </label>

            <label>
              Mật khẩu
              <input
                type="password"
                value={authForm.password}
                onChange={(e) => handleAuthChange("password", e.target.value)}
                required
              />
            </label>

            <button type="submit" className="auth-submit">
              {authMode === "login" ? "Đăng nhập" : "Đăng ký"}
            </button>

            {authError && <div className="error">{authError}</div>}
            {authSuccess && <div className="success">{authSuccess}</div>}
          </form>
        )}
      </div>
    </div>
  );
};

export default AuthPage;
