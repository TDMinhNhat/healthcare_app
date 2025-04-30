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
  Chip,
  Avatar,
  IconButton,
  Paper,
  Button,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import { Delete, Add, UploadFile } from "@mui/icons-material";
import { User } from "../../types/user";
import PatientForm from "../../components/admin/PatientForm";
import {
  getPatients,
  deletePatient,
  importPatients,
} from "../../services/admin/patients_service";
import { updateInfo } from "../../services/authenticate/user_service";
import * as XLSX from "xlsx";
import { Address } from "../../types/address";

const PatientManagementPage: React.FC = () => {
  // Khai báo state để quản lý dữ liệu và trạng thái UI
  const [patients, setPatients] = useState<User[]>([]); // Danh sách bệnh nhân - no longer using mock data
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const [importing, setImporting] = useState<boolean>(false); // Trạng thái import dữ liệu
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

  // Fetch patients data when component mounts
  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const response = await getPatients();

      // Transform the date format from DD-MM-YYYY to YYYY-MM-DD for UI compatibility
      const transformedData = response.data.map((patient: any) => {
        // Convert date from DD-MM-YYYY to YYYY-MM-DD
        const dateParts = patient.dob
          ? patient.dob.split("-")
          : ["01", "01", "1970"];
        const formattedDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;

        return {
          ...patient,
          dob: formattedDate,
        };
      });

      setPatients(transformedData);
      showMessage("Dữ liệu bệnh nhân đã được tải thành công", "success");
    } catch (error) {
      console.error("Error fetching patients:", error);
      showMessage("Lỗi khi tải dữ liệu bệnh nhân", "error");
    } finally {
      setLoading(false);
    }
  };

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

  // Hàm xử lý khi submit form (áp dụng cho cả thêm mới và chỉnh sửa)
  const handleFormSubmit = async (patientData: Partial<User>) => {
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
      // Xử lý chỉnh sửa thông tin bệnh nhân thông qua API
      if (selectedPatient) {
        try {
          setLoading(true);

          // Create a copy of patientData with properly formatted date
          const formattedPatientData = { ...patientData };

          // Convert date from YYYY-MM-DD to DD-MM-YYYY format
          if (formattedPatientData.dob) {
            const dateParts = formattedPatientData.dob.split("-");
            if (dateParts.length === 3) {
              formattedPatientData.dob = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
            }
          }

          const response = await updateInfo(
            selectedPatient.userId,
            formattedPatientData
          );

          if (response.status === 200) {
            // Update local state with the returned patient data
            setPatients(
              patients.map((patient) =>
                patient.id === selectedPatient.id
                  ? { ...patient, ...response.data }
                  : patient
              )
            );
            showMessage("Cập nhật bệnh nhân thành công", "success");
          }
        } catch (error) {
          console.error("Error updating patient:", error);
          showMessage("Lỗi khi cập nhật thông tin bệnh nhân", "error");
        } finally {
          setLoading(false);
        }
      }
    }
    setIsFormOpen(false);
  };

  // Hàm xử lý xóa bệnh nhân
  const handleDeleteClick = async (id: number) => {
    try {
      setLoading(true);
      // Find the patient by id to get the userId
      const patientToDelete = patients.find((patient) => patient.id === id);

      if (!patientToDelete) {
        showMessage("Không tìm thấy bệnh nhân", "error");
        return;
      }

      const response = await deletePatient(patientToDelete.userId);

      if (response.code === 200) {
        // Update the patient status in the local state
        setPatients(
          patients.map((patient) =>
            patient.id === id ? { ...patient, status: false } : patient
          )
        );
        showMessage("Xóa bệnh nhân thành công", "success");
      } else {
        showMessage("Xóa bệnh nhân thất bại", "error");
      }
    } catch (error) {
      console.error("Error deleting patient:", error);
      showMessage("Lỗi khi xóa bệnh nhân", "error");
    } finally {
      setLoading(false);
    }
  };

  // Hàm phân tích chuỗi thành đối tượng địa chỉ
  const parseAddress = (addressStr: string): Partial<Address> | null => {
    if (!addressStr || addressStr === "null") return null;

    // Địa chỉ các phần ngăn cách bởi dấu phẩy
    const parts = addressStr.split(",").map((part) => part.trim());

    // Kiểm tra nếu không đủ 6 trường thông tin thì trả về null
    if (parts.length < 6) {
      console.error("Địa chỉ không đủ thông tin:", addressStr);
      return null;
    }

    // Chỉ tạo đối tượng địa chỉ khi có đầy đủ thông tin
    const address: Partial<Address> = {
      number: parts[0],
      street: parts[1],
      ward: parts[2],
      district: parts[3],
      city: parts[4],
      country: parts[5],
    };

    return address;
  };

  // Hàm xử lý định dạng ngày tháng để hỗ trợ nhiều định dạng khác nhau
  const formatDateString = (dateValue: any): string => {
    if (!dateValue) return "";

    try {
      // Trường hợp 1: Nếu là chuỗi có định dạng YYYY-MM-DD (với dấu gạch ngang)
      if (typeof dateValue === "string" && dateValue.includes("-")) {
        // Kiểm tra xem có đúng định dạng YYYY-MM-DD không
        const match = dateValue.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
        if (match) {
          const year = match[1];
          let month = match[2];
          let day = match[3];

          // Thêm số 0 ở đầu nếu cần
          day = day.padStart(2, "0");
          month = month.padStart(2, "0");

          // Trả về định dạng "dd-MM-yyyy"
          return `${day}-${month}-${year}`;
        }
      }

      // Trường hợp 2: Nếu là chuỗi có định dạng DD/MM/YYYY
      if (typeof dateValue === "string" && dateValue.includes("/")) {
        const parts = dateValue.split("/");
        if (parts.length !== 3) return dateValue;

        let day = parts[0];
        let month = parts[1];
        const year = parts[2];

        // Thêm số 0 ở đầu nếu cần
        day = day.padStart(2, "0");
        month = month.padStart(2, "0");

        return `${day}-${month}-${year}`;
      }

      // Trường hợp 3: Nếu là số (Excel date serial)
      if (typeof dateValue === "number" || !isNaN(Number(dateValue))) {
        // Tạo đối tượng Date sử dụng UTC để tránh vấn đề múi giờ
        const excelEpoch = new Date(Date.UTC(1899, 11, 30)); // 30/12/1899 ở UTC
        const daysSinceEpoch = Number(dateValue);
        const millisecondsSinceEpoch = daysSinceEpoch * 24 * 60 * 60 * 1000;
        const date = new Date(excelEpoch.getTime() + millisecondsSinceEpoch);

        // Lấy các thành phần ngày tháng ở định dạng UTC để tránh dịch ngày
        const day = String(date.getUTCDate()).padStart(2, "0");
        const month = String(date.getUTCMonth() + 1).padStart(2, "0");
        const year = date.getUTCFullYear();

        return `${day}-${month}-${year}`;
      }
    } catch (error) {
      console.error("Lỗi định dạng ngày tháng:", error, dateValue);
      return String(dateValue);
    }

    // Trả về giá trị gốc nếu không thể xử lý
    return String(dateValue);
  };

  // Hàm xử lý click để import file
  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  // Hàm xử lý khi người dùng chọn file để import
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
      setImporting(true); // Đặt trạng thái đang import
      reader.onload = async (evt) => {
        try {
          // Đọc dữ liệu file
          const data = evt.target?.result;
          const workbook = XLSX.read(data, { type: "binary" });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const json = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

          // Xử lý từng dòng dữ liệu và phân tích các trường phức tạp
          const processedData = json.map((row: any) => {
            let address = null;
            if (row.address && row.address !== "null") {
              address = parseAddress(row.address);
            }

            // Định dạng ngày sinh
            const formattedDob = row.dob ? formatDateString(row.dob) : "";

            // Sửa dữ liệu giới tính về giá trị đúng:
            let correctedSex = row.sex;
            if (typeof row.sex === "string") {
              // Chuyển đổi biểu diễn chuỗi sang giá trị boolean đúng
              if (
                row.sex.toLowerCase() === "nữ" ||
                row.sex.toLowerCase() === "nu" ||
                row.sex === "1" ||
                row.sex === "true"
              ) {
                correctedSex = true; // Nữ
              } else if (
                row.sex.toLowerCase() === "nam" ||
                row.sex === "0" ||
                row.sex === "false"
              ) {
                correctedSex = false; // Nam
              }
            }

            return {
              ...row,
              dob: formattedDob, // Sử dụng ngày sinh đã định dạng
              sex: correctedSex, // Sử dụng giới tính đã được sửa
              password: "123456789", // Default password
              address: address,
            };
          });

          console.log("Dữ liệu bệnh nhân đã xử lý:", processedData);

          // Gọi API import bệnh nhân
          try {
            const response = await importPatients(processedData);
            if (response && response.data) {
              showMessage("Import dữ liệu bệnh nhân thành công", "success");
              // Làm mới danh sách bệnh nhân sau khi import thành công
              fetchPatients();
            } else {
              showMessage(
                "Đã xảy ra lỗi khi import dữ liệu bệnh nhân",
                "error"
              );
            }
          } catch (apiError) {
            console.error("Lỗi khi import bệnh nhân:", apiError);
            showMessage(
              "Đã xảy ra lỗi khi gửi dữ liệu bệnh nhân đến server",
              "error"
            );
          } finally {
            setImporting(false);
          }
        } catch (parseError) {
          console.error("Lỗi khi phân tích file:", parseError);
          showMessage(
            `Lỗi khi parse file ${fileName.endsWith(".csv") ? "CSV" : "Excel"}`,
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
          label={params.value ? "Nữ" : "Nam"}
          color={params.value ? "secondary" : "info"}
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
            alignItems: "center",
            justifyContent: "center",
          }}
        >
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

      {/* Bảng dữ liệu bệnh nhân */}
      <Paper sx={{ width: "100%" }}>
        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "400px",
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
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
        )}
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

export default PatientManagementPage;
