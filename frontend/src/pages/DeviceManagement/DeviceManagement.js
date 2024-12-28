import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import axios from 'axios'; 
import './DeviceManagement.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const DeviceManagement = () => {
  const [devices, setDevices] = useState([]);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  const getDevices = () => {
    axios.get('http://localhost:3000/api/devices')
        .then(response => {
            setDevices(response.data.data);

        })
        .catch(error => {
            console.error('There was a problem with the request:', error.message);
        });
};

useEffect(() => {
    getDevices();
}, []);
console.log("devices",devices);


  // Mock data
  const accessLogs = [
    { fullName: "Nguyễn Văn A", time: "2024-12-20 08:00:00", accessType: "Fingerprint", device: "Main Gate", action: "Chi tiết" },
    { fullName: "Nguyễn Văn B", time: "2024-12-24 09:00:00", accessType: "RFID", device: "Side Door", action: "Chi tiết" },
    { fullName: "Nguyễn Văn C", time: "2024-12-22 10:00:00", accessType: "Fingerprint", device: "Main Gate", action: "Chi tiết" },
    { fullName: "Nguyễn Văn D", time: "2024-12-26 11:00:00", accessType: "RFID", device: "Side Door", action: "Chi tiết" },
    { fullName: "Nguyễn Văn E", time: "2024-12-25 12:00:00", accessType: "Fingerprint", device: "Main Gate", action: "Chi tiết" },
    { fullName: "Nguyễn Văn A", time: "2024-12-20 08:00:00", accessType: "Fingerprint", device: "Main Gate", action: "Chi tiết" },
    { fullName: "Nguyễn Văn B", time: "2024-12-21 09:00:00", accessType: "RFID", device: "Side Door", action: "Chi tiết" },
    { fullName: "Nguyễn Văn C", time: "2024-12-22 10:00:00", accessType: "Fingerprint", device: "Main Gate", action: "Chi tiết" },
    { fullName: "Nguyễn Văn D", time: "2024-12-26 11:00:00", accessType: "RFID", device: "Side Door", action: "Chi tiết" },
    { fullName: "Nguyễn Văn E", time: "2024-12-25 12:00:00", accessType: "Fingerprint", device: "Main Gate", action: "Chi tiết" },
  ];

  // Initialize devices




  useEffect(() => {
    const logsByDate = accessLogs.reduce((acc, log) => {
      const date = log.time.split(' ')[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

    // Get the last 10 days
    const sortedDates = Object.keys(logsByDate).sort((a, b) => new Date(b) - new Date(a));
    const recentDates = sortedDates.slice(0, 10).reverse(); // Take the latest 10 days and reverse for chronological order

    const labels = recentDates;
    const data = recentDates.map(date => logsByDate[date]);

  
    // Chỉ cập nhật nếu dữ liệu thay đổi
    setChartData((prevData) => {
      if (
        JSON.stringify(prevData.labels) !== JSON.stringify(labels) ||
        JSON.stringify(prevData.datasets?.[0]?.data) !== JSON.stringify(data)
      ) {
        return {
          labels,
          datasets: [
            {
              label: 'Số lượt ra vào ',
              data,
              backgroundColor: '#2fa44b',
              borderColor: '#2fa44b',
              borderWidth: 1,
              barThickness: 30,
            },
          ],
        };
      }
      return prevData;
    });
  }, [accessLogs]);
  
  return (
    <div className='device-management'>
      <div className='device-content'>
        <div className='table-device'>
         <div className='device-management-title'>Danh sách thiết bị</div>

          <table>
            <thead>
              <tr>
                <td>STT</td>
                <td>Tên thiết bị</td>
                <td>Vị trí</td>
              </tr>
            </thead>
            <tbody>
              {devices.map((device, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>Thiết bị {device.id_port}</td>
                  <td>{device.location}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className='device-chart'>
          <div className='device-management-title'>Số lượt ra vào </div>
          
          {chartData.datasets.length > 0 ? (
            <Bar
              data={chartData}
              options={{
                responsive: true,
                maintainAspectRatio: false, 
                plugins: {
                  legend: { position: 'top' },
                  // title: { display: true, text: 'Số lượt ra vào hàng ngày' },
                },
                scales: {
                  y: {
                    ticks: {
                      stepSize: 1, // Ensure only integers are shown
                      callback: (value) => Number.isInteger(value) ? value : null,
                    },
                    beginAtZero: true,
                  },
                },
                width: 600,
              }}
            />
          ) : (
            <p>Loading chart...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeviceManagement;
