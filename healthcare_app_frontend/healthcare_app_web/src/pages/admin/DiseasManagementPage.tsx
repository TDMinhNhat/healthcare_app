import React, { useState, useEffect, useRef } from "react";
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
import { Edit, Delete, Add, UploadFile } from "@mui/icons-material";
import { Disease } from "../../types/typeDisease";
import DiseaseForm from "../../components/admin/DiseaseForm";
import {
  getAllTypeDiseases,
  addTypeDisease,
  deleteTypeDisease,
  importTypeDisease,
} from "../../services/admin/typeDisease_service";
import * as XLSX from "xlsx";

const DiseasManagementPage: React.FC = () => {
  // Khai báo các state để quản lý dữ liệu và trạng thái giao diện
  const [diseases, setDiseases] = useState<Disease[]>([]); // Lưu trữ danh sách các loại bệnh
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false); // Điều khiển hiển thị/ẩn form
  const [formMode, setFormMode] = useState<"add" | "edit">("add"); // Xác định chế độ của form: thêm mới hoặc chỉnh sửa
  const [selectedDisease, setSelectedDisease] = useState<Disease | null>(null); // Loại bệnh đang được chọn để chỉnh sửa
  const [loading, setLoading] = useState<boolean>(true); // Trạng thái đang tải dữ liệu
  const [error, setError] = useState<string | null>(null); // Thông báo lỗi nếu có
  const [importing, setImporting] = useState<boolean>(false); // Trạng thái đang import dữ liệu
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "info" | "warning";
  }>({
    open: false,
    message: "",
    severity: "info",
  }); // Quản lý thông báo snackbar

  // Tham chiếu đến input file ẩn để mở hộp thoại chọn file khi cần
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cấu hình cho tính năng xuất file CSV
  const csvOptions: GridCsvExportOptions = {
    fileName: "diseases", // Tên file khi xuất
    delimiter: ",", // Ký tự phân cách
    utf8WithBom: true, // Hỗ trợ ký tự Unicode
  };

  /**
   * Hàm lấy danh sách loại bệnh từ API
   * Được tách thành hàm riêng để có thể gọi lại sau khi import
   */
  const fetchDiseases = async () => {
    try {
      setLoading(true); // Bắt đầu trạng thái loading
      const response = await getAllTypeDiseases();
      if (response && response.data) {
        setDiseases(response.data); // Cập nhật state với dữ liệu từ API
      } else {
        setError("Không thể tải danh sách loại bệnh");
      }
    } catch (error) {
      console.error("Error fetching diseases:", error);
      setError("Đã xảy ra lỗi khi tải danh sách loại bệnh");
    } finally {
      setLoading(false); // Kết thúc trạng thái loading
    }
  };

  // Gọi API lấy danh sách loại bệnh khi component được tạo
  useEffect(() => {
    fetchDiseases();
  }, []);

  /**
   * Hàm đóng thông báo snackbar
   */
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  /**
   * Hàm hiển thị thông báo qua snackbar
   * @param message Nội dung thông báo
   * @param severity Mức độ thông báo (success, error, info, warning)
   */
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

  /**
   * Xử lý khi nhấn nút thêm loại bệnh mới
   * Mở form ở chế độ thêm mới
   */
  const handleAddClick = () => {
    setFormMode("add");
    setSelectedDisease(null);
    setIsFormOpen(true);
  };

  /**
   * Xử lý khi nhấn nút chỉnh sửa loại bệnh
   * Mở form ở chế độ chỉnh sửa với dữ liệu của loại bệnh được chọn
   * @param disease Thông tin loại bệnh cần chỉnh sửa
   */
  const handleEditClick = (disease: Disease) => {
    setFormMode("edit");
    setSelectedDisease(disease);
    setIsFormOpen(true);
  };

  /**
   * Xử lý khi đóng form
   */
  const handleFormClose = () => {
    setIsFormOpen(false);
  };

  /**
   * Xử lý khi gửi form thêm mới hoặc chỉnh sửa
   * @param diseaseData Dữ liệu loại bệnh từ form
   */
  const handleFormSubmit = async (diseaseData: Partial<Disease>) => {
    try {
      if (formMode === "add") {
        // Gọi API thêm loại bệnh mới
        const response = await addTypeDisease(diseaseData.name || "");
        if (response && response.data) {
          setDiseases([...diseases, response.data]); // Cập nhật state với loại bệnh mới
          showMessage("Thêm loại bệnh thành công", "success");
        }
      } else {
        // Hiện tại chưa hỗ trợ chức năng cập nhật
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

  /**
   * Xử lý khi nhấn nút xóa (vô hiệu hóa) loại bệnh
   * Thực tế API không xóa mà chỉ đổi trạng thái status từ true sang false
   * @param id ID của loại bệnh cần vô hiệu hóa
   */
  const handleDeleteClick = async (id: number) => {
    if (window.confirm("Bạn có chắc chắn muốn vô hiệu hóa loại bệnh này?")) {
      try {
        // Tìm loại bệnh hiện tại để cập nhật
        const diseaseToUpdate = diseases.find((disease) => disease.id === id);

        if (diseaseToUpdate) {
          // Gọi API vô hiệu hóa loại bệnh
          const response = await deleteTypeDisease(id.toString());

          // Nếu API trả về kết quả thành công
          if (response && response.data) {
            // Cập nhật state với loại bệnh đã vô hiệu hóa (chỉ đổi status, không xóa khỏi danh sách)
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

  /**
   * Xử lý khi nhấn nút import file
   * Mở hộp thoại chọn file
   */
  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  /**
   * Xử lý khi đã chọn file để import
   * Đọc dữ liệu từ file, chuyển đổi và gửi lên API
   * @param e Event khi chọn file
   */
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    const fileName = file.name.toLowerCase();

    // Kiểm tra định dạng file hợp lệ
    if (
      fileName.endsWith(".csv") ||
      fileName.endsWith(".xlsx") ||
      fileName.endsWith(".xls")
    ) {
      setImporting(true); // Bắt đầu trạng thái import
      reader.onload = async (evt) => {
        try {
          // Đọc và phân tích file Excel/CSV
          const data = evt.target?.result;
          const workbook = XLSX.read(data, { type: "binary" });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const rawData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

          // Chuyển đổi dữ liệu thành mảng tên loại bệnh đơn giản
          // Lấy giá trị của cột đầu tiên từ mỗi hàng
          const diseaseNames: string[] = rawData
            .map((row: any) => {
              // Nếu là object, lấy giá trị đầu tiên, ngược lại sử dụng giá trị của row
              const value =
                typeof row === "object" ? Object.values(row)[0] : row;
              return value?.toString() || "";
            })
            .filter((name) => name.trim() !== ""); // Loại bỏ các tên rỗng

          console.log("Tên loại bệnh để import:", diseaseNames);

          try {
            // Gọi API import dữ liệu
            const response = await importTypeDisease(diseaseNames);
            if (response && response.data) {
              showMessage("Import dữ liệu loại bệnh thành công", "success");
              // Cập nhật lại danh sách loại bệnh sau khi import
              fetchDiseases();
            } else {
              showMessage(
                "Đã xảy ra lỗi khi import dữ liệu loại bệnh",
                "error"
              );
            }
          } catch (apiError) {
            console.error("Error importing diseases:", apiError);
            showMessage(
              "Đã xảy ra lỗi khi gửi dữ liệu loại bệnh đến server",
              "error"
            );
          } finally {
            setImporting(false); // Kết thúc trạng thái import
          }
        } catch (parseError) {
          console.error("Error parsing file:", parseError);
          showMessage(
            `Lỗi khi xử lý file ${fileName.endsWith(".csv") ? "CSV" : "Excel"}`,
            "error"
          );
          setImporting(false);
        }
      };
      reader.readAsBinaryString(file);
    } else {
      showMessage("Chỉ hỗ trợ file .csv, .xlsx, .xls", "warning");
    }
    // Reset input để có thể chọn lại cùng một file
    e.target.value = "";
  };

  // Định nghĩa cấu trúc các cột cho bảng dữ liệu
  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "ID", // Mã loại bệnh
      width: 70,
      flex: 0.5,
    },
    {
      field: "name",
      headerName: "Tên loại bệnh", // Tên loại bệnh
      width: 300,
      flex: 2,
    },
    {
      field: "status",
      headerName: "Trạng thái", // Trạng thái hoạt động
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
      headerName: "Thao tác", // Các nút thao tác
      width: 120,
      flex: 0.7,
      sortable: false,
      disableExport: true, // Không xuất cột này khi export
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
      {/* Phần header với các nút thao tác */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2, gap: 2 }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={handleAddClick}
        >
          Thêm loại bệnh
        </Button>
        <Button
          variant="contained"
          color="success"
          startIcon={
            importing ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              <UploadFile />
            )
          }
          onClick={handleImportClick}
          disabled={importing}
          sx={{ fontWeight: 600 }}
        >
          {importing ? "Đang import..." : "Import file"}
        </Button>
        {/* Input ẩn để chọn file import */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,.xlsx,.xls"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
      </Box>

      {/* Bảng dữ liệu loại bệnh */}
      <Paper sx={{ width: "100%" }}>
        {loading ? (
          // Hiển thị loading khi đang tải dữ liệu
          <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          // Hiển thị thông báo lỗi nếu có
          <Box sx={{ p: 3, color: "error.main" }}>{error}</Box>
        ) : (
          // Hiển thị bảng dữ liệu khi đã tải xong
          <DataGrid
            rows={diseases}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 10 }, // Số dòng mỗi trang
              },
            }}
            pageSizeOptions={[5, 10, 25, 50, 100]} // Các tùy chọn số dòng mỗi trang
            slots={{ toolbar: GridToolbar }} // Thanh công cụ với các nút xuất file, lọc,...
            slotProps={{
              toolbar: {
                showQuickFilter: true, // Hiển thị ô tìm kiếm nhanh
                quickFilterProps: { debounceMs: 500 }, // Độ trễ tìm kiếm
                csvOptions: csvOptions, // Cấu hình xuất CSV
              },
            }}
            disableRowSelectionOnClick // Không chọn dòng khi click
            disableColumnFilter={false} // Cho phép lọc cột
            disableDensitySelector={false} // Cho phép thay đổi độ dày dòng
            disableColumnSelector={false} // Cho phép ẩn/hiện cột
            loading={loading} // Trạng thái loading
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

      {/* Snackbar hiển thị thông báo */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000} // Tự động đóng sau 6 giây
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
