import React from 'react'
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import avatar from '../../components/Assets/avatar.jpg'
import './AccessManagement.css'

library.add(fas);


const AccessManagement = () => {
    const access = [
        {
          fullName: "Nguyễn Văn A",
          time: "2024-12-23 08:00:00",
          accessType: "Fingerprint",
          status: "Success",
          device: "Main Gate",
          action: "Chi tiết",
        },
        {
          fullName: "Trần Thị B",
          time: "2024-12-23 08:15:00",
          accessType: "RFID",
          status: "Failed",
          device: "Back Door",
          action: "Chi tiết",
        },
        {
          fullName: "Phạm Minh C",
          time: "2024-12-23 08:30:00",
          accessType: "Fingerprint",
          status: "Success",
          device: "Main Gate",
          action: "Chi tiết",
        },
        {
          fullName: "Lê Hoàng D",
          time: "2024-12-23 09:00:00",
          accessType: "RFID",
          status: "Success",
          device: "Back Door",
          action: "Chi tiết",
        },
        {
          fullName: "Võ Thị E",
          time: "2024-12-23 09:15:00",
          accessType: "Fingerprint",
          status: "Failed",
          device: "Main Gate",
          action: "Chi tiết",
        },
        {
            fullName: "Nguyễn Văn A",
            time: "2024-12-23 08:00:00",
            accessType: "Fingerprint",
            status: "Success",
            device: "Main Gate",
            action: "Chi tiết",
          },
          {
            fullName: "Trần Thị B",
            time: "2024-12-23 08:15:00",
            accessType: "RFID",
            status: "Failed",
            device: "Back Door",
            action: "Chi tiết",
          },
          {
            fullName: "Phạm Minh C",
            time: "2024-12-23 08:30:00",
            accessType: "Fingerprint",
            status: "Success",
            device: "Main Gate",
            action: "Chi tiết",
          },
          {
            fullName: "Lê Hoàng D",
            time: "2024-12-23 09:00:00",
            accessType: "RFID",
            status: "Success",
            device: "Back Door",
            action: "Chi tiết",
          },
          {
            fullName: "Võ Thị E",
            time: "2024-12-23 09:15:00",
            accessType: "Fingerprint",
            status: "Failed",
            device: "Main Gate",
            action: "Chi tiết",
          },
          {
            fullName: "Nguyễn Văn A",
            time: "2024-12-23 08:00:00",
            accessType: "Fingerprint",
            status: "Success",
            device: "Main Gate",
            action: "Chi tiết",
          },
          {
            fullName: "Trần Thị B",
            time: "2024-12-23 08:15:00",
            accessType: "RFID",
            status: "Failed",
            device: "Back Door",
            action: "Chi tiết",
          },
          {
            fullName: "Phạm Minh C",
            time: "2024-12-23 08:30:00",
            accessType: "Fingerprint",
            status: "Success",
            device: "Main Gate",
            action: "Chi tiết",
          },
          {
            fullName: "Lê Hoàng D",
            time: "2024-12-23 09:00:00",
            accessType: "RFID",
            status: "Success",
            device: "Back Door",
            action: "Chi tiết",
          },
          {
            fullName: "Võ Thị E",
            time: "2024-12-23 09:15:00",
            accessType: "Fingerprint",
            status: "Failed",
            device: "Main Gate",
            action: "Chi tiết",
          },
          {
            fullName: "Nguyễn Văn A",
            time: "2024-12-23 08:00:00",
            accessType: "Fingerprint",
            status: "Success",
            device: "Main Gate",
            action: "Chi tiết",
          },
          {
            fullName: "Trần Thị B",
            time: "2024-12-23 08:15:00",
            accessType: "RFID",
            status: "Failed",
            device: "Back Door",
            action: "Chi tiết",
          },
          {
            fullName: "Phạm Minh C",
            time: "2024-12-23 08:30:00",
            accessType: "Fingerprint",
            status: "Success",
            device: "Main Gate",
            action: "Chi tiết",
          },
          {
            fullName: "Lê Hoàng D",
            time: "2024-12-23 09:00:00",
            accessType: "RFID",
            status: "Success",
            device: "Back Door",
            action: "Chi tiết",
          },
          {
            fullName: "Võ Thị E",
            time: "2024-12-23 09:15:00",
            accessType: "Fingerprint",
            status: "Failed",
            device: "Main Gate",
            action: "Chi tiết",
          },
    ];



    const [accessLogs, setAccessLogs] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3;
    
    useEffect(()=>{
        setAccessLogs(access);
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

        const filterLogs = access.filter((accessLog)=>{
            return (
                accessLog.fullName.toLowerCase().includes(value) ||
                accessLog.time.toLowerCase().includes(value) ||
                accessLog.accessType.toLowerCase().includes(value) ||
                accessLog.status.toLowerCase().includes(value) ||
                accessLog.device.toLowerCase().includes(value)
            );
        })

        console.log(filterLogs);

        setAccessLogs(filterLogs);
        setCurrentPage(1);
    }



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
                        <td>Loại truy cập</td>
                        <td>Trạng thái</td>
                        <td>Thiết bị</td>
                        <td>Hành động</td>
                    </tr>
                </thead>
                <tbody>
                {currentLogs.length > 0 ? (
                        currentLogs.map((accessLog, index) => (
                            <tr key={index}>
                                <td>{indexOfFirstItem + index + 1}</td>
                                <td><img src={avatar}/></td>
                                <td>{accessLog.fullName}</td>
                                <td className='time-access'>{accessLog.time.split(" ")[1]}</td>
                                <td>{accessLog.time.split(" ")[0]}</td>
                                <td>{accessLog.accessType}</td>
                                <td>{accessLog.status}</td>
                                <td>{accessLog.device}</td>
                                <td>{accessLog.action}</td>
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

}

export default AccessManagement;