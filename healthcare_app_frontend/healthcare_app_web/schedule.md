Đây là mô tả về sơ đồ lớp (class diagram) trong UML cho hệ thống quản lý lịch làm việc:

**Bảng WorkSchedule:**

- Thuộc tính:
  - id: Long
  - doctor: Doctor
  - typeDay: TypeDay
  - shift: Shift
  - createdAt: LocalDateTime
  - updatedAt: LocalDateTime
  - status: boolean

**Bảng Shift:**

- Thuộc tính:
  - id: Long
  - shift: int
  - start: LocalTime
  - end: LocalTime
  - createdAt: LocalDateTime
  - updatedAt: LocalDateTime
  - status: boolean

**Enum TypeDay:**

- Các giá trị: MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY, SUNDAY

**Mối quan hệ giữa các bảng:**

1. WorkSchedule có quan hệ "has" với TypeDay (0..\*): Một WorkSchedule có một TypeDay xác định, và một TypeDay có thể được sử dụng trong nhiều WorkSchedule.

2. WorkSchedule có quan hệ "has" với Shift (0..\*): Một WorkSchedule có một Shift xác định, và một Shift có thể được sử dụng trong nhiều WorkSchedule.

3. Mối quan hệ giữa các thực thể là dạng liên kết một-nhiều (one-to-many), trong đó:
   - Một WorkSchedule liên kết với một Shift cụ thể
   - Một WorkSchedule liên kết với một TypeDay cụ thể
   - Một Shift có thể được sử dụng trong nhiều WorkSchedule
   - Một TypeDay có thể được sử dụng trong nhiều WorkSchedule

Đây là mô hình dữ liệu cho hệ thống quản lý lịch làm việc của bác sĩ, cho phép sắp xếp ca làm việc theo các ngày trong tuần.
