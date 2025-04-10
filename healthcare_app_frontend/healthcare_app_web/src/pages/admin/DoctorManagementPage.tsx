import React, { useState } from "react";
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridToolbar,
} from "@mui/x-data-grid";
import { Box, Chip, Avatar, IconButton, Paper, Button } from "@mui/material";
import { Edit, Delete, Add, Visibility } from "@mui/icons-material";
import { Doctor } from "../../types/doctor";
import DoctorForm from "../../components/admin/DoctorForm";
import DoctorDetailModal from "../../components/admin/DoctorDetailModal";

const DoctorManagementPage: React.FC = () => {
  // Khai báo state để quản lý dữ liệu và trạng thái UI
  const [doctors, setDoctors] = useState<Doctor[]>(mockDoctors); // Danh sách bác sĩ
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false); // Trạng thái hiển thị form
  const [isDetailOpen, setIsDetailOpen] = useState<boolean>(false); // Trạng thái hiển thị modal chi tiết
  const [formMode, setFormMode] = useState<"add" | "edit">("add"); // Chế độ form: thêm mới/chỉnh sửa
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null); // Bác sĩ đang được chọn

  // Hàm mở form thêm bác sĩ mới
  const handleAddClick = () => {
    setFormMode("add");
    setSelectedDoctor(null);
    setIsFormOpen(true);
  };

  // Hàm mở form chỉnh sửa thông tin bác sĩ
  const handleEditClick = (doctor: Doctor) => {
    setFormMode("edit");
    setSelectedDoctor(doctor);
    setIsFormOpen(true);
  };

  // Hàm mở modal xem chi tiết bác sĩ
  const handleViewDetail = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setIsDetailOpen(true);
  };

  // Hàm đóng form
  const handleFormClose = () => {
    setIsFormOpen(false);
  };

  // Hàm đóng modal chi tiết
  const handleDetailClose = () => {
    setIsDetailOpen(false);
  };

  // Hàm xử lý khi submit form (áp dụng cho cả thêm mới và chỉnh sửa)
  const handleFormSubmit = (doctorData: Partial<Doctor>) => {
    if (formMode === "add") {
      // Xử lý thêm mới bác sĩ
      const lastId = Math.max(...doctors.map((doctor) => doctor.id), 0);
      const lastUserId =
        doctors.length > 0
          ? parseInt(doctors[doctors.length - 1].userId.replace("BS", ""))
          : 0;

      // Tạo ID và mã bác sĩ mới
      const newId = lastId + 1;
      const newUserId = `BS${String(lastUserId + 1).padStart(3, "0")}`;

      const doctorToAdd: Doctor = {
        ...(doctorData as Doctor),
        id: newId,
        userId: newUserId,
        password: "defaultpassword",
      };

      setDoctors([...doctors, doctorToAdd]);
    } else {
      // Xử lý chỉnh sửa thông tin bác sĩ
      if (selectedDoctor) {
        setDoctors(
          doctors.map((doctor) =>
            doctor.id === selectedDoctor.id
              ? { ...selectedDoctor, ...doctorData }
              : doctor
          )
        );
      }
    }
    setIsFormOpen(false);
  };

  // Hàm xử lý xóa bác sĩ
  const handleDeleteClick = (id: number) => {
    // TODO: Cần thêm xác nhận trước khi xóa
    setDoctors(doctors.filter((doctor) => doctor.id !== id));
  };

  // Hàm xử lý cập nhật thông tin chi tiết của bác sĩ (học vấn, chứng chỉ, kinh nghiệm)
  const handleUpdateDoctorDetail = (updatedDoctor: Doctor) => {
    setDoctors(
      doctors.map((doctor) =>
        doctor.id === updatedDoctor.id ? updatedDoctor : doctor
      )
    );
  };

  // Định nghĩa cấu trúc các cột cho bảng dữ liệu
  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "ID",
      width: 70,
      flex: 0.5,
    },
    {
      field: "avatar",
      headerName: "Ảnh",
      width: 80,
      flex: 0.5,
      renderCell: (params: GridRenderCellParams) => (
        <Avatar src={(params.value as string) || "/default-avatar.png"} />
      ),
      sortable: false,
    },
    {
      field: "userId",
      headerName: "Mã bác sĩ",
      width: 120,
      flex: 0.8,
    },
    {
      field: "firstName",
      headerName: "Họ",
      width: 100,
      flex: 0.8,
    },
    {
      field: "lastName",
      headerName: "Tên",
      width: 120,
      flex: 0.8,
    },
    {
      field: "specialization",
      headerName: "Chuyên khoa",
      width: 150,
      flex: 1,
    },
    {
      field: "sex",
      headerName: "Giới tính",
      width: 100,
      flex: 0.7,
      renderCell: (params: GridRenderCellParams) => (
        <Chip
          label={params.value ? "Nam" : "Nữ"}
          color={params.value ? "info" : "secondary"}
          size="small"
        />
      ),
    },
    {
      field: "dob",
      headerName: "Ngày sinh",
      width: 120,
      flex: 0.8,
      renderCell: (params: GridRenderCellParams) =>
        new Date(params.row.dob).toLocaleDateString("vi-VN"),
    },
    {
      field: "phone",
      headerName: "Số điện thoại",
      width: 130,
      flex: 0.8,
    },
    {
      field: "status",
      headerName: "Trạng thái",
      width: 130,
      flex: 0.8,
      renderCell: (params: GridRenderCellParams) => (
        <Chip
          label={params.value ? "Đang hoạt động" : "Không hoạt động"}
          color={params.value ? "success" : "error"}
          size="small"
        />
      ),
    },
    {
      field: "actions",
      headerName: "Thao tác",
      width: 150,
      flex: 1,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => (
        <Box sx={{ display: "flex", gap: 1 }}>
          <IconButton
            size="small"
            color="primary"
            title="Xem chi tiết"
            onClick={() => handleViewDetail(params.row)}
          >
            <Visibility fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            color="info"
            title="Chỉnh sửa"
            onClick={() => handleEditClick(params.row)}
          >
            <Edit fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            color="error"
            title="Xóa"
            onClick={() => handleDeleteClick(params.row.id)}
          >
            <Delete fontSize="small" />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ height: "100%", width: "100%", padding: 0 }}>
      {/* Phần header với nút thêm bác sĩ */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2, gap: 2 }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={handleAddClick}
        >
          Thêm bác sĩ
        </Button>
      </Box>

      {/* Bảng dữ liệu bác sĩ */}
      <Paper sx={{ width: "100%" }}>
        <DataGrid
          rows={doctors}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 10 },
            },
          }}
          pageSizeOptions={[5, 10, 25, 50, 100]}
          slots={{ toolbar: GridToolbar }}
          slotProps={{
            toolbar: {
              showQuickFilter: true,
              quickFilterProps: { debounceMs: 500 },
            },
          }}
          disableRowSelectionOnClick
          disableColumnFilter={false}
          disableDensitySelector={false}
          disableColumnSelector={false}
        />
      </Paper>

      {/* Form thêm mới/chỉnh sửa bác sĩ */}
      <DoctorForm
        open={isFormOpen}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
        doctor={selectedDoctor}
        mode={formMode}
      />

      {/* Modal xem chi tiết bác sĩ */}
      <DoctorDetailModal
        open={isDetailOpen}
        onClose={handleDetailClose}
        doctor={selectedDoctor}
        onUpdate={handleUpdateDoctorDetail}
      />
    </Box>
  );
};

