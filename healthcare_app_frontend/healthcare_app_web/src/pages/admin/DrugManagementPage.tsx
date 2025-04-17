import React, { useState, useEffect, useRef } from "react";
import {
  DataGrid,
  GridColDef,
  GridCsvExportOptions,
  GridRenderCellParams,
  GridToolbar,
} from "@mui/x-data-grid";
import {
  Box,
  IconButton,
  Paper,
  Button,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import { Edit, Delete, Add, UploadFile } from "@mui/icons-material";
import { Drug } from "../../types/medical";
import DrugForm from "../../components/admin/DrugForm";
import {
  getDrugs,
  addDrug,
  updateDrug,
  importDrug,
} from "../../services/admin/drugs_service";
import * as XLSX from "xlsx";

const DrugManagementPage: React.FC = () => {
  // Khai báo state để quản lý dữ liệu và trạng thái UI
  const [drugs, setDrugs] = useState<Drug[]>([]); // Danh sách thuốc
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false); // Trạng thái hiển thị form
  const [formMode, setFormMode] = useState<"add" | "edit">("add"); // Chế độ form: thêm mới/chỉnh sửa
  const [selectedDrug, setSelectedDrug] = useState<Drug | null>(null); // Thuốc đang được chọn
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
  const [importing, setImporting] = useState<boolean>(false); // Add this state for importing status

  const csvOptions: GridCsvExportOptions = {
    fileName: "drugs",
    delimiter: ",",
    utf8WithBom: true,
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchDrugs = async () => {
    try {
      setLoading(true);
      const response = await getDrugs();
      if (response && response.data) {
        setDrugs(response.data);
      } else {
        setError("Không thể tải danh sách thuốc");
      }
    } catch (error) {
      console.error("Error fetching drugs:", error);
      setError("Đã xảy ra lỗi khi tải danh sách thuốc");
    } finally {
      setLoading(false);
    }
  };

  // Fetch drugs from API when component mounts
  useEffect(() => {
    fetchDrugs();
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

  // Hàm mở form thêm thuốc mới
  const handleAddClick = () => {
    setFormMode("add");
    setSelectedDrug(null);
    setIsFormOpen(true);
  };

  // Hàm mở form chỉnh sửa thông tin thuốc
  const handleEditClick = (drug: Drug) => {
    setFormMode("edit");
    setSelectedDrug(drug);
    setIsFormOpen(true);
  };

  // Hàm đóng form
  const handleFormClose = () => {
    setIsFormOpen(false);
  };

  // Hàm xử lý khi submit form (áp dụng cho cả thêm mới và chỉnh sửa)
  const handleFormSubmit = async (drugData: Partial<Drug>) => {
    try {
      if (formMode === "add") {
        // Xử lý thêm mới thuốc qua API
        const response = await addDrug(drugData);
        if (response && response.data) {
          setDrugs([...drugs, response.data]);
          showMessage("Thêm thuốc thành công", "success");
        }
      } else {
        // Xử lý chỉnh sửa thông tin thuốc qua API
        if (selectedDrug) {
          const response = await updateDrug(
            selectedDrug.id.toString(),
            drugData
          );
          if (response && response.data) {
            console.log("Fetched drugs:", response.data);
            setDrugs(
              drugs.map((drug) =>
                drug.id === selectedDrug.id ? response.data : drug
              )
            );
            showMessage("Cập nhật thuốc thành công", "success");
          }
        }
      }
      setIsFormOpen(false);
    } catch (error) {
      console.error(
        `Error ${formMode === "add" ? "adding" : "updating"} drug:`,
        error
      );
      showMessage(
        `Lỗi khi ${formMode === "add" ? "thêm" : "cập nhật"} thuốc`,
        "error"
      );
    }
  };

  // Hàm xử lý xóa thuốc (chưa kết nối API)
  const handleDeleteClick = (id: number) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa thuốc này?")) {
      setDrugs(drugs.filter((drug) => drug.id !== id));
      showMessage("Xóa thuốc thành công", "success");
    }
  };

  // Hàm xử lý import file
  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    const fileName = file.name.toLowerCase();

    if (
      fileName.endsWith(".csv") ||
      fileName.endsWith(".xlsx") ||
      fileName.endsWith(".xls")
    ) {
      setImporting(true); // Set importing status to true
      reader.onload = async (evt) => {
        try {
          const data = evt.target?.result;
          const workbook = XLSX.read(data, { type: "binary" });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const json = XLSX.utils.sheet_to_json(worksheet, { defval: "" });
          console.log("File to JSON:", json);

          // Call the import API
          try {
            const response = await importDrug(json);
            if (response && response.data) {
              showMessage("Import dữ liệu thuốc thành công", "success");
              // Refresh drug list after successful import
              fetchDrugs();
            } else {
              showMessage("Đã xảy ra lỗi khi import dữ liệu thuốc", "error");
            }
          } catch (apiError) {
            console.error("Error importing drugs:", apiError);
            showMessage(
              "Đã xảy ra lỗi khi gửi dữ liệu thuốc đến server",
              "error"
            );
          } finally {
            setImporting(false);
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
    // Reset input để có thể chọn lại cùng 1 file
    e.target.value = "";
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
      field: "drugName",
      headerName: "Tên thuốc",
      width: 300,
      flex: 2,
    },
    {
      field: "drugType",
      headerName: "Loại thuốc",
      width: 200,
      flex: 1.5,
    },
    {
      field: "unit",
      headerName: "Đơn vị",
      width: 150,
      flex: 1,
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
      {/* Phần header với nút thêm thuốc và import file */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2, gap: 2 }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={handleAddClick}
        >
          Thêm thuốc
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
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,.xlsx,.xls"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
      </Box>

      {/* Bảng dữ liệu thuốc */}
      <Paper sx={{ width: "100%" }}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box sx={{ p: 3, color: "error.main" }}>{error}</Box>
        ) : (
          <DataGrid
            rows={drugs}
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

      {/* Form thêm mới/chỉnh sửa thuốc */}
      <DrugForm
        open={isFormOpen}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
        drug={selectedDrug}
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

export default DrugManagementPage;
