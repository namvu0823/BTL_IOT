import React from "react";
import './AccessManagement.css'

function AccessManagement() {
  return (
<div>

      {/* Section: Access Logs */}
      <div className="section">
        <h2>Thời gian ra vào</h2>
        <table>
          <thead>
            <tr>
              <th>User ID</th>
              <th>Thẻ UID</th>
              <th>Thời gian</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>101</td>
              <td>a1b2c3d4e5</td>
              <td>09:00:00 - 08/12/2024</td>
              <td>Thành công</td>
            </tr>
            <tr>
              <td>102</td>
              <td>b1c2d3e4f5</td>
              <td>10:30:00 - 08/12/2024</td>
              <td>Thất bại</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AccessManagement;
