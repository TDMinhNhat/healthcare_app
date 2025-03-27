import React, { useState } from "react";
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridToolbar,
} from "@mui/x-data-grid";
import {
  Box,
  Chip,
  Avatar,
  IconButton,
  Paper,
  Button,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import { Edit, Delete, Add, Save, Cancel } from "@mui/icons-material";
import { User } from "../../types/user";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { vi } from "date-fns/locale";

const PatientManagementPage: React.FC = () => {
  const [patients, setPatients] = useState<User[]>(mockPatients);
  const [editRowId, setEditRowId] = useState<number | null>(null);
  const [editedRow, setEditedRow] = useState<User | null>(null);

  // Function to handle entering edit mode
  const handleEditClick = (patient: User) => {
    setEditRowId(patient.id);
    setEditedRow({ ...patient });
  };

  // Function to handle saving changes
  const handleSaveClick = () => {
    if (editedRow) {
      setPatients(
        patients.map((patient) =>
          patient.id === editRowId ? editedRow : patient
        )
      );
      setEditRowId(null);
      setEditedRow(null);
    }
  };

  // Function to handle canceling edit mode
  const handleCancelClick = () => {
    setEditRowId(null);
    setEditedRow(null);
  };

  // Function to handle field changes
  const handleFieldChange = (field: keyof User, value: any) => {
    if (editedRow) {
      setEditedRow({ ...editedRow, [field]: value });
    }
  };

  // Định nghĩa các cột cho bảng dữ liệu
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
      headerName: "Mã bệnh nhân",
      width: 120,
      flex: 0.8,
    },
    {
      field: "firstName",
      headerName: "Họ",
      width: 100,
      flex: 0.8,
      renderCell: (params: GridRenderCellParams) => {
        return editRowId === params.row.id ? (
          <TextField
            size="small"
            value={editedRow?.firstName || ""}
            onChange={(e) => handleFieldChange("firstName", e.target.value)}
            fullWidth
          />
        ) : (
          params.value
        );
      },
    },
    {
      field: "lastName",
      headerName: "Tên",
      width: 120,
      flex: 0.8,
      renderCell: (params: GridRenderCellParams) => {
        return editRowId === params.row.id ? (
          <TextField
            size="small"
            value={editedRow?.lastName || ""}
            onChange={(e) => handleFieldChange("lastName", e.target.value)}
            fullWidth
          />
        ) : (
          params.value
        );
      },
    },
    {
      field: "sex",
      headerName: "Giới tính",
      width: 100,
      flex: 0.7,
      renderCell: (params: GridRenderCellParams) => {
        return editRowId === params.row.id ? (
          <FormControl fullWidth size="small">
            <Select
              value={editedRow?.sex ?? false}
              onChange={(e) => handleFieldChange("sex", e.target.value)}
            >
              <MenuItem value={true}>Nam</MenuItem>
              <MenuItem value={false}>Nữ</MenuItem>
            </Select>
          </FormControl>
        ) : (
          <Chip
            label={params.value ? "Nam" : "Nữ"}
            color={params.value ? "info" : "secondary"}
            size="small"
          />
        );
      },
    },
    {
      field: "dob",
      headerName: "Ngày sinh",
      width: 120,
      flex: 0.8,
      renderCell: (params: GridRenderCellParams) => {
        if (editRowId === params.row.id) {
          return (
            <LocalizationProvider
              dateAdapter={AdapterDateFns}
              adapterLocale={vi}
            >
              <DatePicker
                value={new Date(editedRow?.dob || "")}
                onChange={(newValue) => {
                  if (newValue) {
                    const dateStr = newValue.toISOString().split("T")[0];
                    handleFieldChange("dob", dateStr);
                  }
                }}
                slotProps={{ textField: { size: "small", fullWidth: true } }}
              />
            </LocalizationProvider>
          );
        }
        return new Date(params.row.dob).toLocaleDateString("vi-VN");
      },
    },
    {
      field: "phone",
      headerName: "Số điện thoại",
      width: 130,
      flex: 0.8,
      renderCell: (params: GridRenderCellParams) => {
        return editRowId === params.row.id ? (
          <TextField
            size="small"
            value={editedRow?.phone || ""}
            onChange={(e) => handleFieldChange("phone", e.target.value)}
            fullWidth
          />
        ) : (
          params.value
        );
      },
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
      renderCell: (params: GridRenderCellParams) => {
        return editRowId === params.row.id ? (
          <TextField
            size="small"
            value={editedRow?.email || ""}
            onChange={(e) => handleFieldChange("email", e.target.value)}
            fullWidth
          />
        ) : (
          params.value
        );
      },
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
      width: 120,
      flex: 0.7,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => (
        <Box sx={{ display: "flex", gap: 1 }}>
          {editRowId === params.row.id ? (
            <>
              <IconButton
                size="small"
                color="success"
                title="Lưu"
                onClick={handleSaveClick}
              >
                <Save fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                color="warning"
                title="Hủy"
                onClick={handleCancelClick}
              >
                <Cancel fontSize="small" />
              </IconButton>
            </>
          ) : (
            <>
              <IconButton
                size="small"
                color="info"
                title="Chỉnh sửa"
                onClick={() => handleEditClick(params.row)}
              >
                <Edit fontSize="small" />
              </IconButton>
              <IconButton size="small" color="error" title="Xóa">
                <Delete fontSize="small" />
              </IconButton>
            </>
          )}
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ height: "100%", width: "100%", padding: 0 }}>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2, gap: 2 }}>
        <Button variant="contained" color="primary" startIcon={<Add />}>
          Thêm bệnh nhân
        </Button>
      </Box>

      <Paper sx={{ width: "100%" }}>
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
