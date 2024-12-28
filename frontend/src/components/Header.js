import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import './Header.css';

library.add(fas);

const Header = ({ onLogout, savedPassword, setSavedPassword, setIsPasswordChanged }) => {
  const [showOptions, setShowOptions] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleMouseOver = () => {
    setShowOptions(true);
  };

  const handleMouseOut = () => {
    setShowOptions(false);
  };

  const handleChangePassword = () => {
    // Kiểm tra xem mật khẩu mới và xác nhận mật khẩu có khớp không
    if (newPassword.trim() === '' || confirmPassword.trim() === '' || oldPassword.trim() === '') {
        alert('Vui lòng điền đầy đủ các trường.');
        return;
    }
  
    if (newPassword !== confirmPassword) {
        alert('Mật khẩu mới và xác nhận mật khẩu không khớp!');
        return;
    }
  
    // Kiểm tra mật khẩu cũ
    if (oldPassword !== savedPassword) {
        alert('Mật khẩu cũ không chính xác!');
        return;
    }
  
    // Cập nhật mật khẩu mới
    setSavedPassword(newPassword);
    setIsPasswordChanged(true); // Đánh dấu mật khẩu đã thay đổi
  
    // In mật khẩu mới ra console
    console.log("Mật khẩu mới đã được đặt:", newPassword);
  
    // Đặt lại các trường nhập
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setShowModal(false); // Đóng modal
  
    alert('Mật khẩu đã được thay đổi thành công!'); // Thông báo thành công
  };
  
  return (
    <div className='header'>
      <div className='logo-header'>
        <FontAwesomeIcon icon="fa-solid fa-fingerprint" />
        <div className='logo-header-title'>Acheckin</div>
      </div>
      <div className='user' onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
        <div className='user-name'>Khánh Ly</div>
        <FontAwesomeIcon icon="fa-solid fa-user" />
        {showOptions && (
          <div className='user-options'>
            <button className='option-button' onClick={() => setShowModal(true)}>Thay đổi mật khẩu đăng nhập</button>
            <button className='option-button' onClick={() => setShowModal(true)}>Thay đổi mật khẩu cổng</button>
            <button className='option-button' onClick={onLogout}>Đăng xuất</button>
          </div>
        )}
      </div>

      {/* Modal thay đổi mật khẩu */}
      {showModal && (
        <div className='modal'>
          <div className='modal-content-change-password'>
            <span className='close' onClick={() => setShowModal(false)}>&times;</span>
            <h2>Thay đổi mật khẩu</h2>
            <label className='label-input'>Nhập mật khẩu cũ:</label>
            <input
              type='password'
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
            <label className='label-input'>Nhập mật khẩu mới:</label>
            <input
              type='password'
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <label className='label-input'>Nhập lại mật khẩu mới:</label>
            <input
              type='password'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <div className='button-container'>
              <button onClick={handleChangePassword}>Lưu</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Header;