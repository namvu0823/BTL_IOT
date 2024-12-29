
import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import avatar from '../../components/Assets/avatar.jpg';
import axios from 'axios';
import './AccessManagement.css';

library.add(fas);

const AccessManagement = () => {
    const [accessLogs, setAccessLogs] = useState([]);
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3;

    // Lấy dữ liệu từ API history
    const getHistory = () => {
        axios.get('http://localhost:3000/api/history')
            .then(response => {
                setAccessLogs(response.data.data);
            })
            .catch(error => {
                console.error('Lỗi khi lấy lịch sử:', error.message);
            });
    };

    // Lấy dữ liệu từ API users
    const getUsers = () => {
        axios.get('http://localhost:3000/api/users')
            .then(response => {
                setUsers(response.data.data); // Giả sử API trả về mảng user objects
            })
            .catch(error => {
                console.error('Lỗi khi lấy người dùng:', error.message);
            });
    };

    // Kết hợp dữ liệu userName vào accessLogs
    const mergeUserNames = () => {
      console.log(accessLogs);
      console.log(users);
        const updatedLogs = accessLogs.map(log => {
            const user = users.find(user => user.UID === log.UID); // Ghép theo UID
            return {
                ...log,
                name: user ? user.name : 'Không xác định', // Thêm userName
            };
        });
        setAccessLogs(updatedLogs);
    };

    useEffect(() => {
        getHistory();
        getUsers();
    }, []);

    useEffect(() => {
        if (users.length > 0 && accessLogs.length > 0) {
            mergeUserNames();
        }
    }, []);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentLogs = accessLogs.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(accessLogs.length / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleSearch = (e) => {
        const value = e.target.value.toLowerCase();
        setSearchTerm(value);

        const filteredLogs = accessLogs.filter((log) =>
            log.fullName.toLowerCase().includes(value) ||
            log.time_in.toLowerCase().includes(value) ||
            log.accessType.toLowerCase().includes(value) ||
            log.status.toString().toLowerCase().includes(value) ||
            log.device.toLowerCase().includes(value)
        );

        setAccessLogs(filteredLogs);
        setCurrentPage(1);
    };

    return (
        <div className='access-management'>
            <div className='access-management-title'>Lịch sử vào ra</div>

            <div className="search">
                <FontAwesomeIcon icon="fa-solid fa-magnifying-glass" />
                <input
                    type="text"
                    className="search-input"
                    placeholder="Tìm kiếm..."
                    value={searchTerm}
                    onChange={handleSearch}
                />
            </div>

            <table className='table-access'>
                <thead>
                    <tr>
                        <td>STT</td>
                        <td>#</td>
                        <td>Họ và tên</td>
                        <td>Giờ quét</td>
                        <td>Ngày quét</td>
                        <td>Trạng thái</td>
                        <td>Thiết bị</td>
                    </tr>
                </thead>
                <tbody>
                    {currentLogs.length > 0 ? (
                        currentLogs.map((log, index) => (
                            <tr key={index}>
                                <td>{indexOfFirstItem + index + 1}</td>
                                <td><img src={avatar} alt="Avatar" /></td>
                                <td>{log.name}</td>
                                                               
                                <td className='time-access'>{log.time_in ? new Date(log.time_in).toISOString().split('T')[1].substring(0,8) : 'Invalid Date'}
                                </td>
                                <td >
                                    {log.time_in ? new Date(log.time_in).toISOString().split('T')[0] : 'Invalid Date'}
                                </td>
                                <td>{log.status ? "Vào" : "Ra"}</td>
                                <td>{log.id_port}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="8" style={{ textAlign: 'center' }}>
                                Không có kết quả nào hiển thị
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            <div className="pagination">
                <button
                    className="page-button"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    {"Trước"}
                </button>
                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        key={index}
                        className={`page-button ${currentPage === index + 1 ? 'active' : ''}`}
                        onClick={() => handlePageChange(index + 1)}
                    >
                        {index + 1}
                    </button>
                ))}
                <button
                    className="page-button"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    {"Tiếp"}
                </button>
            </div>
        </div>
    );
};

export default AccessManagement;
