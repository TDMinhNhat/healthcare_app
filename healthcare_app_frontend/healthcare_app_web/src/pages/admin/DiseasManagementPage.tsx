import React, { useState, useEffect } from "react";
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridToolbar,
  GridCsvExportOptions,
} from "@mui/x-data-grid";
import {
  Box,
  IconButton,
  Paper,
  Button,
  Chip,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import { Edit, Delete, Add } from "@mui/icons-material";
import { Disease } from "../../types/typeDisease";
import DiseaseForm from "../../components/admin/DiseaseForm";
import {
  getAllTypeDiseases,
  addTypeDisease,
  deleteTypeDisease,
} from "../../services/admin/typeDisease_service";

const DiseasManagementPage: React.FC = () => {
  // Khai báo state để quản lý dữ liệu và trạng thái UI
  const [diseases, setDiseases] = useState<Disease[]>([]); // Danh sách bệnh
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false); // Trạng thái hiển thị form
  const [formMode, setFormMode] = useState<"add" | "edit">("add"); // Chế độ form: thêm mới/chỉnh sửa
  const [selectedDisease, setSelectedDisease] = useState<Disease | null>(null); // Bệnh đang được chọn
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

  // CSV options
  const csvOptions: GridCsvExportOptions = {
    fileName: "diseases",
    delimiter: ",",
    utf8WithBom: true,
  };

  // Fetch diseases from API when component mounts
  useEffect(() => {
    const fetchDiseases = async () => {
      try {
        setLoading(true);
        const response = await getAllTypeDiseases();
        if (response && response.data) {
          setDiseases(response.data);
        } else {
          setError("Không thể tải danh sách loại bệnh");
        }
      } catch (error) {
        console.error("Error fetching diseases:", error);
        setError("Đã xảy ra lỗi khi tải danh sách loại bệnh");
      } finally {
        setLoading(false);
      }
    };

    fetchDiseases();
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

  // Hàm mở form thêm bệnh mới
  const handleAddClick = () => {
    setFormMode("add");
    setSelectedDisease(null);
    setIsFormOpen(true);
  };

  // Hàm mở form chỉnh sửa thông tin bệnh
  const handleEditClick = (disease: Disease) => {
    setFormMode("edit");
    setSelectedDisease(disease);
    setIsFormOpen(true);
  };

  // Hàm đóng form
  const handleFormClose = () => {
    setIsFormOpen(false);
  };

  // Hàm xử lý khi submit form (áp dụng cho cả thêm mới và chỉnh sửa)
  const handleFormSubmit = async (diseaseData: Partial<Disease>) => {
    try {
      if (formMode === "add") {
        // Xử lý thêm mới bệnh qua API
        const response = await addTypeDisease(diseaseData.name || "");
        if (response && response.data) {
          setDiseases([...diseases, response.data]);
          showMessage("Thêm loại bệnh thành công", "success");
        }
      } else {
        showMessage("Chức năng cập nhật chưa được hỗ trợ", "info");
      }
      setIsFormOpen(false);
    } catch (error) {
      console.error(
        `Error ${formMode === "add" ? "adding" : "updating"} disease:`,
        error
      );
      showMessage(
        `Lỗi khi ${formMode === "add" ? "thêm" : "cập nhật"} loại bệnh`,
        "error"
      );
    }
  };

  // Hàm xử lý vô hiệu hóa loại bệnh (thay đổi status)
  const handleDeleteClick = async (id: number) => {
    if (window.confirm("Bạn có chắc chắn muốn vô hiệu hóa loại bệnh này?")) {
      try {
        // Tìm loại bệnh hiện tại để cập nhật
        const diseaseToUpdate = diseases.find((disease) => disease.id === id);

        if (diseaseToUpdate) {
          // Gửi yêu cầu vô hiệu hóa (sử dụng deleteTypeDisease nhưng thực tế chỉ đổi status)
          const response = await deleteTypeDisease(id.toString());

          // Nếu API trả về kết quả thành công
          if (response && response.data) {
            // Cập nhật state với loại bệnh đã vô hiệu hóa (không xóa khỏi danh sách)
            setDiseases(
              diseases.map((disease) =>
                disease.id === id ? { ...disease, status: false } : disease
              )
            );
            showMessage("Vô hiệu hóa loại bệnh thành công", "success");
          }
        }
      } catch (error) {
        console.error("Error deactivating disease:", error);
        showMessage("Lỗi khi vô hiệu hóa loại bệnh", "error");
      }
    }
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
      field: "name",
      headerName: "Tên loại bệnh",
      width: 300,
      flex: 2,
    },
    {
      field: "status",
      headerName: "Trạng thái",
      width: 150,
      flex: 1,
      renderCell: (params: GridRenderCellParams) => (
        <Chip
          label={params.value ? "Hoạt động" : "Không hoạt động"}
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
      {/* Phần header với nút thêm loại bệnh */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2, gap: 2 }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={handleAddClick}
        >
          Thêm loại bệnh
        </Button>
      </Box>

      {/* Bảng dữ liệu loại bệnh */}
      <Paper sx={{ width: "100%" }}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box sx={{ p: 3, color: "error.main" }}>{error}</Box>
        ) : (
          <DataGrid
            rows={diseases}
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

      {/* Form thêm mới/chỉnh sửa loại bệnh */}
      <DiseaseForm
        open={isFormOpen}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
        disease={selectedDisease}
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

export default DiseasManagementPage;
