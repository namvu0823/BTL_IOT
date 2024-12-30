import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import axios from 'axios'; 
import './DeviceManagement.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const DeviceManagement = () => {
  const [devices, setDevices] = useState([]);
  const [history, setHistory] = useState([]);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  // Fetch devices data
  const getDevices = () => {
    axios.get('http://localhost:3000/api/devices')
      .then(response => {
        setDevices(response.data.data);
      })
      .catch(error => {
        console.error('There was a problem with the request:', error.message);
      });
  };

  // Fetch history data
  const getHistory = () => {
    axios.get('http://localhost:3000/api/history')
      .then(response => {
        setHistory(response.data.data);
      })
      .catch(error => {
        console.error('There was a problem with the request:', error.message);
      });
  };

  useEffect(() => {
    getDevices();
    getHistory();
  }, []);

  // Process history data and update chart
  useEffect(() => {
    const processHistoryData = () => {
      const logsByDate = history.reduce((acc, log) => {
        const date = new Date(log.time_in).toLocaleDateString(); 
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {});

      // Get the last 10 days
      const sortedDates = Object.keys(logsByDate).sort((a, b) => new Date(b) - new Date(a));
      const recentDates = sortedDates.slice(0, 10).reverse();
      const labels = recentDates;
      const data = recentDates.map(date => logsByDate[date]);

      // Update chart data
      setChartData({
        labels,
        datasets: [
          {
            label: 'Số lượt ra vào',
            data,
            backgroundColor: '#2fa44b',
            borderColor: '#2fa44b',
            borderWidth: 1,
            barThickness: 30,
          },
        ],
      });
    };

    if (history.length > 0) {
      processHistoryData();
    }
  }, [history]);

  return (
    <div className='device-management'>
      <div className='device-content'>
        <div className='table-device'>
          <div className='device-management-title'>Danh sách thiết bị</div>
          <table>
            <thead>
              <tr>
                <td>STT</td>
                <td>Tên cổng</td>
                <td>Vị trí</td>
              </tr>
            </thead>
            <tbody>
              {devices.map((device, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>Cổng {device.id_port}</td>
                  <td>Cổng {device.id_port}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className='device-chart'>
          <div className='device-management-title'>Số lượt ra vào</div>
          {chartData.datasets.length > 0 ? (
            <Bar
              data={chartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: 'top' },
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

