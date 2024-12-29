const WebSocket = require('ws');

class WebSocketHandler {
    constructor(port) {
        this.wss = new WebSocket.Server({ port });
        this.pendingResponses = new Map();
        this.connectedDevices = new Map(); // lưu các esp 32 kết nói với id
        this.initialize();
    }

    initialize() {
        console.log(`WebSocket Server running on port ${this.wss.options.port}`);

        this.wss.on('connection', (ws) => {
            console.log('New device connected - awaiting ID');

            ws.on('message', (message) => {
                try {
                    const data = JSON.parse(message);
                    
                    // nhận tin nhắn khi mới kết nối với ID_cong
                    if (data.Id_cong !== undefined) {
                        this.handleTin_nhan_ket_noi(ws, data.Id_cong);
                    } else {
                   
                        this.handleMessage(message);
                    }
                } catch (error) {
                    console.error('Error parsing message:', error);
                }
            });

            ws.on('close', () => {
                // xóa esp32 khỏi danh sách khi ngắt kết nối
                for (const [id, device] of this.connectedDevices.entries()) {
                    if (device === ws) {
                        console.log(`ESP32 with ID ${id} disconnected`);
                        this.connectedDevices.delete(id);
                        break;
                    }
                }
            });
        });
    }

    handleTin_nhan_ket_noi(ws, id) {
        console.log(`ESP32 connected with ID_cong: ${id}`);//thông báo esp32 kết nối thành công với ID
        this.connectedDevices.set(id, ws);//thêm cổng với id vào map lưu trữ
        fetch('/api/devices',{//gửi tới enpoint tạo devieces
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id_port: id
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

    handleMessage(message) {//gửi từ esp32
        try {
            const data = JSON.parse(message);//
            
            if (data.header === 'response new account') {
                this.handle_Newvantay_Response(data);//phản hồi luồng tạo vân tay
            } 
            else if(data.header==='Check_in request'){
                this.handle_check_in_Request(data);
            }
            else if (data.header === 'Check_in response') {
                this.handleCheck_In_Response(data);//phản hòi luồng checkin
            }
        } catch (error) {
            console.error('Error handling message:', error);
        }
    }

    handle_Newvantay_Response(data) {
        const { header,UID, status, finger } = data;
        const res = this.pendingResponses.get(UID);
        
        if (res) {
            if (status === 'successfully') {
                console.log("tạo vân tay thành công");
                console.log("Finger template:", finger);
                res.json({
                    status: 'success',
                    finger: finger
                });
            } else {
                res.json({
                    status: 'error',
                    message: 'Failed to create fingerprint'
                });
            }
            this.pendingResponses.delete(UID);
        }
    }

    handleCheck_In_Response(data) {//esp 32 thông báo checkin thành công
        const {header,UID, Id_cong } = data;
        const res = this.pendingResponses.get(UID);
        
        if (res) {
            if (header === 'Check_in successfully') {

                const now = new Date();
                // Lấy thời gian theo múi giờ UTC+7 và chuyển thành chuỗi
                const timeInUTC7 = now.toLocaleString("vi-VN", {
                    timeZone: "Asia/Bangkok", year: "numeric",month: "2-digit",day: "2-digit",hour: "2-digit",minute: "2-digit",second: "2-digit",
                });
                
                fetch('/api/history',{
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        header: "success",
                        UID: data.UID,
                        time: timeInUTC7,
                        id_port: data.Id_cong
                    })

                })
            } 
            this.pendingResponses.delete(UID);
        }
    }

    handle_check_in_Request(data){
        const {header,UID} = data;

    }
    
    sendToESP32(message, targetId = null) {//gửi tin nhắn tới 1 esp32 nhất định
        if (targetId) {
            // Send to specific ESP32
            const targetWs = this.connectedDevices.get(targetId);
            if (targetWs && targetWs.readyState === WebSocket.OPEN) {
                targetWs.send(JSON.stringify(message));
            }
        } 
    }

    setPendingResponse(uid, res) {
        this.pendingResponses.set(uid, res);
    }

    deletePendingResponse(uid) {
        this.pendingResponses.delete(uid);
    }

    hasPendingResponse(uid) {
        return this.pendingResponses.has(uid);
    }

    // New method to get connected ESP32 IDs
    getConnectedDevices() {
        return Array.from(this.connectedDevices.keys());
    }
}

module.exports = WebSocketHandler;