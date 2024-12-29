import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import './UserManagement.css';

const generateUID = () => Math.floor(Math.random() * 10000);

function UserManagement() {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [newUserName, setNewUserName] = useState("");
    const [newUserEmail, setNewUserEmail] = useState("");
    const [newUserUID, setNewUserUID] = useState("");
    const [newUserImage, setNewUserImage] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 4;

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/users');
                setUsers(response.data.data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, []);

    const handleAddUser = async () => {
        if (newUserName.trim() === "" || newUserEmail.trim() === "" || newUserUID.trim() === "") return;

        const newUser = {
            UID: newUserUID || generateUID(),
            avatar: newUserImage,
            name: newUserName,
            email: newUserEmail,
            finger: null,
            registration_status: 'Pending',
            date_create: new Date().toISOString(),
            date_update: new Date().toISOString(),
        };

        try {
            const response = await axios.post('http://localhost:3000/api/users', newUser);
            setUsers([...users, response.data.data]);
            resetForm();
        } catch (error) {
            console.error('Error adding user:', error);
        }
    };

    const handleDeleteUser = async (UID) => {
        try {
            await axios.delete(`http://localhost:3000/api/users/${UID}`);
            setUsers(users.filter(user => user.UID !== UID));
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    const resetForm = () => {
        setNewUserName("");
        setNewUserEmail("");
        setNewUserUID("");
        setNewUserImage(null);
        setModalOpen(false);
    };

    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser).filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const totalPages = Math.ceil(users.length / usersPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const nextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };
    
    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewUserImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className='container'>
            <h2>Danh sách người dùng</h2>
            <div className="first-row">
                <div className='search-user'>
                    <FontAwesomeIcon icon="fa-solid fa-magnifying-glass" />
                    <input 
                        type="text" 
                        className="search-input" 
                        placeholder="Tìm kiếm..." 
                        value={searchTerm}
                        onChange={handleSearch}
                    />   
                </div>
                <div className='button-container'>
                    <button onClick={() => setModalOpen(true)}>Thêm</button>
                </div>
            </div>

            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>UID</th>
                            <th>Email</th>
                            <th>Date Create</th>
                            <th>Date Updated</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentUsers.map(user => (
                            <tr key={user.UID}>
                                <td>{user.name}</td>
                                <td>{user.UID}</td>
                                <td>{user.email}</td>
                                <td>{user.date_create}</td>
                                <td>{user.date_update}</td>
                                <td>
                                    <button className="delete-button" onClick={() => handleDeleteUser(user.UID)}>Xóa</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Phân trang */}
            <div className="pagination">
                <button 
                    onClick={prevPage} 
                    disabled={currentPage === 1} 
                    className={currentPage === 1 ? "disabled" : ""}
                >
                    Trước
                </button>
                {Array.from({ length: totalPages }, (_, index) => (
                    <button 
                        key={index + 1} 
                        onClick={() => paginate(index + 1)} 
                        className={currentPage === index + 1 ? "active" : ""}
                    >
                        {index + 1}
                    </button>
                ))}
                <button 
                    onClick={nextPage} 
                    disabled={currentPage === totalPages} 
                    className={currentPage === totalPages ? "disabled" : ""}
                >
                    Sau
                </button>
            </div>

            {/* Modal */}
            {modalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={() => setModalOpen(false)}>&times;</span>
                        <h2 className="modal-title">Thêm Người Dùng</h2>
                        <input
                            className="modal-input"
                            type="text"
                            placeholder="Tên người dùng"
                            value={newUserName}
                            onChange={(e) => setNewUserName(e.target.value)}
                        />
                        <input
                            className="modal-input"
                            type="text"
                            placeholder="UID"
                            value={newUserUID}
                            onChange={(e) => setNewUserUID(e.target.value)}
                        />
                        <input
                            className="modal-input"
                            type="email"
                            placeholder="Email"
                            value={newUserEmail}
                            onChange={(e) => setNewUserEmail(e.target.value)}
                        />
                        <input
                            className="modal-input"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                        {newUserImage && (
                            <img src={newUserImage} alt="Preview" style={{ width: '100px', height: '100px', marginTop: '10px' }} />
                        )}
                        <button className="modal-button" onClick={handleAddUser}>Xác Nhận</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default UserManagement;