import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "./Login.css"; // Tạo tệp CSS nếu cần

function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // Khởi tạo useNavigate

  const handleLogin = () => {
    // Kiểm tra tên đăng nhập và mật khẩu
    if (username === "admin" && password === "password") {
      onLogin(); // Gọi hàm khi đăng nhập thành công
      navigate("/"); // Chuyển hướng về trang chính
    } else {
      alert("Đăng nhập không thành công!");
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleLogin(); // Gọi hàm đăng nhập khi nhấn Enter
    }
  };

  return (
      <div className="login-app-container">
          <div className="login-container">
              <h2>Đăng Nhập</h2>
              <input
                  type="text"
                  placeholder="Tên đăng nhập"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyPress={handleKeyPress}
              />
              <input
                  type="password"
                  placeholder="Mật khẩu"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={handleKeyPress}
              />
              <button className='login_button'onClick={handleLogin}>Đăng Nhập</button>
          </div>
      </div>
  );
}

export default Login;