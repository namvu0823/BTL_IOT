import { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import './UserList.css'

library.add(fas);

const UserManagement = () => {

    const [users, setUsers] = useState([]);  // Initial state as an empty array
    const [filteredUsers, setFilteredUsers] = useState([]);  // State for filtered users

    const getUsers = () => {
        axios.get('http://localhost:3000/api/users')
            .then(response => {
                console.log(response.data);  // Process the fetched data
                setUsers(response.data.data);
                setFilteredUsers(response.data.data);  // Initially set filtered users to all users
            })
            .catch(error => {
                console.error('There was a problem with the request:', error.message);
            });
    };

    useEffect(() => {
        getUsers();
    }, []);

    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 4;

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);  // Apply pagination on filtered users

    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleSearch = (e) => {
        const value = e.target.value.toLowerCase();
        setSearchTerm(value);

        // Filter users based on search term
        const filterUsers = users.filter((user) => {
            return (
                (user.UID && user.UID.toLowerCase().includes(value)) ||
                (user.date_created && user.date_created.toLowerCase().includes(value)) ||
                (user.date_update && user.date_update.toLowerCase().includes(value)) ||
                (user.name && user.name.toLowerCase().includes(value)) ||
                (user.email && user.email.toLowerCase().includes(value))
            );
        });

        setFilteredUsers(filterUsers);  // Update filtered users state
        setCurrentPage(1);  // Reset to the first page when performing a search
    };

    return (
        <>
            <div className="user-management">
                <div className="user-management-title">Danh sách người dùng</div>

                <div className="search">
                    <FontAwesomeIcon icon="fa-solid fa-magnifying-glass" />
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Tìm kiếm ..."
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                </div>

                <table className="table-user">
                    <thead>
                        <tr>
                            <td>STT</td>
                            <td>Họ tên</td>
                            <td>UID</td>
                            <td>Email</td>
                            <td>Ngày đăng ký</td>
                        </tr>
                    </thead>
                    <tbody>
                        {currentUsers.length > 0 ? (
                            currentUsers.map((user, index) => (
                                <tr key={user.UID}>
                                    <td>{index + 1}</td>
                                    <td>{user.name}</td>
                                    <td>{user.UID}</td>
                                    <td>{user.email}</td>
                                    <td>{user.date_create}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" style={{ textAlign: 'center' }}>
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
                        Trước
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
                        Sau
                    </button>
                </div>
            </div>
        </>
    );
};

export default UserManagement;