// Dữ liệu mẫu cho danh sách bác sĩ
const mockDoctors: Doctor[] = [
  {
    id: 1,
    userId: "BS001",
    firstName: "Nguyễn",
    lastName: "Văn A",
    sex: true,
    dob: "1980-05-15",
    phone: "0987654321",
    email: "nguyenvana@example.com",
    password: "hashedpassword",
    avatar: "https://i.pravatar.cc/150?img=1",
    status: true,
    specialization: "Nội khoa",
    experience: {
      id: 1,
      compName: "Bệnh viện Bạch Mai",
      specialization: "Nội khoa",
      startDate: "2010-01-01",
      endDate: "2018-12-31",
      compAddress: {
        id: 1,
        number: "78",
        street: "Giải Phóng",
        ward: "Phương Mai",
        district: "Đống Đa",
        city: "Hà Nội",
      },
      description: "Bác sĩ nội trú khoa Nội tại Bệnh viện Bạch Mai",
    },
    educations: [
      {
        id: 1,
        doctorId: 1,
        schoolName: "Đại học Y Hà Nội",
        joinedDate: "2000-09-01",
        graduateDate: "2006-06-30",
        diploma: "BACHELOR",
      },
      {
        id: 2,
        doctorId: 1,
        schoolName: "Đại học Y Hà Nội",
        joinedDate: "2007-09-01",
        graduateDate: "2009-06-30",
        diploma: "MASTER",
      },
    ],
    certificates: [
      {
        id: 1,
        doctorId: 1,
        certName: "Chứng chỉ hành nghề khám chữa bệnh",
        issueDate: "2007-01-15",
        address: {
          id: 2,
          number: "138",
          street: "Giảng Võ",
          ward: "Ba Đình",
          district: "Ba Đình",
          city: "Hà Nội",
        },
      },
    ],
  },
  {
    id: 2,
    userId: "BS002",
    firstName: "Trần",
    lastName: "Thị B",
    sex: false,
    dob: "1985-08-22",
    phone: "0912345678",
    email: "tranthib@example.com",
    password: "hashedpassword",
    avatar: "https://i.pravatar.cc/150?img=2",
    status: true,
    specialization: "Nhi khoa",
    experience: {
      id: 2,
      compName: "Bệnh viện Nhi Trung Ương",
      specialization: "Nhi khoa",
      startDate: "2012-01-01",
      compAddress: {
        id: 3,
        number: "18",
        street: "Ngọc Khánh",
        ward: "Giảng Võ",
        district: "Ba Đình",
        city: "Hà Nội",
      },
      description: "Bác sĩ chuyên khoa Nhi tại Bệnh viện Nhi Trung Ương",
    },
    educations: [
      {
        id: 3,
        doctorId: 2,
        schoolName: "Đại học Y Dược TP.HCM",
        joinedDate: "2004-09-01",
        graduateDate: "2010-06-30",
        diploma: "BACHELOR",
      },
    ],
  },
];

export default DoctorManagementPage;
