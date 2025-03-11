Đây là mô hình cơ sở dữ liệu hiển thị mối quan hệ giữa hai bảng:

**WorkSchedule**

- id : Long
- doctor : Doctor
- shift : Shift
- maxSlots : int
- dateAppointment : LocalDate
- createdAt : LocalDateTime
- updatedAt : LocalDateTime
- status : boolean

**Shift**

- id : Long
- shift : int
- start : LocalTime
- end : LocalTime
- createdAt : LocalDateTime
- updatedAt : LocalDateTime
- status : boolean

Mối quan hệ giữa hai bảng là quan hệ "has" (có), trong đó một WorkSchedule có một Shift và một Shift có thể được sử dụng trong nhiều WorkSchedule (0..\*).
