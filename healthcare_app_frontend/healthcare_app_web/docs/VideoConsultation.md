# Tài Liệu Module Khám Bệnh Trực Tuyến

## Tổng Quan

Module Khám Bệnh Trực Tuyến cung cấp giải pháp toàn diện cho các buổi tư vấn trực tuyến giữa bác sĩ và bệnh nhân. Hệ thống bao gồm hai thành phần chính, tạo nên một trải nghiệm phòng khám ảo liền mạch:

1. **Phòng Chờ** - Khu vực chờ ảo dành cho bệnh nhân trước khi được khám
2. **Phòng Khám** - Môi trường tư vấn video nơi bác sĩ và bệnh nhân gặp nhau

## Kiến Trúc Hệ Thống

Hệ thống sử dụng kết hợp nhiều công nghệ:

- React cho giao diện người dùng
- Socket.io cho giao tiếp thời gian thực
- ZegoCloud để phát trực tuyến video/âm thanh
- Redux để quản lý trạng thái
- React Router để điều hướng

## Phòng Chờ (`WatingRoomPage.tsx`)

### Mục Đích

Cung cấp khu vực chờ ảo cho bệnh nhân trước khi được tư vấn, mô phỏng phòng chờ tại phòng khám thực tế.

### Tính Năng Chính

- Hiển thị số thứ tự của bệnh nhân
- Hiển thị số thứ tự đang được khám
- Cung cấp cập nhật trạng thái hàng đợi theo thời gian thực
- Tự động chuyển hướng bệnh nhân đến phòng khám khi được bác sĩ tiếp nhận

### Cài Đặt Kỹ Thuật

- Sử dụng Socket.io để cập nhật hàng đợi theo thời gian thực
- Kết nối với máy chủ WebSocket để tham gia hàng đợi chờ
- Lắng nghe sự kiện chấp nhận từ bác sĩ
- Nhận và hiển thị số thứ tự đang khám từ máy chủ

### Luồng Dữ Liệu

1. Bệnh nhân vào phòng chờ với thông tin cuộc hẹn từ hệ thống đặt lịch
2. Bệnh nhân tham gia hàng đợi với số thứ tự và ID người dùng
3. Máy chủ phát sóng số thứ tự đang được khám đến tất cả bệnh nhân trong hàng đợi
4. Khi bác sĩ tiếp nhận, bệnh nhân nhận thông báo và sự kiện chuyển hướng
5. Bệnh nhân được tự động đưa đến phòng khám

## Phòng Khám (`ExaminationRoomPage.tsx`)

### Mục Đích

Tạo điều kiện cho việc tư vấn video an toàn, chất lượng cao giữa bác sĩ và bệnh nhân với quản lý hàng đợi tích hợp.

### Tính Năng Chính

- Tích hợp cuộc gọi video sử dụng ZegoCloud
- Giao diện khác nhau cho bác sĩ và bệnh nhân
- Bảng quản lý hàng đợi bệnh nhân (chỉ dành cho bác sĩ)
- Thông báo và cập nhật thời gian thực

### Giao Diện Theo Vai Trò

- **Giao Diện Bác Sĩ**:
  - Màn hình chia đôi với cuộc gọi video (70%) và hàng đợi bệnh nhân (30%)
  - Điều khiển quản lý hàng đợi (tiếp nhận/xóa bệnh nhân)
  - Khả năng chia sẻ phòng
- **Giao Diện Bệnh Nhân**:
  - Giao diện cuộc gọi video toàn màn hình
  - Tự động chuyển hướng sau khi kết thúc cuộc tư vấn

### Cài Đặt Kỹ Thuật

- ZegoUIKitPrebuilt cho hội nghị video
- Socket.io cho giao tiếp thời gian thực với phòng chờ
- Hiển thị dựa trên vai trò từ tham số URL
- Khởi tạo phòng tự động với token bảo mật

## Tích Hợp Giữa Các Thành Phần

### Sự Kiện Socket.io

Hệ thống sử dụng các sự kiện sau để phối hợp giữa phòng chờ và phòng khám:

- `joinWaitingQueue`: Bệnh nhân tham gia hàng đợi chờ
- `patientJoinRoom`: Bệnh nhân vào phòng khám
- `doctorJoinRoom`: Bác sĩ vào phòng khám
- `getPatientQueue`: Bác sĩ yêu cầu thông tin hàng đợi
- `patientQueueUpdate`: Cập nhật danh sách hàng đợi bệnh nhân
- `acceptPatient`: Bác sĩ tiếp nhận một bệnh nhân
- `queueUpdate`: Cập nhật số thứ tự đang khám
- `patientAccepted`: Thông báo cho bệnh nhân đã được tiếp nhận
- `removeWaitingQueue`: Xóa bệnh nhân khỏi hàng đợi

### Luồng Quy Trình Bệnh Nhân

1. Bệnh nhân vào phòng chờ với số thứ tự từ lịch hẹn đã đặt
2. Phòng chờ hiển thị vị trí trong hàng đợi và số thứ tự đang khám
3. Bác sĩ thấy bệnh nhân trong hàng đợi từ giao diện phòng khám
4. Khi bác sĩ nhấn "Tiếp nhận":
   - Sự kiện socket được gửi đến phòng chờ
   - Bệnh nhân tự động chuyển hướng đến phòng khám
   - Bệnh nhân tham gia cuộc gọi video với số thứ tự trong tên hiển thị
5. Sau khi tư vấn, bệnh nhân được chuyển hướng đến trang lịch hẹn

### Luồng Quy Trình Bác Sĩ

1. Bác sĩ vào phòng khám cho các cuộc hẹn đã lên lịch
2. Hệ thống tải danh sách bệnh nhân đang chờ
3. Bác sĩ có thể xem tất cả bệnh nhân đang chờ với số thứ tự
4. Bác sĩ tiếp nhận bệnh nhân theo thứ tự (thường theo số thứ tự)
5. Bác sĩ có thể xóa bệnh nhân khỏi hàng đợi nếu cần
6. Cuộc tư vấn video diễn ra ở phần chính của màn hình

## Yêu Cầu Cấu Hình

Hệ thống yêu cầu:

- Khóa API ZegoCloud (APP_ID, SERVER_SECRET) trong tệp constants
- Máy chủ socket backend chạy trên ws://localhost:8081 với endpoint "/chat"
- Hệ thống xác thực người dùng cung cấp thông tin người dùng qua Redux

## Các Vấn Đề Bảo Mật

- Token ZegoCloud được tạo an toàn cho mỗi phiên
- Thông tin bệnh nhân bao gồm số thứ tự để nhận dạng
- Quyền truy cập phòng được kiểm soát bởi hệ thống chấp nhận của bác sĩ
- Giao diện bác sĩ và bệnh nhân riêng biệt ngăn chặn truy cập trái phép vào quản lý hàng đợi

## Xử Lý Sự Cố

Các vấn đề thường gặp:

- Lỗi kết nối Socket: Kiểm tra trạng thái máy chủ backend và cài đặt tường lửa
- Vấn đề cuộc gọi video: Xác minh quyền truy cập camera/microphone và cấu hình ZegoCloud
- Hàng đợi không cập nhật: Kiểm tra kết nối máy chủ socket và xử lý sự kiện
