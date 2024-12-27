import React, { useState } from "react";
import './UserManagement.css';

const generateUID = () => Math.floor(Math.random() * 10000);

function UserManagement() {
    const [users, setUsers] = useState([
        { id: 1, name: "Nguyen Van A", uid: generateUID(), email: "a@example.com", fingerprint: "✔️", dateUpdated: "15/04/2024" },
        { id: 2, name: "Tran Thi B", uid: generateUID(), email: "b@example.com", fingerprint: "✔️", dateUpdated: "15/04/2024" },
    ]);
    const [newUserName, setNewUserName] = useState("");
    const [newUserEmail, setNewUserEmail] = useState("");
    const [modalOpen, setModalOpen] = useState(false);

    const handleAddUser = () => {
        if (newUserName.trim() === "" || newUserEmail.trim() === "") return;

        const newUser = {
            id: users.length + 1,
            name: newUserName,
            uid: generateUID(),
            email: newUserEmail,
            fingerprint: "✔️",
            dateUpdated: new Date().toLocaleDateString(),
        };

        setUsers([...users, newUser]);
        setNewUserName("");
        setNewUserEmail("");
        setModalOpen(false); // Đóng modal
    };

    const handleDeleteUser = (id) => {
        setUsers(users.filter(user => user.id !== id));
    };

    return (
        <div className='container'>
            <h2>Danh sách người dùng</h2>
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>UID</th>
                            <th>Email</th>
                            <th>Fingerprint</th>
                            <th>Date Updated</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id}>
                                <td>{user.name}</td>
                                <td>{user.uid}</td>
                                <td>{user.email}</td>
                                <td>{user.fingerprint}</td>
                                <td>{user.dateUpdated}</td>
                                <td>
                                    <button className="delete-button" onClick={() => handleDeleteUser(user.id)}>Xóa</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className='button-container'>
                <button onClick={() => setModalOpen(true)}>Thêm</button>
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
                            type="email"
                            placeholder="Email"
                            value={newUserEmail}
                            onChange={(e) => setNewUserEmail(e.target.value)}
                        />
                        <button className="modal-button" onClick={handleAddUser}>Xác Nhận</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default UserManagement;