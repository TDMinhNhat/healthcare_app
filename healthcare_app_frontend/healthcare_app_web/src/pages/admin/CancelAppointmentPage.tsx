import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridToolbar,
  GridCsvExportOptions,
} from "@mui/x-data-grid";
import FileDownloadIcon from "@mui/icons-material/FileDownload";

interface CanceledAppointment {
  id: number;
  patientId: string;
  patientName: string;
  appointmentDateTime: string;
  bankAccount: string;
  bankName: string;
  appointmentId: string;
}

export default function CancelAppointmentPage() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [canceledAppointments, setCanceledAppointments] = useState<
    CanceledAppointment[]
  >(mockCanceledAppointments);

  // Tùy chọn xuất CSV
  const csvOptions: GridCsvExportOptions = {
    fileName: "canceled-appointments",
    delimiter: ",",
    utf8WithBom: true,
  };

  // Định nghĩa các cột cho bảng dữ liệu
  const columns: GridColDef[] = [
    {
      field: "patientId",
      headerName: "Mã bệnh nhân",
      width: 120,
      flex: 0.8,
    },
    {
      field: "patientName",
      headerName: "Họ tên",
      width: 180,
      flex: 1,
    },
    {
      field: "appointmentDateTime",
      headerName: "Ngày giờ khám",
      width: 150,
      flex: 1,
    },
    {
      field: "bankAccount",
      headerName: "Số tài khoản",
      width: 150,
      flex: 1,
    },
    {
      field: "bankName",
      headerName: "Tên ngân hàng",
      width: 200,
      flex: 1.2,
    },
    {
      field: "appointmentId",
      headerName: "Mã lịch hẹn",
      width: 120,
      flex: 0.8,
    },
  ];

  // Xử lý chức năng xuất dữ liệu nếu cần
  const handleExport = () => {
    // Thực hiện chức năng xuất dữ liệu tại đây
    console.log("Đang xuất dữ liệu...");
  };

  return (
    <Box sx={{ height: "100%", width: "100%", padding: 3 }}>
      {/* Tiêu đề trang */}
      <Typography variant="h4" component="h1" gutterBottom>
        Danh sách bệnh nhân huỷ lịch hẹn
      </Typography>

      {/* Nút xuất dữ liệu */}
      {/* <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2, gap: 2 }}>
        <Button
          variant="outlined"
          startIcon={<FileDownloadIcon />}
          onClick={handleExport}
        >
          Xuất báo cáo
        </Button>
      </Box> */}

      {/* Thông báo lỗi */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Bảng dữ liệu */}
      <Paper sx={{ width: "100%" }}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <DataGrid
            rows={canceledAppointments}
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
            sx={{ minHeight: 400 }}
          />
        )}
      </Paper>
    </Box>
  );
}

// Dữ liệu mẫu để kiểm thử ban đầu
const mockCanceledAppointments: CanceledAppointment[] = [
  {
    id: 1,
    patientId: "BN001",
    patientName: "Nguyễn Văn A",
    appointmentDateTime: "10/05/2023 08:30",
    bankAccount: "19038211111",
    bankName: "Vietcombank",
    appointmentId: "LH001",
  },
  {
    id: 2,
    patientId: "BN002",
    patientName: "Trần Thị B",
    appointmentDateTime: "11/05/2023 09:15",
    bankAccount: "19038222222",
    bankName: "BIDV",
    appointmentId: "LH002",
  },
  {
    id: 3,
    patientId: "BN003",
    patientName: "Lê Văn C",
    appointmentDateTime: "12/05/2023 14:00",
    bankAccount: "19038233333",
    bankName: "Agribank",
    appointmentId: "LH003",
  },
  {
    id: 4,
    patientId: "BN004",
    patientName: "Phạm Thị D",
    appointmentDateTime: "13/05/2023 10:30",
    bankAccount: "19038244444",
    bankName: "Techcombank",
    appointmentId: "LH004",
  },
  {
    id: 5,
    patientId: "BN005",
    patientName: "Hoàng Văn E",
    appointmentDateTime: "14/05/2023 15:45",
    bankAccount: "19038255555",
    bankName: "ACB",
    appointmentId: "LH005",
  },
];
