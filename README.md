<div align="center">
    <img src="./image/logo.png" width=400>
    <h1>SolarHealth</h1>
    <h3>💏 SolarHealth - Ứng dụng hỗ trợ chăm sóc sức khoẻ dành cho bệnh tâm lý 💑</h3>
	<p align="center">
		<a href="#giới-thiệu">📘 Giới Thiệu</a> -
		<a href="#công-nghệ-sử-dụng">📚 Công nghệ sử dụng</a> -
		<a href="#sơ-đồ-use-case">📑 Sơ đồ use-case</a> -
		<a href="#sơ-đồ-class">✏️ Sơ đồ class</a> -
		<a href="#sơ-đồ-database">📂 Sơ đồ database</a> -
		<a href="#kiến-trúc-phần-mềm">📐 Kiến trúc phần mềm</a> - 
		<a href="#màn-hình-kết-quả">📺 Màn hình kết quả</a> -
		<a href="#thành-viên-thực-hiện">👪 Thành viên thực hiện</a>
	</p>
</div>

## GIỚI THIỆU
<p align="center">Ứng dụng phần mềm <b>SolarHealth</b> là một ứng dụng cho phép mọi người có thể tư vấn, khám chữa bệnh từ xa mà không nhất thiết phải di chuyển. Việc sử dụng ứng dụng này
sẽ làm tối giản hoá việc đi lại cũng như công nghệ hoá hiện đại thay vì làm việc trực tiếp. Thay vì các bệnh nhân phải gặp trực tiếp bác sĩ, thì các bệnh nhân có thể làm việc với bác sĩ
từ xa với nhiều phương thức giao tiếp khác nhau (tin nhắn, cuộc gọi). 
</br>
😍 🌏 ❤️ 👫
</p>

Một số tính năng đặc trưng của ứng dụng:
1. Cho phép bệnh nhân có thể tư vấn khám sức khoẻ từ xa
2. Bác sĩ có thể biết được vị trí bệnh nhân để tới khám dựa vào thông tin cung cấp của bệnh nhân khi gọi cấp cứu
3. Bệnh nhân có thể gọi cấp cứu khi có trường hợp khẩn cấp </br>
...

## CÔNG NGHỆ SỬ DỤNG
<div>
	<ul>
		<li>Frontend: Website (ReactJS), Mobile (React-native)</li>
		<li>Backend: Java (Spring boot), Javascript (NodeJS), Python (Django)</li>
		<li>Database: MariaDB, MongoDB và Redis</li>
		<li>Security: Đăng nhập bằng form</li>
		<li>Deployment: Vercel (cho Web), Droplets (Digital Ocean - cho Backend)</li>
		<li>Kiến trúc: Microservices, Event-driven và Multi-layered</li>
		<li>Công nghệ khác: Spring OpenFeign, OpenCV (dùng CNN model), ARIMA Model, SES Model, Apache Kafka, Socket I/O, StompJS, S3 (lưu trữ ảnh)</li>
	</ul>
</div> 

## SƠ ĐỒ USE CASE
<img src="./healthcare_app_diagram/Healthcare Usecase.jpg" align="center"/>

## SƠ ĐỒ CLASS
<img src="./healthcare_app_diagram/class_diagram.png" align="center"/>

## SƠ ĐỒ DATABASE
### SQL (MariaDB)
<img src="./healthcare_app_diagram/sql_database_diagram.png" align="center"/>

### NoSQL (MongoDB)
<img src="./healthcare_app_diagram/nosql_database_diagram.png" align="center"/>

## KIẾN TRÚC PHẦN MỀM
<img src="./healthcare_app_diagram/software_architecture.png" align="center"/>

## HIỆN THỰC
<img src="./image/screens/homepage.png" align="center"/>
<p align="center">Màn hình trang chủ ứng dụng</p>

</br>

<img src="./image/screens/patient_view_appointment.png" align="center"/>
<p align="center">Bệnh nhân xem lịch khám của bản thân (Web - Mobile)</p>

</br>

<img src="./image/screens/doctor_view_appointment.png" align="center"/>
<p align="center">Bác sĩ xem lịch khám của bản thân (Web)</p>

</br>

<img src="./image/screens/paitent_join_room_online.png" align="center">
<p align="center">Bệnh nhân tham gia phòng khám online (Web - Mobile)</p>

</br>

<img src="./image/screens/doctor_join_room_online.png" align="center">
<p align="center">Bác sĩ tham gia phòng khám online (Web)</p>

</br>

<img src="./image/screens/patient_call_emergency.png" align="center">
<p align="center">Bệnh nhân gọi chức năng cấp cứu (Mobile)</p>

</br>

<img src="./image/screens/doctor_managing_emergency.png" align="center"/>
<p align="center">Bác sĩ quản lý các bệnh nhân gọi cấp cứu (Web)</p>

## THÀNH VIÊN THỰC HIỆN
<table align="center">
	<tbody> 
		<tr align="center" valign="top">
			<td>
				<a href="https://github.com/TDMinhNhat">
					<img src="https://avatars.githubusercontent.com/u/158603211?v=4?s=100" height=150 />
					<div>Minh Nhật</div>
				</a>
			</td>
			<td>
				<a href="https://github.com/DangQuang31122022">
					<img src="https://avatars.githubusercontent.com/u/121714705?v=4?s=100" height=150 />
					<div>Đăng Quang</div>
				</a>
			</td>
		</tr>
	</tbody>
</table>
