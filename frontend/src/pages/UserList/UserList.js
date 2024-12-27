import { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import './UserList.css'

library.add(fas);

const UserManagement = () => {
    const userExample = [
        {
          "UID": "user1",
          "date_update": "2024-12-23",
          "date_created": "2024-01-01",
          "name": "Nguyễn Văn A",
          "email": "user1@example.com"
        },
        {
          "UID": "user2",
          "date_update": "2024-12-23",
          "date_created": "2024-01-02",
          "name": "Trần Thị B",
          "email": "user2@example.com"
        },
        {
          "UID": "user3",
          "date_update": "2024-12-23",
          "date_created": "2024-01-03",
          "name": "Phạm Minh C",
          "email": "user3@example.com"
        },
        {
          "UID": "user4",
          "date_update": "2024-12-23",
          "date_created": "2024-01-04",
          "name": "Lê Hoàng D",
          "email": "user4@example.com"
        },
        {
          "UID": "user5",
          "date_update": "2024-12-23",
          "date_created": "2024-01-05",
          "name": "Võ Thị E",
          "email": "user5@example.com"
        },
        {
          "UID": "user6",
          "date_update": "2024-12-23",
          "date_created": "2024-01-06",
          "name": "Nguyễn Thị F",
          "email": "user6@example.com"
        },
        {
          "UID": "user7",
          "date_update": "2024-12-23",
          "date_created": "2024-01-07",
          "name": "Trần Minh G",
          "email": "user7@example.com"
        },
        {
          "UID": "user8",
          "date_update": "2024-12-23",
          "date_created": "2024-01-08",
          "name": "Lê Thị H",
          "email": "user8@example.com"
        },
        {
          "UID": "user9",
          "date_update": "2024-12-23",
          "date_created": "2024-01-09",
          "name": "Võ Minh I",
          "email": "user9@example.com"
        },
        {
          "UID": "user10",
          "date_update": "2024-12-23",
          "date_created": "2024-01-10",
          "name": "Nguyễn Minh J",
          "email": "user10@example.com"
        }
    ];

    const [users, setUsers] = useState([]);
    useEffect(()=>{
        setUsers(userExample);
    }, []);

    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 4;

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentUsers = users.slice(indexOfFirstItem, indexOfLastItem);

    
    const totalPages = Math.ceil(users.length/ itemsPerPage);

    const handlePageChange = (pageNumber) => {
      setCurrentPage(pageNumber);
    }

    const handleSearch = (e) => {
      const value = e.target.value.toLowerCase();
      setSearchTerm(value);
      const filterUsers = userExample.filter((user)=>{
        return (
          user.UID.toLocaleLowerCase().includes(value)||
          user.date_created.toLocaleLowerCase().includes(value)||
          user.date_update.toLocaleLowerCase().includes(value)||
          user.name.toLocaleLowerCase().includes(value)||
          user.email.toLocaleLowerCase().includes(value)
        )
      })

      setUsers(filterUsers);
      setCurrentPage(1);
    }
      
    return (<>
        <div className="user-management">
            <div className="user-management-title">Danh sách người dùng</div>

            <div className="search">
              <FontAwesomeIcon icon="fa-solid fa-magnifying-glass" />
              <input 
                type="text"
                className="search-input"
                placeholder="Tim kiem ..."
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
                  <td>Ngày cập nhật</td>
                  <td>Xem chi tiết</td>
                </tr>
              </thead>
              <tbody>
                {currentUsers.length>0 ? (
                    currentUsers.map((user, index)=>(
                      <tr>
                        <td>{index+1}</td>
                        <td>{user.name}</td>
                        <td>{user.UID}</td>
                        <td>{user.email}</td>
                        <td>{user.date_created}</td>
                        <td>{user.date_update}</td>
                        <td>Chi tiết</td>
                      </tr>
                    )
                    )
                ) : (<tr><td colSpan="8" style={{ textAlign: 'center' }}>
                                Không có kết quả nào hiển thị
                      </td>
                </tr>)}
                
              </tbody>
            </table>

            <div className="pagination">
              <button 
                className="page-button"
                onClick={()=>handlePageChange(currentPage-1)}
                disabled={currentPage===1}
              >
                  Trước
              </button>
              {Array.from({length: totalPages}, (_, index)=>(
                <button
                  key={index}
                  className={`page-button ${currentPage === index+1 ? 'active' : ''}`}
                  onClick={() => handlePageChange(index+1)}
                >
                  {index+1}
                </button>
              ))}
              <button
                className="page-button"
                onClick={()=>handlePageChange(currentPage+1)}
                disabled={currentPage===totalPages}
              >
                Sau
              </button>

            </div>
        </div>
    </>);
}

export default UserManagement;