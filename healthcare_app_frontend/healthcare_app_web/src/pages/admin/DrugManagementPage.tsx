import React, { useState } from "react";
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridToolbar,
} from "@mui/x-data-grid";
import { Box, IconButton, Paper, Button } from "@mui/material";
import { Edit, Delete, Add } from "@mui/icons-material";
import { Drug } from "../../types/medical";
import DrugForm from "../../components/admin/DrugForm";

const DrugManagementPage: React.FC = () => {
  // Khai báo state để quản lý dữ liệu và trạng thái UI
  const [drugs, setDrugs] = useState<Drug[]>(mockDrugs); // Danh sách thuốc
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false); // Trạng thái hiển thị form
  const [formMode, setFormMode] = useState<"add" | "edit">("add"); // Chế độ form: thêm mới/chỉnh sửa
  const [selectedDrug, setSelectedDrug] = useState<Drug | null>(null); // Thuốc đang được chọn

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
  const handleFormSubmit = (drugData: Partial<Drug>) => {
    if (formMode === "add") {
      // Xử lý thêm mới thuốc
      const lastId = Math.max(...drugs.map((drug) => drug.id), 0);
      const newDrug: Drug = {
        ...(drugData as Drug),
        id: lastId + 1,
      };

      setDrugs([...drugs, newDrug]);
    } else {
      // Xử lý chỉnh sửa thông tin thuốc
      if (selectedDrug) {
        setDrugs(
          drugs.map((drug) =>
            drug.id === selectedDrug.id
              ? { ...selectedDrug, ...drugData }
              : drug
          )
        );
      }
    }
    setIsFormOpen(false);
  };

  // Hàm xử lý xóa thuốc
  const handleDeleteClick = (id: number) => {
    // TODO: Thêm xác nhận trước khi xóa
    setDrugs(drugs.filter((drug) => drug.id !== id));
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
      {/* Phần header với nút thêm thuốc */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2, gap: 2 }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={handleAddClick}
        >
          Thêm thuốc
        </Button>
      </Box>

      {/* Bảng dữ liệu thuốc */}
      <Paper sx={{ width: "100%" }}>
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
            },
          }}
          disableRowSelectionOnClick
          disableColumnFilter={false}
          disableDensitySelector={false}
          disableColumnSelector={false}
        />
      </Paper>

      {/* Form thêm mới/chỉnh sửa thuốc */}
      <DrugForm
        open={isFormOpen}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
        drug={selectedDrug}
        mode={formMode}
      />
    </Box>
  );
};

// Dữ liệu mẫu cho danh sách thuốc
const mockDrugs: Drug[] = [
  {
    id: 1,
    drugName: "Paracetamol",
    unit: "viên",
  },
  {
    id: 2,
    drugName: "Amoxicillin",
    unit: "viên",
  },
  {
    id: 3,
    drugName: "Ibuprofen",
    unit: "viên",
  },
  {
    id: 4,
    drugName: "Omeprazole",
    unit: "viên",
  },
  {
    id: 5,
    drugName: "Vitamin C",
    unit: "viên",
  },
  {
    id: 6,
    drugName: "Aspirin",
    unit: "viên",
  },
  {
    id: 7,
    drugName: "Atorvastatin",
    unit: "viên",
  },
  {
    id: 8,
    drugName: "Simvastatin",
    unit: "viên",
  },
  {
    id: 9,
    drugName: "Metformin",
    unit: "viên",
  },
  {
    id: 10,
    drugName: "Losartan",
    unit: "viên",
  },
];

export default DrugManagementPage;
