import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import "./Login.css"; 

function Login({ onLogin, savedPassword, isPasswordChanged }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); 
  const navigate = useNavigate(); 

  const handleLogin = () => {
    console.log("Tên đăng nhập:", username);
    console.log("Mật khẩu nhập:", password);
    console.log("Mật khẩu đã lưu:", savedPassword);
    console.log("Mật khẩu đã thay đổi:", isPasswordChanged);

    if (username === "admin") {
        if (isPasswordChanged && password === savedPassword) {
            onLogin();
            navigate("/"); // Chuyển hướng về trang chính
        } else if (!isPasswordChanged && password === "password") {
            onLogin();
            navigate("/"); // Chuyển hướng về trang chính
        } else {
            alert("Mật khẩu không chính xác!");
        }
    } else {
        alert("Tên đăng nhập không chính xác!");
    }
};

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleLogin(); 
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
                  type={showPassword ? "text" : "password"}
                  placeholder="Mật khẩu"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={handleKeyPress}
              />
              <div className='check-box-container'>
                  <input 
                      className='check-box'
                      type="checkbox"
                      checked={showPassword}
                      onChange={() => setShowPassword(!showPassword)} 
                  />
                  <label className='label-check-box'>Hiện mật khẩu</label>
              </div>
              <button className='login_button' onClick={handleLogin}>Đăng Nhập</button>
          </div>
      </div>
  );
}

export default Login;