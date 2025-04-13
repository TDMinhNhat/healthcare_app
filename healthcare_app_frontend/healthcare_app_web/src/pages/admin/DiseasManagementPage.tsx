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
import { Disease } from "../../types/typeDisease";
import DiseaseForm from "../../components/admin/DiseaseForm";

const DiseasManagementPage: React.FC = () => {
  // Khai báo state để quản lý dữ liệu và trạng thái UI
  const [diseases, setDiseases] = useState<Disease[]>(mockDiseases); // Danh sách bệnh
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false); // Trạng thái hiển thị form
  const [formMode, setFormMode] = useState<"add" | "edit">("add"); // Chế độ form: thêm mới/chỉnh sửa
  const [selectedDisease, setSelectedDisease] = useState<Disease | null>(null); // Bệnh đang được chọn

  // CSV options
  const csvOptions: GridCsvExportOptions = {
    fileName: "diseases",
    delimiter: ",",
    utf8WithBom: true,
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
  const handleFormSubmit = (diseaseData: Partial<Disease>) => {
    if (formMode === "add") {
      // Xử lý thêm mới bệnh
      const lastId = Math.max(...diseases.map((disease) => disease.id), 0);
      const newDisease: Disease = {
        ...(diseaseData as Disease),
        id: lastId + 1,
      };

      setDiseases([...diseases, newDisease]);
    } else {
      // Xử lý chỉnh sửa thông tin bệnh
      if (selectedDisease) {
        setDiseases(
          diseases.map((disease) =>
            disease.id === selectedDisease.id
              ? { ...selectedDisease, ...diseaseData }
              : disease
          )
        );
      }
    }
    setIsFormOpen(false);
  };

  // Hàm xử lý xóa bệnh
  const handleDeleteClick = (id: number) => {
    // TODO: Thêm xác nhận trước khi xóa
    setDiseases(diseases.filter((disease) => disease.id !== id));
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
      //   align: "center",
      //   headerAlign: "center",
      renderCell: (params: GridRenderCellParams) => (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 1,
            width: "100%",
            height: "100%",
          }}
        >
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
        />
      </Paper>

      {/* Form thêm mới/chỉnh sửa loại bệnh */}
      <DiseaseForm
        open={isFormOpen}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
        disease={selectedDisease}
        mode={formMode}
      />
    </Box>
  );
};

// Dữ liệu mẫu cho danh sách loại bệnh
const mockDiseases: Disease[] = [
  {
    id: 1,
    name: "Bệnh tim mạch",
    status: true,
  },
  {
    id: 2,
    name: "Bệnh hô hấp",
    status: true,
  },
  {
    id: 3,
    name: "Bệnh tiêu hóa",
    status: true,
  },
  {
    id: 4,
    name: "Bệnh thần kinh",
    status: false,
  },
  {
    id: 5,
    name: "Bệnh ngoài da",
    status: true,
  },
];

export default DiseasManagementPage;
