import React, { useState, useRef } from "react";
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
} from "@mui/material";
import { Edit, Delete, Add, UploadFile } from "@mui/icons-material";
import { User } from "../../types/user";
import PatientForm from "../../components/admin/PatientForm";
import * as XLSX from "xlsx";
import { Address } from "../../types/address";

const PatientManagementPage: React.FC = () => {
  // Khai báo state để quản lý dữ liệu và trạng thái UI
  const [patients, setPatients] = useState<User[]>(mockPatients); // Danh sách bệnh nhân
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

  const fileInputRef = useRef<HTMLInputElement>(null);

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

  // Hàm phân tích chuỗi thành đối tượng địa chỉ (không cần xử lý ngoặc đơn)
  const parseAddress = (addressStr: string): Partial<Address> | null => {
    if (!addressStr || addressStr === "null") return null;

    // Format: các phần địa chỉ ngăn cách bởi dấu phẩy
    const parts = addressStr.split(",").map((part) => part.trim());

    if (parts.length < 2) {
      console.error("Định dạng địa chỉ không hợp lệ:", addressStr);
      return null;
    }

    // Xử lý linh hoạt các trường hợp thiếu thành phần địa chỉ
    const address: Partial<Address> = {};

    if (parts.length >= 1) address.number = parts[0];
    if (parts.length >= 2) address.street = parts[1];
    if (parts.length >= 3) address.ward = parts[2];
    if (parts.length >= 4) address.district = parts[3];
    if (parts.length >= 5) address.city = parts[4];
    if (parts.length >= 6) address.country = parts[5];

    return address;
  };

  // Hàm xử lý khi submit form (áp dụng cho cả thêm mới và chỉnh sửa)
  const handleFormSubmit = (patientData: Partial<User>) => {
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
      // Xử lý chỉnh sửa thông tin bệnh nhân
      if (selectedPatient) {
        setPatients(
          patients.map((patient) =>
            patient.id === selectedPatient.id
              ? { ...selectedPatient, ...patientData }
              : patient
          )
        );
        showMessage("Cập nhật bệnh nhân thành công", "success");
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

  // Hàm xử lý import file
  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  // Hàm xử lý khi người dùng chọn file để import
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    const fileName = file.name.toLowerCase();

    // Kiểm tra loại file
    if (
      fileName.endsWith(".csv") ||
      fileName.endsWith(".xlsx") ||
      fileName.endsWith(".xls")
    ) {
      reader.onload = (evt) => {
        try {
          // Đọc dữ liệu file
          const data = evt.target?.result;
          const workbook = XLSX.read(data, { type: "binary" });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const json = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

          // Xử lý từng dòng dữ liệu và phân tích địa chỉ
          const processedData = json.map((row: any) => {
            let address = null;
            if (row.address && row.address !== "null") {
              address = parseAddress(row.address);
            }

            // Tạo ID và UserID mới
            const lastId = Math.max(
              ...patients.map((patient) => patient.id),
              0
            );
            const lastUserId =
              patients.length > 0
                ? parseInt(
                    patients[patients.length - 1].userId.replace("BN", "")
                  )
                : 0;

            const newId = lastId + json.indexOf(row) + 1;
            const newUserId = `BN${String(
              lastUserId + json.indexOf(row) + 1
            ).padStart(3, "0")}`;

            return {
              ...row,
              id: newId,
              userId: newUserId,
              address: address,
              status: row.status === "true" || row.status === true,
              sex: row.sex === "true" || row.sex === true,
              password: "defaultpassword",
            };
          });

          console.log("Dữ liệu bệnh nhân đã xử lý:", processedData);

          // Cập nhật danh sách bệnh nhân với dữ liệu mới
          setPatients([...patients, ...processedData]);

          // Hiển thị thông báo thành công
          showMessage(
            `Đã import ${processedData.length} bệnh nhân thành công từ file ${
              fileName.endsWith(".csv") ? "CSV" : "Excel"
            }.`,
            "success"
          );
        } catch (error) {
          console.error("Lỗi khi phân tích file:", error);
          showMessage(
            `Lỗi khi parse file ${fileName.endsWith(".csv") ? "CSV" : "Excel"}`,
            "error"
          );
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
      {/* Phần header với nút thêm bệnh nhân và import */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2, gap: 2 }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={handleAddClick}
        >
          Thêm bệnh nhân
        </Button>
        <Button
          variant="contained"
          color="success"
          startIcon={<UploadFile />}
          onClick={handleImportClick}
          sx={{ fontWeight: 600 }}
        >
          Import file
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,.xlsx,.xls"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
      </Box>

      {/* Bảng dữ liệu bệnh nhân */}
      <Paper sx={{ width: "100%" }}>
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

// Dữ liệu mẫu cho danh sách bệnh nhân
const mockPatients: User[] = [
  {
    id: 1,
    userId: "BN001",
    firstName: "Nguyễn",
    lastName: "Văn An",
    sex: true,
    dob: "1985-05-15",
    phone: "0987654321",
    email: "nguyenvanan@example.com",
    password: "hashedpassword",
    avatar: "https://i.pravatar.cc/150?img=1",
    status: true,
  },
  {
    id: 2,
    userId: "BN002",
    firstName: "Trần",
    lastName: "Thị Bình",
    sex: false,
    dob: "1990-08-22",
    phone: "0912345678",
    email: "tranthibinh@example.com",
    password: "hashedpassword",
    status: true,
  },
  {
    id: 3,
    userId: "BN003",
    firstName: "Lê",
    lastName: "Văn Cường",
    sex: true,
    dob: "1978-12-03",
    phone: "0923456789",
    email: "levancuong@example.com",
    password: "hashedpassword",
    avatar: "https://i.pravatar.cc/150?img=3",
    status: false,
  },
  {
    id: 4,
    userId: "BN004",
    firstName: "Phạm",
    lastName: "Thị Dung",
    sex: false,
    dob: "1995-03-18",
    phone: "0934567890",
    email: "phamthidung@example.com",
    password: "hashedpassword",
    status: true,
  },
  {
    id: 5,
    userId: "BN005",
    firstName: "Hoàng",
    lastName: "Văn Em",
    sex: true,
    dob: "1982-10-30",
    phone: "0945678901",
    email: "hoangvanem@example.com",
    password: "hashedpassword",
    avatar: "https://i.pravatar.cc/150?img=5",
    status: true,
  },
  {
    id: 6,
    userId: "BN006",
    firstName: "Vũ",
    lastName: "Thị Phương",
    sex: false,
    dob: "1988-07-12",
    phone: "0956789012",
    email: "vuthiphuong@example.com",
    password: "hashedpassword",
    status: true,
  },
  {
    id: 7,
    userId: "BN007",
    firstName: "Đỗ",
    lastName: "Văn Giang",
    sex: true,
    dob: "1975-02-25",
    phone: "0967890123",
    email: "dovangiang@example.com",
    password: "hashedpassword",
    avatar: "https://i.pravatar.cc/150?img=7",
    status: false,
  },
  {
    id: 8,
    userId: "BN008",
    firstName: "Ngô",
    lastName: "Thị Hồng",
    sex: false,
    dob: "1992-11-05",
    phone: "0978901234",
    email: "ngothihong@example.com",
    password: "hashedpassword",
    status: true,
  },
  {
    id: 9,
    userId: "BN009",
    firstName: "Trịnh",
    lastName: "Văn Khoa",
    sex: true,
    dob: "1980-06-17",
    phone: "0989012345",
    email: "trinhvankhoa@example.com",
    password: "hashedpassword",
    avatar: "https://i.pravatar.cc/150?img=9",
    status: true,
  },
  {
    id: 10,
    userId: "BN010",
    firstName: "Mai",
    lastName: "Thị Lan",
    sex: false,
    dob: "1998-09-20",
    phone: "0990123456",
    email: "maithilan@example.com",
    password: "hashedpassword",
    status: true,
  },
];

export default PatientManagementPage;
