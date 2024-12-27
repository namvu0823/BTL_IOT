import React, { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './UserManagement.css';

const generateUID = () => Math.floor(Math.random() * 10000);

function UserManagement() {
    const [users, setUsers] = useState([
        { id: 1, name: "Nguyen Van A", uid: generateUID(), email: "a@example.com", fingerprint: "✔️", dateUpdated: "15/04/2024" },
        { id: 2, name: "Tran Thi B", uid: generateUID(), email: "b@example.com", fingerprint: "✔️", dateUpdated: "15/04/2024" },
        { id: 3, name: "Nguyen Van C", uid: generateUID(), email: "c@example.com", fingerprint: "✔️", dateUpdated: "15/04/2024" },
        { id: 4, name: "Tran Thi D", uid: generateUID(), email: "d@example.com", fingerprint: "✔️", dateUpdated: "15/04/2024" },
        { id: 5, name: "Nguyen Van E", uid: generateUID(), email: "e@example.com", fingerprint: "✔️", dateUpdated: "15/04/2024" },
        { id: 6, name: "Tran Thi F", uid: generateUID(), email: "f@example.com", fingerprint: "✔️", dateUpdated: "15/04/2024" },
        { id: 7, name: "Nguyen Van G", uid: generateUID(), email: "g@example.com", fingerprint: "✔️", dateUpdated: "15/04/2024" },
        { id: 8, name: "Tran Thi H", uid: generateUID(), email: "h@example.com", fingerprint: "✔️", dateUpdated: "15/04/2024" },
        { id: 9, name: "Nguyen Van I", uid: generateUID(), email: "i@example.com", fingerprint: "✔️", dateUpdated: "15/04/2024" },
    ]);

    const [searchTerm, setSearchTerm] = useState("");
    const [newUserName, setNewUserName] = useState("");
    const [newUserEmail, setNewUserEmail] = useState("");
    const [newUserUID, setNewUserUID] = useState("");
    const [newUserImage, setNewUserImage] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 4;

    const handleAddUser = () => {
        if (newUserName.trim() === "" || newUserEmail.trim() === "") return;

        const newUser = {
            id: users.length + 1,
            name: newUserName,
            uid: generateUID(),
            email: newUserEmail,
            fingerprint: "✔️",
            dateUpdated: new Date().toLocaleDateString(),
            image: newUserImage,
        };

        setUsers([...users, newUser]);
        setNewUserName("");
        setNewUserEmail("");
        setNewUserUID("");
        setNewUserImage(null);
        setModalOpen(false);
    };

    const handleDeleteUser = (id) => {
        setUsers(users.filter(user => user.id !== id));
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
                            <th>Date Updated</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentUsers.map(user => (
                            <tr key={user.id}>
                                <td>{user.name}</td>
                                <td>{user.uid}</td>
                                <td>{user.email}</td>
                                <td>{user.dateUpdated}</td>
                                <td>
                                    <button className="delete-button" onClick={() => handleDeleteUser(user.id)}>Xóa</button>
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