const WebSocket = require('ws');

class WebSocketHandler {
    constructor(wss) {  // Nhận WebSocket server từ bên ngoài thay vì tạo mới
        this.wss = wss;
        //this.pendingResponses = new Map();
        this.connectedDevices = new Map(); // lưu các esp 32 kết nối với id
        this.initialize();
    }


    initialize() {
        console.log(`WebSocket Server running on port ${this.wss.options.port}`);

        this.wss.on('connection', (ws) => {
            console.log('New device connected - awaiting ID');

            ws.isAlive = true;
            ws.on('pong', () => {
                ws.isAlive = true;
            });

            ws.on('close',() => {
                //console.log("Connected devices:", this.getConnectedDevices());
                console.log('có 1 device close');
                
                let disconnectedId = null;
                
                for (const [id, wsConnection] of this.connectedDevices.entries()) {
                    if (wsConnection === ws) {
                        disconnectedId = id;
                        console.log(`ESP32 with ID ${disconnectedId} disconnected`);
                        this.connectedDevices.delete(disconnectedId);
                        this.handleDelete_device(disconnectedId);
                        break;
                    }
                }
            });
            ws.on('message', (message) => {
                try {
                    const data = JSON.parse(message);
                    
                    // nhận tin nhắn khi mới kết nối với ID_cong
                    if (data.Id_cong !== undefined) {
                        this.handleTin_nhan_ket_noi(ws, String(data.Id_cong));
                    } else {
                   
                        this.handleMessage(message);
                    }
                } catch (error) {
                    console.error('Error parsing message:', error);
                }
            });

            const interval = setInterval(() => {
                this.wss.clients.forEach((ws) => {
                    if (ws.isAlive === false) {
                        ws.terminate();
                        return;
                    }
                    ws.isAlive = false;
                    ws.ping();
                });
            }, 15000); // Kiểm tra mỗi 15 giây

            this.wss.on('close', () => {
                clearInterval(interval);
            });
        });
    }


    handleTin_nhan_ket_noi(ws, id) {
        console.log("Connected devices:", this.getConnectedDevices());
        console.log(`ESP32 connected with ID_cong: ${id}`);// thông tin esp32 kết nối thành công với ID rồi gửi về server
        
        this.connectedDevices.set(id, ws);//thêm cổng với id vào map lưu trữ
        console.log("Connected devices:", this.getConnectedDevices());
        fetch('http://localhost:3000/api/devices/',{//gửi tới enpoint tạo devieces
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id_port:String(id),  
            })

           
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json(); // Trích xuất dữ liệu JSON từ phản hồi
        })
        .then(data => {
            console.log('Success:', data); // In kết quả thành công ra console
        })
        .catch(error => {
            console.error('Error:', error); // Xử lý lỗi nếu có
        });
    }

     handleDelete_device(id) {
        try {
            const response = fetch(`http://localhost:3000/api/devices/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
    
            const responseData =  response.json();
    
            if (!response.ok) {
                if (response.status === 404) {
                    console.error(`Device ${id} not found in database`);
                } else {
                    console.error(`Failed to delete device ${id}: ${responseData.message}`);
                }
                return;
            }
    
            if (responseData.success) {
                console.log(`Device ${id} deleted successfully: ${responseData.message}`);
             
            } else {
                console.error(`Error deleting device ${id}: ${responseData.message}`);
            }
    
        } catch (error) {
            console.error(`Error during delete operation for device ${id}:`, error.message);
        }
    }
    
    handleMessage(message) {//gửi từ esp32
        try {
            const data = JSON.parse(message);//
            
            if (data.header === 'response new account') {
                console.log('nhận từ esp32');
                this.handle_Newvantay_Response(data);//phản hồi luồng tạo vân tay
            } 
            else if(data.header==='Check_in request'){
                this.handle_check_in_Request(data);
            }
            else if (data.header === 'Check_in response') {
                this.handleCheck_In_Response(data);//phản hôi luồng checkin
            }
        } catch (error) {
            console.error('Error handling message:', error);
        }
    }

    handle_Newvantay_Response(data) {
        //const { header,id_port,UID, status, finger } = data;
            if (data.status === 'successfully') {
                console.log("tạo vân tay thành công");
                console.log(data.UID);
                fetch(`http://localhost:3000/api/users/finger`,{
                    method: 'PUT',
                    headers: { 
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        UID: data.UID,
                        finger:data.finger
                    })
                })
            } else{
                console.log("tạo vân tay thất bại");
            }
        
    }

    handleCheck_In_Response(data) {//nhận thông tin esp 32 thông báo checkin thành công tồi gửi lên server
        //
        const now = new Date();
                // Lấy thời gian theo múi giờ UTC+7 và chuyển thành chuỗi
                const timeInUTC7 = now.toLocaleString("vi-VN", {
                    timeZone: "Asia/Bangkok", year: "numeric",month: "2-digit",day: "2-digit",hour: "2-digit",minute: "2-digit",second: "2-digit",
                });
            console.log(data);
            console.log(timeInUTC7);
            if (data.status === 'Check_in successfully') {


                fetch('http://localhost:3000/api/history',{
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        header: "success",
                        UID: String(data.UID),
                        time: String(timeInUTC7),
                        id_port: String(data.Id_port),
                        status: "successfull"
                    })


                })  .then(response => response.json().then(data => ({ status: response.status, body: data })))
                .then(({ status, body }) => {
                    if (status >= 400) {
                        throw new Error(`HTTP error! Status: ${status} - ${body.message}`);
                    }
                    console.log('Success:', body);
                })
                .catch(error => {
                    console.error('Error:', error.message);
                });
            }
            
            else if(data.status === 'Check_in failed'){
                fetch('http://localhost:3000/api/history',{
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        header: "success",
                        UID: String(data.UID),
                        time: String(timeInUTC7),
                        id_port: String(data.Id_port),
                        status:"failed"
                    })

                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok ' + response.statusText);
                    }
                    return response.json();
                })
                .then(data => {
                    console.log('Success:', data);
                })
                .catch(error => {
                    console.error('Error:', error);
                });
            }
            //this.pendingResponses.delete(UID);
        //}
    }

    handle_check_in_Request(data) {
        //const { UID } = data;
        const id_cong=data.id_port;
    
        fetch(`http://localhost:3000/api/users/${data.UID}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(result => {
            //const { UID, finger } = result;
            console.log('nhận được thông tin từ server');
            //const fingerArray = finger;

            const message = {
                header: 'Check_in response',
                UID: result.UID,
                finger: result.finger
                
            };
            console.log(message);
            this.sendToESP32(message, String(id_cong));
            console.log("Gửi yêu cầu check-in tới ESP32");
        })
        .catch(error => {
            console.error('Error:', error.message);
        });
    }
    
    sendToESP32(message, targetId = null) {//gửi tin nhắn tới 1 esp32 nhất định
        if (targetId) {
            // Send to specific ESP32
            //console.log("Connected devices:", this.getConnectedDevices());
            console.log("Target ID:", targetId);
            const targetWs = this.connectedDevices.get(targetId);
            if (targetWs && targetWs.readyState === WebSocket.OPEN) {
                targetWs.send(JSON.stringify(message));
                console.log("gửi tin nhắn tới esp32");
            }
        } 
    }


    // New method to get connected ESP32 IDs
    getConnectedDevices() {
        return Array.from(this.connectedDevices.keys());
    }
}

module.exports = WebSocketHandler;