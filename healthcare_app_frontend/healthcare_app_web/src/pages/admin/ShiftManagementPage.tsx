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
import { Shift } from "../../types/shift";
import ShiftForm from "../../components/admin/ShiftForm";
import {
  getShifts,
  addShift,
  deleteShift,
} from "../../services/admin/shifts_service";
import { formatTimeFromTimeString } from "../../utils/dateUtils";

const ShiftManagementPage: React.FC = () => {
  // Khai báo state để quản lý dữ liệu và trạng thái UI
  const [shifts, setShifts] = useState<Shift[]>([]); // Danh sách ca làm việc
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false); // Trạng thái hiển thị form
  const [formMode, setFormMode] = useState<"add" | "edit">("add"); // Chế độ form: thêm mới/chỉnh sửa
  const [selectedShift, setSelectedShift] = useState<Shift | null>(null); // Ca làm việc đang được chọn
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
    fileName: "shifts",
    delimiter: ",",
    utf8WithBom: true,
  };

  // Fetch shifts from API when component mounts
  useEffect(() => {
    const fetchShifts = async () => {
      try {
        setLoading(true);
        const response = await getShifts();
        if (response && response.data) {
          setShifts(response.data);
        } else {
          setError("Không thể tải danh sách ca làm việc");
        }
      } catch (error) {
        console.error("Error fetching shifts:", error);
        setError("Đã xảy ra lỗi khi tải danh sách ca làm việc");
      } finally {
        setLoading(false);
      }
    };

    fetchShifts();
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

  // Hàm mở form thêm ca làm việc mới
  const handleAddClick = () => {
    setFormMode("add");
    setSelectedShift(null);
    setIsFormOpen(true);
  };

  // Hàm mở form chỉnh sửa thông tin ca làm việc
  const handleEditClick = (shift: Shift) => {
    setFormMode("edit");
    setSelectedShift(shift);
    setIsFormOpen(true);
  };

  // Hàm đóng form
  const handleFormClose = () => {
    setIsFormOpen(false);
  };

  // Hàm xử lý khi submit form (áp dụng cho cả thêm mới và chỉnh sửa)
  const handleFormSubmit = async (shiftData: Partial<Shift>) => {
    try {
      // Format time for API (convert HH:MM to HH-MM)
      const formattedShiftData = {
        ...shiftData,
        start: shiftData.start ? shiftData.start.replace(":", "-") : "",
        end: shiftData.end ? shiftData.end.replace(":", "-") : "",
      };

      if (formMode === "add") {
        // Xử lý thêm mới ca làm việc qua API
        const response = await addShift(formattedShiftData);
        if (response && response.data) {
          setShifts([...shifts, response.data]);
          showMessage("Thêm ca làm việc thành công", "success");
        }
      } else {
        // Xử lý chỉnh sửa thông tin ca làm việc (client-side vì chưa có API)
        if (selectedShift) {
          // Tạm thời cập nhật trên client cho đến khi có API updateShift
          const updatedShift = { ...selectedShift, ...formattedShiftData };
          setShifts(
            shifts.map((shift) =>
              shift.id === selectedShift.id ? updatedShift : shift
            )
          );
          showMessage("Cập nhật ca làm việc thành công", "success");
        }
      }
      setIsFormOpen(false);
    } catch (error) {
      console.error(
        `Error ${formMode === "add" ? "adding" : "updating"} shift:`,
        error
      );
      showMessage(
        `Lỗi khi ${formMode === "add" ? "thêm" : "cập nhật"} ca làm việc`,
        "error"
      );
    }
  };

  // Hàm xử lý "xóa" ca làm việc - thực tế là vô hiệu hóa (cập nhật status = false)
  const handleDeleteClick = async (id: number) => {
    if (window.confirm("Bạn có chắc chắn muốn vô hiệu hóa ca làm việc này?")) {
      try {
        // Tìm ca làm việc hiện tại để cập nhật
        const shiftToUpdate = shifts.find((shift) => shift.id === id);

        if (shiftToUpdate) {
          // Gửi yêu cầu vô hiệu hóa (sử dụng deleteShift nhưng thực tế là cập nhật status)
          const response = await deleteShift(id.toString());

          // Nếu API trả về kết quả thành công
          if (response && response.data) {
            // Cập nhật state với ca làm việc đã vô hiệu hóa (không xóa khỏi danh sách)
            setShifts(
              shifts.map((shift) =>
                shift.id === id ? { ...shift, status: false } : shift
              )
            );
            showMessage("Vô hiệu hóa ca làm việc thành công", "success");
          }
        }
      } catch (error) {
        console.error("Error deactivating shift:", error);
        showMessage("Lỗi khi vô hiệu hóa ca làm việc", "error");
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
      field: "shift",
      headerName: "Ca số",
      width: 100,
      flex: 1,
    },
    {
      field: "start",
      headerName: "Giờ bắt đầu",
      width: 150,
      flex: 1,
      valueFormatter: (value) => formatTimeFromTimeString(value, "string"),
    },
    {
      field: "end",
      headerName: "Giờ kết thúc",
      width: 150,
      flex: 1,
      valueFormatter: (value) => formatTimeFromTimeString(value, "string"),
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
      width: 70,
      flex: 0.5,
      sortable: false,
      disableExport: true,
      renderCell: (params: GridRenderCellParams) => (
        <Box
          sx={{
            display: "flex",
            gap: 1,
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {/* <IconButton
            size="small"
            color="info"
            title="Chỉnh sửa"
            onClick={() => handleEditClick(params.row)}
          >
            <Edit fontSize="small" />
          </IconButton> */}
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
      {/* Phần header với nút thêm ca làm việc */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2, gap: 2 }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={handleAddClick}
        >
          Thêm ca làm việc
        </Button>
      </Box>

      {/* Bảng dữ liệu ca làm việc */}
      <Paper sx={{ width: "100%" }}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box sx={{ p: 3, color: "error.main" }}>{error}</Box>
        ) : (
          <DataGrid
            rows={shifts}
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

      {/* Form thêm mới/chỉnh sửa ca làm việc */}
      <ShiftForm
        open={isFormOpen}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
        shift={selectedShift}
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

export default ShiftManagementPage;
