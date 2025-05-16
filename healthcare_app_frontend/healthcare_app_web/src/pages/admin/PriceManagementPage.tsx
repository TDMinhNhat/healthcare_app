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
  IconButton,
  Paper,
  Button,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import { Edit, Delete, Add } from "@mui/icons-material";
import { Price } from "../../types/price";
import {
  getAll,
  addPrice,
  updatePrice,
  deletePrice,
} from "../../services/admin/price_service";
import PriceForm from "../../components/admin/PriceForm";

// Component quản lý giá
const PriceManagementPage: React.FC = () => {
  // Khai báo state
  const [prices, setPrices] = useState<Price[]>([]);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [formMode, setFormMode] = useState<"add" | "edit">("add");
  const [selectedPrice, setSelectedPrice] = useState<Price | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "info" | "warning";
  }>({
    open: false,
    message: "",
    severity: "info",
  });
  const [formLoading, setFormLoading] = useState<boolean>(false);

  const csvOptions: GridCsvExportOptions = {
    fileName: "prices",
    delimiter: ",",
    utf8WithBom: true,
  };

  // Lấy danh sách giá từ API
  const fetchPrices = async () => {
    try {
      setLoading(true);
      const response = await getAll();
      if (response && response.data) {
        setPrices(response.data);
      } else {
        setError("Không thể tải danh sách giá");
      }
    } catch (error) {
      console.error("Error fetching prices:", error);
      setError("Đã xảy ra lỗi khi tải danh sách giá");
    } finally {
      setLoading(false);
    }
  };

  // Lấy danh sách giá khi component được tạo
  useEffect(() => {
    fetchPrices();
  }, []);

  // Đóng snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Hiển thị thông báo snackbar
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

  // Xử lý sự kiện click nút thêm giá
  const handleAddClick = () => {
    setFormMode("add");
    setSelectedPrice(null);
    setIsFormOpen(true);
  };

  // Xử lý sự kiện click nút chỉnh sửa giá
  const handleEditClick = (price: Price) => {
    setFormMode("edit");
    setSelectedPrice(price);
    setIsFormOpen(true);
  };

  // Xử lý sự kiện đóng form
  const handleFormClose = () => {
    setIsFormOpen(false);
  };

  // Xử lý sự kiện submit form (thêm hoặc chỉnh sửa giá)
  const handleFormSubmit = async (priceData: Partial<Price>) => {
    try {
      setFormLoading(true);
      if (formMode === "add") {
        // Thêm giá mới qua API
        const response = await addPrice(
          priceData as { priceType: string; price: number }
        );
        if (response.code === 200 && response.data) {
          setPrices([...prices, response.data]);
          showMessage("Thêm giá thành công", "success");
        }
      } else {
        // Xử lý cập nhật thông tin giá qua API
        if (selectedPrice) {
          // Gọi API cập nhật với ID của giá đang được chọn
          const response = await updatePrice(
            selectedPrice.id.toString(),
            priceData as { priceType: string; price: number }
          );
          if (response.code === 200 && response.data) {
            setPrices(
              prices.map((price) =>
                price.id === selectedPrice.id ? response.data : price
              )
            );
            showMessage("Cập nhật giá thành công", "success");
          }
        }
      }
      setIsFormOpen(false);
    } catch (error) {
      console.error(
        `Error ${formMode === "add" ? "adding" : "updating"} price:`,
        error
      );
      showMessage(
        `Lỗi khi ${formMode === "add" ? "thêm" : "cập nhật"} giá`,
        "error"
      );
    } finally {
      setFormLoading(false);
    }
  };

  // Xử lý sự kiện xóa giá (thực tế là vô hiệu hóa)
  const handleDeleteClick = async (id: number) => {
    if (window.confirm("Bạn có chắc chắn muốn vô hiệu hóa giá này?")) {
      try {
        // Thay vì xóa, chỉ cập nhật trạng thái thành false
        const priceToUpdate = prices.find((price) => price.id === id);
        if (priceToUpdate) {
          const response = await deletePrice(id.toString());

          if (response.code === 200 && response.data) {
            setPrices(
              prices.map((price) =>
                price.id === id ? { ...price, status: false } : price
              )
            );
            showMessage("Vô hiệu hóa giá thành công", "success");
          }
        }
      } catch (error) {
        console.error("Error deactivating price:", error);
        showMessage("Lỗi khi vô hiệu hóa giá", "error");
      }
    }
  };

  // Định dạng tiền tệ để hiển thị
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Định nghĩa các cột cho DataGrid
  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "ID",
      width: 70,
      flex: 0.5,
    },
    {
      field: "priceType",
      headerName: "Loại giá",
      width: 300,
      flex: 2,
    },
    {
      field: "price",
      headerName: "Giá tiền",
      width: 200,
      flex: 1.5,
      valueFormatter: (value) => formatCurrency(value),
    },
    {
      field: "status",
      headerName: "Trạng thái",
      width: 150,
      flex: 1,
      valueFormatter: (value) => (value ? "Hoạt động" : "Không hoạt động"),
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
      {/* Header với nút Thêm giá */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2, gap: 2 }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={handleAddClick}
        >
          Thêm giá
        </Button>
      </Box>

      {/* Bảng dữ liệu giá */}
      <Paper sx={{ width: "100%" }}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box sx={{ p: 3, color: "error.main" }}>{error}</Box>
        ) : (
          <DataGrid
            rows={prices}
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

      {/* Form giá */}
      <PriceForm
        open={isFormOpen}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
        price={selectedPrice}
        mode={formMode}
        loading={formLoading}
      />

      {/* Snackbar hiển thị thông báo */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
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

export default PriceManagementPage;
