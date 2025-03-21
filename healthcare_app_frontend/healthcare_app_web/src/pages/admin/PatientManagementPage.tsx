import React, { useState } from "react";
import {
  DataGrid,
  GridColDef,
  GridValueGetter,
  GridRenderCellParams,
  GridToolbar,
} from "@mui/x-data-grid";
import {
  Box,
  Typography,
  Chip,
  Avatar,
  IconButton,
  Paper,
} from "@mui/material";
import { Edit, Delete, Visibility } from "@mui/icons-material";
import { User, getAge } from "../../types/user";

const PatientManagementPage: React.FC = () => {
  // State cho dữ liệu bệnh nhân
  const [patients, setPatients] = useState<User[]>(mockPatients);

  // Định nghĩa các cột cho bảng dữ liệu
  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "ID",
      width: 70,
    },
    {
      field: "avatar",
      headerName: "Ảnh",
      width: 100,
      renderCell: (params: GridRenderCellParams) => (
        <Avatar src={(params.value as string) || "/default-avatar.png"} />
      ),
      sortable: false,
    },
    {
      field: "userId",
      headerName: "Mã bệnh nhân",
      width: 150,
    },
    {
      field: "firstName",
      headerName: "Họ",
      width: 100,
    },
    {
      field: "lastName",
      headerName: "Tên",
      width: 120,
    },
    {
      field: "sex",
      headerName: "Giới tính",
      width: 120,
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
      width: 150,
      valueGetter: (value) => {
        try {
          return new Date(value).toLocaleDateString("vi-VN");
        } catch (error) {
          return params.value;
        }
      },
    },
    {
      field: "phone",
      headerName: "Số điện thoại",
      width: 150,
    },
    {
      field: "email",
      headerName: "Email",
      width: 220,
    },
    {
      field: "status",
      headerName: "Trạng thái",
      width: 150,
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
      sortable: false,
      renderCell: (params: GridRenderCellParams) => (
        <Box sx={{ display: "flex", gap: 1 }}>
          <IconButton size="small" color="primary" title="Xem chi tiết">
            <Visibility fontSize="small" />
          </IconButton>
          <IconButton size="small" color="info" title="Chỉnh sửa">
            <Edit fontSize="small" />
          </IconButton>
          <IconButton size="small" color="error" title="Xóa">
            <Delete fontSize="small" />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ height: "100%", width: "100%", padding: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Quản lý bệnh nhân
      </Typography>
      <Typography variant="body2" sx={{ mb: 2, color: "text.secondary" }}>
        Danh sách bệnh nhân trong hệ thống
      </Typography>

      <Paper sx={{ height: "calc(100vh - 180px)", width: "100%" }}>
        <DataGrid
          rows={patients}
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
    </Box>
  );
};

// Dữ liệu mẫu cho bệnh nhân
const mockPatients: User[] = [
  {
    id: 1,
    userId: "BN001",
    firstName: "Nguyễn",
    lastName: "Văn An",
    sex: true,
    dob: "1985-05-15",
    phone: "0987654321",
    email: "nguyenvanan@example.com",
    password: "hashedpassword",
    avatar: "https://i.pravatar.cc/150?img=1",
    status: true,
  },
  {
    id: 2,
    userId: "BN002",
    firstName: "Trần",
    lastName: "Thị Bình",
    sex: false,
    dob: "1990-08-22",
    phone: "0912345678",
    email: "tranthibinh@example.com",
    password: "hashedpassword",
    status: true,
  },
  {
    id: 3,
    userId: "BN003",
    firstName: "Lê",
    lastName: "Văn Cường",
    sex: true,
    dob: "1978-12-03",
    phone: "0923456789",
    email: "levancuong@example.com",
    password: "hashedpassword",
    avatar: "https://i.pravatar.cc/150?img=3",
    status: false,
  },
  {
    id: 4,
    userId: "BN004",
    firstName: "Phạm",
    lastName: "Thị Dung",
    sex: false,
    dob: "1995-03-18",
    phone: "0934567890",
    email: "phamthidung@example.com",
    password: "hashedpassword",
    status: true,
  },
  {
    id: 5,
    userId: "BN005",
    firstName: "Hoàng",
    lastName: "Văn Em",
    sex: true,
    dob: "1982-10-30",
    phone: "0945678901",
    email: "hoangvanem@example.com",
    password: "hashedpassword",
    avatar: "https://i.pravatar.cc/150?img=5",
    status: true,
  },
  {
    id: 6,
    userId: "BN006",
    firstName: "Vũ",
    lastName: "Thị Phương",
    sex: false,
    dob: "1988-07-12",
    phone: "0956789012",
    email: "vuthiphuong@example.com",
    password: "hashedpassword",
    status: true,
  },
  {
    id: 7,
    userId: "BN007",
    firstName: "Đỗ",
    lastName: "Văn Giang",
    sex: true,
    dob: "1975-02-25",
    phone: "0967890123",
    email: "dovangiang@example.com",
    password: "hashedpassword",
    avatar: "https://i.pravatar.cc/150?img=7",
    status: false,
  },
  {
    id: 8,
    userId: "BN008",
    firstName: "Ngô",
    lastName: "Thị Hồng",
    sex: false,
    dob: "1992-11-05",
    phone: "0978901234",
    email: "ngothihong@example.com",
    password: "hashedpassword",
    status: true,
  },
  {
    id: 9,
    userId: "BN009",
    firstName: "Trịnh",
    lastName: "Văn Khoa",
    sex: true,
    dob: "1980-06-17",
    phone: "0989012345",
    email: "trinhvankhoa@example.com",
    password: "hashedpassword",
    avatar: "https://i.pravatar.cc/150?img=9",
    status: true,
  },
  {
    id: 10,
    userId: "BN010",
    firstName: "Mai",
    lastName: "Thị Lan",
    sex: false,
    dob: "1998-09-20",
    phone: "0990123456",
    email: "maithilan@example.com",
    password: "hashedpassword",
    status: true,
  },
];

export default PatientManagementPage;
