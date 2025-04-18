import React, { useState, useEffect } from "react";
import {
  DataGrid,
  GridColDef,
  GridCsvExportOptions,
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
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import { Edit, Delete, Add } from "@mui/icons-material";
import { User } from "../../types/user";
import PatientForm from "../../components/admin/PatientForm";
import { getPatients } from "../../services/admin/patients_service";
import { updateInfo } from "../../services/authenticate/user_service";

const PatientManagementPage: React.FC = () => {
  // Khai báo state để quản lý dữ liệu và trạng thái UI
  const [patients, setPatients] = useState<User[]>([]); // Danh sách bệnh nhân - no longer using mock data
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false); // Trạng thái hiển thị form
  const [formMode, setFormMode] = useState<"add" | "edit">("add"); // Chế độ form: thêm mới/chỉnh sửa
  const [selectedPatient, setSelectedPatient] = useState<User | null>(null); // Bệnh nhân đang được chọn
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "info" | "warning";
  }>({
    open: false,
    message: "",
    severity: "info",
  });

  // Fetch patients data when component mounts
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true);
        const response = await getPatients();

        // Transform the date format from DD-MM-YYYY to YYYY-MM-DD for UI compatibility
        const transformedData = response.data.map((patient: any) => {
          // Convert date from DD-MM-YYYY to YYYY-MM-DD
          const dateParts = patient.dob
            ? patient.dob.split("-")
            : ["01", "01", "1970"];
          const formattedDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;

          return {
            ...patient,
            dob: formattedDate,
          };
        });

        setPatients(transformedData);
        showMessage("Dữ liệu bệnh nhân đã được tải thành công", "success");
      } catch (error) {
        console.error("Error fetching patients:", error);
        showMessage("Lỗi khi tải dữ liệu bệnh nhân", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  const csvOptions: GridCsvExportOptions = {
    fileName: "patients",
    delimiter: ",",
    utf8WithBom: true,
  };

  // Hàm mở form thêm bệnh nhân mới
  const handleAddClick = () => {
    setFormMode("add");
    setSelectedPatient(null);
    setIsFormOpen(true);
  };

  // Hàm mở form chỉnh sửa thông tin bệnh nhân
  const handleEditClick = (patient: User) => {
    setFormMode("edit");
    setSelectedPatient(patient);
    setIsFormOpen(true);
  };

  // Hàm đóng form
  const handleFormClose = () => {
    setIsFormOpen(false);
  };

  // Show snackbar message
  const showMessage = (
    message: string,
    severity: "success" | "error" | "info" | "warning"
  ) => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  // Close snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Hàm xử lý khi submit form (áp dụng cho cả thêm mới và chỉnh sửa)
  const handleFormSubmit = async (patientData: Partial<User>) => {
    if (formMode === "add") {
      // Xử lý thêm mới bệnh nhân
      const lastId = Math.max(...patients.map((patient) => patient.id), 0);
      const lastUserId =
        patients.length > 0
          ? parseInt(patients[patients.length - 1].userId.replace("BN", ""))
          : 0;

      // Tạo ID và mã bệnh nhân mới
      const newId = lastId + 1;
      const newUserId = `BN${String(lastUserId + 1).padStart(3, "0")}`;

      const patientToAdd: User = {
        ...(patientData as User),
        id: newId,
        userId: newUserId,
        password: "defaultpassword",
      };

      setPatients([...patients, patientToAdd]);
      showMessage("Thêm bệnh nhân thành công", "success");
    } else {
      // Xử lý chỉnh sửa thông tin bệnh nhân thông qua API
      if (selectedPatient) {
        try {
          setLoading(true);

          // Create a copy of patientData with properly formatted date
          const formattedPatientData = { ...patientData };

          // Convert date from YYYY-MM-DD to DD-MM-YYYY format
          if (formattedPatientData.dob) {
            const dateParts = formattedPatientData.dob.split("-");
            if (dateParts.length === 3) {
              formattedPatientData.dob = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
            }
          }

          const response = await updateInfo(
            selectedPatient.userId,
            formattedPatientData
          );

          if (response.status === 200) {
            // Update local state with the returned patient data
            setPatients(
              patients.map((patient) =>
                patient.id === selectedPatient.id
                  ? { ...patient, ...response.data }
                  : patient
              )
            );
            showMessage("Cập nhật bệnh nhân thành công", "success");
          }
        } catch (error) {
          console.error("Error updating patient:", error);
          showMessage("Lỗi khi cập nhật thông tin bệnh nhân", "error");
        } finally {
          setLoading(false);
        }
      }
    }
    setIsFormOpen(false);
  };

  // Hàm xử lý xóa bệnh nhân
  const handleDeleteClick = (id: number) => {
    // TODO: Thêm xác nhận trước khi xóa
    setPatients(patients.filter((patient) => patient.id !== id));
    showMessage("Xóa bệnh nhân thành công", "success");
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
          label={params.value ? "Nữ" : "Nam"}
          color={params.value ? "secondary" : "info"}
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
      disableExport: true,
      renderCell: (params: GridRenderCellParams) => (
        <Box sx={{ display: "flex", gap: 1, height: "100%" }}>
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
      {/* Phần header với nút thêm bệnh nhân */}
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

      {/* Bảng dữ liệu bệnh nhân */}
      <Paper sx={{ width: "100%" }}>
        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "400px",
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
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
                csvOptions: csvOptions,
              },
            }}
            disableRowSelectionOnClick
            disableColumnFilter={false}
            disableDensitySelector={false}
            disableColumnSelector={false}
          />
        )}
      </Paper>

      {/* Form thêm mới/chỉnh sửa bệnh nhân */}
      <PatientForm
        open={isFormOpen}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
        patient={selectedPatient}
        mode={formMode}
      />

      {/* Snackbar cho thông báo */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PatientManagementPage;
