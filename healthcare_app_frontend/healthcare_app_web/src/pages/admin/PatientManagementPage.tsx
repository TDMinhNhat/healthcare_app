import React, { useState } from "react";
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridToolbar,
} from "@mui/x-data-grid";
import { Box, Chip, Avatar, IconButton, Paper, Button } from "@mui/material";
import { Edit, Delete, Add } from "@mui/icons-material";
import { User } from "../../types/user";
import AddPatientForm from "../../components/admin/AddPatientForm";

const PatientManagementPage: React.FC = () => {
  const [patients, setPatients] = useState<User[]>(mockPatients);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [formMode, setFormMode] = useState<"add" | "edit">("add");
  const [selectedPatient, setSelectedPatient] = useState<User | null>(null);

  // Function to handle opening the form for adding
  const handleAddClick = () => {
    setFormMode("add");
    setSelectedPatient(null);
    setIsFormOpen(true);
  };

  // Function to handle opening the form for editing
  const handleEditClick = (patient: User) => {
    setFormMode("edit");
    setSelectedPatient(patient);
    setIsFormOpen(true);
  };

  // Function to close the form
  const handleFormClose = () => {
    setIsFormOpen(false);
  };

  // Function to handle form submission (both add and edit)
  const handleFormSubmit = (patientData: Partial<User>) => {
    if (formMode === "add") {
      // Add new patient
      const lastId = Math.max(...patients.map((patient) => patient.id), 0);
      const lastUserId =
        patients.length > 0
          ? parseInt(patients[patients.length - 1].userId.replace("BN", ""))
          : 0;

      const newId = lastId + 1;
      const newUserId = `BN${String(lastUserId + 1).padStart(3, "0")}`;

      const patientToAdd: User = {
        ...(patientData as User),
        id: newId,
        userId: newUserId,
        password: "defaultpassword",
      };

      setPatients([...patients, patientToAdd]);
    } else {
      // Edit existing patient
      if (selectedPatient) {
        setPatients(
          patients.map((patient) =>
            patient.id === selectedPatient.id
              ? { ...selectedPatient, ...patientData }
              : patient
          )
        );
      }
    }
    setIsFormOpen(false);
  };

  // Function to handle deleting a patient
  const handleDeleteClick = (id: number) => {
    // Implement delete functionality here
    // For example:
    // setPatients(patients.filter(patient => patient.id !== id));
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
    },
    {
      field: "lastName",
      headerName: "Tên",
      width: 120,
      flex: 0.8,
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
      field: "email",
      headerName: "Email",
      flex: 1,
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
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2, gap: 2 }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={handleAddClick}
        >
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

      {/* Using the form component for both add and edit */}
      <AddPatientForm
        open={isFormOpen}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
        patient={selectedPatient}
        mode={formMode}
      />
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
