import React, { useState } from "react";
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridToolbar,
  GridCsvExportOptions,
} from "@mui/x-data-grid";
import { Box, IconButton, Paper, Button, Chip } from "@mui/material";
import { Edit, Delete, Add } from "@mui/icons-material";
import { Shift } from "../../types/shift";
import ShiftForm from "../../components/admin/ShiftForm";

const ShiftManagementPage: React.FC = () => {
  // Khai báo state để quản lý dữ liệu và trạng thái UI
  const [shifts, setShifts] = useState<Shift[]>(mockShifts); // Danh sách ca làm việc
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false); // Trạng thái hiển thị form
  const [formMode, setFormMode] = useState<"add" | "edit">("add"); // Chế độ form: thêm mới/chỉnh sửa
  const [selectedShift, setSelectedShift] = useState<Shift | null>(null); // Ca làm việc đang được chọn

  // CSV options
  const csvOptions: GridCsvExportOptions = {
    fileName: "shifts",
    delimiter: ",",
    utf8WithBom: true,
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
  const handleFormSubmit = (shiftData: Partial<Shift>) => {
    if (formMode === "add") {
      // Xử lý thêm mới ca làm việc
      const lastId = Math.max(...shifts.map((shift) => shift.id), 0);
      const newShift: Shift = {
        ...(shiftData as Shift),
        id: lastId + 1,
      };

      setShifts([...shifts, newShift]);
    } else {
      // Xử lý chỉnh sửa thông tin ca làm việc
      if (selectedShift) {
        setShifts(
          shifts.map((shift) =>
            shift.id === selectedShift.id
              ? { ...selectedShift, ...shiftData }
              : shift
          )
        );
      }
    }
    setIsFormOpen(false);
  };

  // Hàm xử lý xóa ca làm việc
  const handleDeleteClick = (id: number) => {
    // TODO: Thêm xác nhận trước khi xóa
    setShifts(shifts.filter((shift) => shift.id !== id));
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
    },
    {
      field: "end",
      headerName: "Giờ kết thúc",
      width: 150,
      flex: 1,
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
        />
      </Paper>

      {/* Form thêm mới/chỉnh sửa ca làm việc */}
      <ShiftForm
        open={isFormOpen}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
        shift={selectedShift}
        mode={formMode}
      />
    </Box>
  );
};

// Dữ liệu mẫu cho danh sách ca làm việc
const mockShifts: Shift[] = [
  {
    id: 1,
    shift: 1,
    start: "07:00",
    end: "11:00",
    status: true,
  },
  {
    id: 2,
    shift: 2,
    start: "13:00",
    end: "17:00",
    status: true,
  },
  {
    id: 3,
    shift: 3,
    start: "18:00",
    end: "22:00",
    status: true,
  },
  {
    id: 4,
    shift: 4,
    start: "22:00",
    end: "06:00",
    status: false,
  },
  {
    id: 5,
    shift: 5,
    start: "08:00",
    end: "12:00",
    status: true,
  },
];

export default ShiftManagementPage;
