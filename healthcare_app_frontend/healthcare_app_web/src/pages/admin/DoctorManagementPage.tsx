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
import { Edit, Delete, Add, Visibility } from "@mui/icons-material";
import { Doctor } from "../../types/doctor";
import DoctorForm from "../../components/admin/DoctorForm";
import DoctorDetailModal from "../../components/admin/DoctorDetailModal";
import { getAllDoctors, addDoctor } from "../../services/admin/doctor_service";
import { format } from "date-fns";

const DoctorManagementPage: React.FC = () => {
  // Khai báo state để quản lý dữ liệu và trạng thái UI
  const [doctors, setDoctors] = useState<Doctor[]>([]); // Danh sách bác sĩ
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false); // Trạng thái hiển thị form
  const [isDetailOpen, setIsDetailOpen] = useState<boolean>(false); // Trạng thái hiển thị modal chi tiết
  const [formMode, setFormMode] = useState<"add" | "edit">("add"); // Chế độ form: thêm mới/chỉnh sửa
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null); // Bác sĩ đang được chọn
  const [loading, setLoading] = useState<boolean>(true); // Trạng thái loading
  const [error, setError] = useState<string | null>(null); // Lỗi nếu có
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "info" | "warning";
  }>({
    open: false,
    message: "",
    severity: "info",
  });
  const [submitting, setSubmitting] = useState<boolean>(false); // New state for form submission loading

  const csvOptions: GridCsvExportOptions = {
    fileName: "doctors",
    delimiter: ",",
    utf8WithBom: true,
  };

  // Fetch doctors from API when component mounts
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const response = await getAllDoctors();
        if (response && response.data) {
          setDoctors(response.data);
        } else {
          setError("Không thể tải danh sách bác sĩ");
        }
      } catch (error) {
        console.error("Error fetching doctors:", error);
        setError("Đã xảy ra lỗi khi tải danh sách bác sĩ");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  // Close snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
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
    showMessage("Chức năng chỉnh sửa bác sĩ chưa được hỗ trợ", "info");
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
  const handleFormSubmit = async (doctorData: Partial<Doctor>) => {
    try {
      setSubmitting(true); // Start loading
      if (formMode === "add") {
        // Format dob to dd-MM-yyyy
        let formattedDob = "";
        if (doctorData.dob) {
          const dobDate = new Date(doctorData.dob);
          formattedDob = format(dobDate, "dd-MM-yyyy");
        }

        // Extract only disease name if typeDisease exists
        let diseaseInfo = null;
        if (doctorData.typeDisease) {
          diseaseInfo = doctorData.typeDisease.name;
        }

        // Chuẩn bị dữ liệu theo cấu trúc API
        const doctorToAdd = {
          ...doctorData,
          password: "123456789", // Default password
          dob: formattedDob,
          typeDisease: diseaseInfo, // Send only disease name
          certificates: [], // Đảm bảo các mảng là rỗng
          educations: [],
          experiences: [],
        };

        // Log data for debugging
        console.log("Sending doctor data:", JSON.stringify(doctorToAdd));

        // Gọi API thêm bác sĩ
        const response = await addDoctor(doctorToAdd);
        console.log("Response from addDoctor:", response);
        if (response && response.data) {
          // Cập nhật state với bác sĩ mới được thêm vào
          setDoctors([...doctors, response.data]);
          showMessage("Thêm bác sĩ thành công", "success");
        }
      } else {
        showMessage("Chức năng cập nhật bác sĩ chưa được hỗ trợ", "info");
      }
      setIsFormOpen(false);
    } catch (error) {
      console.error("Error submitting doctor data:", error);
      showMessage(
        `Lỗi khi ${formMode === "add" ? "thêm" : "cập nhật"} bác sĩ`,
        "error"
      );
    } finally {
      setSubmitting(false); // End loading regardless of outcome
    }
  };

  // Hàm xử lý xóa bác sĩ
  const handleDeleteClick = (id: number) => {
    showMessage("Chức năng xóa bác sĩ chưa được hỗ trợ", "info");
  };

  // Hàm xử lý cập nhật thông tin chi tiết của bác sĩ (học vấn, chứng chỉ, kinh nghiệm)
  const handleUpdateDoctorDetail = (updatedDoctor: Doctor) => {
    showMessage(
      "Chức năng cập nhật thông tin chi tiết bác sĩ chưa được hỗ trợ",
      "info"
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
      disableExport: true,
      renderCell: (params: GridRenderCellParams) => (
        <Box sx={{ display: "flex", gap: 1, height: "100%" }}>
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
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box sx={{ p: 3, color: "error.main" }}>{error}</Box>
        ) : (
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
                csvOptions: csvOptions,
              },
            }}
            disableRowSelectionOnClick
            disableColumnFilter={false}
            disableDensitySelector={false}
            disableColumnSelector={false}
            loading={loading}
          />
        )}
      </Paper>

      {/* Form thêm mới/chỉnh sửa bác sĩ */}
      <DoctorForm
        open={isFormOpen}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
        doctor={selectedDoctor}
        mode={formMode}
        isSubmitting={submitting} // Pass loading state to form
      />

      {/* Modal xem chi tiết bác sĩ */}
      <DoctorDetailModal
        open={isDetailOpen}
        onClose={handleDetailClose}
        doctor={selectedDoctor}
        onUpdate={handleUpdateDoctorDetail}
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

export default DoctorManagementPage;
