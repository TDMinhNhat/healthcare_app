import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
} from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridToolbar,
  GridCsvExportOptions,
} from "@mui/x-data-grid";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  getCancelBookings,
  assignPayback,
} from "../../services/admin/book_service";
import { getPatientBankAccount } from "../../services/authenticate/user_service";
import { formatTimeFromTimeString } from "../../utils/dateUtils";
import { PaymentStatus } from "../../types/enums";

export default function CancelAppointmentPage() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [canceledAppointments, setCanceledAppointments] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [processingRefund, setProcessingRefund] = useState(false);
  const [bankInfo, setBankInfo] = useState<{
    bankName: string;
    accountNumber: string;
  } | null>(null);
  const [loadingBankInfo, setLoadingBankInfo] = useState(false);
  const [bankInfoError, setBankInfoError] = useState<string | null>(null);

  // Lấy dữ liệu khi component được tạo
  useEffect(() => {
    fetchCanceledAppointments();
  }, []);

  // Chuyển đổi dữ liệu API sang định dạng hiển thị
  const transformAppointmentData = (apiData: any) => {
    // Đảm bảo apiData là một mảng
    if (!Array.isArray(apiData)) {
      console.error("Dữ liệu API không phải là mảng:", apiData);
      return [];
    }

    // console.log("Số lượng dữ liệu trước khi chuyển đổi:", apiData.length);

    const transformed = apiData
      .map((appointment, index) => {
        try {
          // Định dạng ngày và giờ
          const dateStr =
            appointment.bookAppointment.workSchedule.dateAppointment;
          const timeStr =
            formatTimeFromTimeString(
              appointment.bookAppointment.workSchedule.shift.start,
              "string"
            ) +
            "-" +
            formatTimeFromTimeString(
              appointment.bookAppointment.workSchedule.shift.end,
              "string"
            );

          // Debug để kiểm tra trạng thái hoàn tiền
          // console.log(
          //   `Appointment ${index} - Payment status:`,
          //   appointment.bookAppointmentPayment.status
          // );

          return {
            id: appointment.bookAppointment.id,
            patientId: appointment.bookAppointment.patient.userId,
            patientUserId: appointment.bookAppointment.patient.userId,
            patientName: `${appointment.bookAppointment.patient.lastName} ${appointment.bookAppointment.patient.firstName}`,
            appointmentDateTime: `${dateStr} ${timeStr}`,
            appointmentId: appointment.bookAppointment.id,
            isRefunded:
              appointment.bookAppointmentPayment.status ===
              PaymentStatus.PAY_BACK,
            paymentStatus: appointment.bookAppointmentPayment.status,
            rawData: appointment.bookAppointment,
          };
        } catch (error) {
          console.error(`Lỗi khi chuyển đổi dữ liệu cuộc hẹn ${index}:`, error);
          // console.error(
          //   "Chi tiết appointment gây lỗi:",
          //   JSON.stringify(appointment, null, 2)
          // );
          return null;
        }
      })
      .filter(Boolean);

    // console.log("Số lượng dữ liệu sau khi chuyển đổi:", transformed.length);
    return transformed;
  };

  const fetchCanceledAppointments = async () => {
    try {
      setLoading(true);
      const response = await getCancelBookings();

      // Ghi log cấu trúc để gỡ lỗi
      console.log("Phản hồi API:", response);

      // Kiểm tra cấu trúc dữ liệu
      if (response && response.data && response.data.code === 200) {
        // API luôn trả về một cấu trúc nhất quán với mảng nằm trong response.data.data
        let appointmentsArray = [];

        if (response.data.data && Array.isArray(response.data.data)) {
          appointmentsArray = response.data.data;
        } else {
          console.error("Cấu trúc dữ liệu không mong đợi:", response.data);
        }
        // console.log("Danh sách cuộc hẹn đã hủy:", appointmentsArray);
        const transformedData = transformAppointmentData(appointmentsArray);
        console.log("Dữ liệu đã chuyển đổi:", transformedData);
        setCanceledAppointments(transformedData);
      } else {
        throw new Error("Định dạng phản hồi không hợp lệ");
      }
    } catch (err) {
      setError("Không thể lấy danh sách cuộc hẹn đã hủy");
      console.error(err);
      // Sử dụng dữ liệu mẫu cho phát triển/kiểm thử
      // setCanceledAppointments(
      //   transformAppointmentData(mockCanceledAppointments)
      // );
    } finally {
      setLoading(false);
    }
  };

  // Lấy thông tin tài khoản ngân hàng cho một bệnh nhân
  const fetchBankAccountInfo = async (patientId: string) => {
    try {
      setLoadingBankInfo(true);
      setBankInfoError(null);

      const response = await getPatientBankAccount(patientId);

      if (response && response.data && response.data.code === 200) {
        setBankInfo({
          bankName: response.data.data.bankName,
          accountNumber: response.data.data.accountNumber,
        });
      } else {
        setBankInfo(null);
        setBankInfoError("Không tìm thấy thông tin tài khoản ngân hàng");
      }
    } catch (err: any) {
      console.error("Lỗi khi lấy thông tin tài khoản ngân hàng:", err);
      setBankInfo(null);

      // Xử lý các trường hợp lỗi khác nhau
      if (err.response && err.response.status === 404) {
        setBankInfoError(
          "Bệnh nhân chưa cập nhật thông tin tài khoản ngân hàng"
        );
      } else {
        setBankInfoError("Lỗi khi lấy thông tin tài khoản ngân hàng");
      }
    } finally {
      setLoadingBankInfo(false);
    }
  };

  // Mở modal với chi tiết cuộc hẹn và lấy thông tin ngân hàng
  const handleViewDetails = async (appointment: any) => {
    setSelectedAppointment(appointment);
    setModalOpen(true);

    // Đặt lại thông tin ngân hàng trước khi lấy
    setBankInfo(null);
    setBankInfoError(null);

    // Lấy thông tin tài khoản ngân hàng bằng patientUserId
    if (appointment.patientUserId) {
      await fetchBankAccountInfo(appointment.patientUserId);
    }
  };

  // Xử lý chuyển đổi trạng thái hoàn tiền - sử dụng API
  const handleRefundToggle = async (appointmentId: string) => {
    if (!selectedAppointment) return;

    try {
      setProcessingRefund(true);
      await assignPayback(appointmentId);

      // Cập nhật trạng thái local sau khi gọi API thành công
      setCanceledAppointments((prevAppointments) =>
        prevAppointments.map((appointment) =>
          appointment.appointmentId === appointmentId
            ? { ...appointment, isRefunded: true }
            : appointment
        )
      );

      // Đóng modal sau khi hoàn tiền thành công
      setModalOpen(false);
    } catch (err) {
      setError("Không thể xử lý hoàn tiền. Vui lòng thử lại.");
      console.error(err);
    } finally {
      setProcessingRefund(false);
    }
  };

  // Định nghĩa các cột cho bảng dữ liệu - đã loại bỏ các cột ngân hàng
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
      field: "appointmentId",
      headerName: "Mã lịch hẹn",
      width: 120,
      flex: 0.8,
    },
    {
      field: "paymentStatus",
      headerName: "Trạng thái thanh toán",
      width: 150,
      flex: 1,
      renderCell: (params) => {
        let color = "gray";
        let statusText = "Chưa xác định";

        switch (params.row.paymentStatus) {
          case PaymentStatus.PAY_BACK:
            color = "green";
            statusText = "Đã hoàn tiền";
            break;
          case PaymentStatus.PAYED:
            color = "orange";
            statusText = "Đã thanh toán";
            break;
          case PaymentStatus.CANCELED:
            color = "red";
            statusText = "Đã hủy thanh toán";
            break;
          case PaymentStatus.WAITING_PAY:
            color = "blue";
            statusText = "Đang chờ thanh toán";
            break;
        }

        return (
          <span
            style={{
              color: color,
              fontWeight: "bold",
            }}
          >
            {statusText}
          </span>
        );
      },
    },
    {
      field: "actions",
      headerName: "Thao tác",
      width: 120,
      flex: 1,
      renderCell: (params) => (
        <Button
          variant="outlined"
          color="primary"
          size="small"
          startIcon={<VisibilityIcon />}
          onClick={() => handleViewDetails(params.row)}
        >
          Chi tiết
        </Button>
      ),
    },
  ];

  return (
    <Box sx={{ height: "100%", width: "100%", padding: 3 }}>
      {/* Tiêu đề trang */}
      <Typography variant="h4" component="h1" gutterBottom>
        Danh sách bệnh nhân huỷ lịch hẹn
      </Typography>

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
                csvOptions: {
                  fileName: "canceled-appointments",
                  delimiter: ",",
                  utf8WithBom: true,
                },
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

      {/* Modal thông tin chi tiết ngân hàng */}
      <Dialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Thông tin chi tiết hoàn tiền</DialogTitle>

        <DialogContent>
          {selectedAppointment && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <Typography variant="subtitle1">
                  <strong>Bệnh nhân:</strong> {selectedAppointment.patientName}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1">
                  <strong>Mã bệnh nhân:</strong>{" "}
                  {selectedAppointment.patientUserId}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1">
                  <strong>Mã lịch hẹn:</strong>{" "}
                  {selectedAppointment.appointmentId}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1">
                  <strong>Ngày giờ khám:</strong>{" "}
                  {selectedAppointment.appointmentDateTime}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1">
                  <strong>Bác sĩ phụ trách:</strong>{" "}
                  {selectedAppointment.rawData?.workSchedule?.doctor
                    ? `${selectedAppointment.rawData.workSchedule.doctor.lastName} ${selectedAppointment.rawData.workSchedule.doctor.firstName}`
                    : "Không có thông tin"}
                </Typography>
              </Grid>

              <Grid item xs={12} sx={{ mt: 2 }}>
                <Typography variant="h6">
                  Thông tin tài khoản ngân hàng
                </Typography>
              </Grid>

              {loadingBankInfo ? (
                <Grid
                  item
                  xs={12}
                  sx={{ display: "flex", justifyContent: "center", my: 2 }}
                >
                  <CircularProgress size={24} />
                </Grid>
              ) : bankInfoError ? (
                <Grid item xs={12}>
                  <Alert severity="warning" sx={{ mt: 1 }}>
                    {bankInfoError}
                  </Alert>
                </Grid>
              ) : bankInfo ? (
                <>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1">
                      <strong>Số tài khoản:</strong> {bankInfo.accountNumber}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1">
                      <strong>Tên ngân hàng:</strong> {bankInfo.bankName}
                    </Typography>
                  </Grid>
                </>
              ) : (
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">
                    Không có thông tin tài khoản ngân hàng
                  </Typography>
                </Grid>
              )}

              <Grid item xs={12} sx={{ mt: 2 }}>
                <Typography variant="subtitle1">
                  <strong>Trạng thái hoàn tiền:</strong>{" "}
                  <span
                    style={{
                      color: selectedAppointment.isRefunded ? "green" : "red",
                      fontWeight: "bold",
                    }}
                  >
                    {selectedAppointment.isRefunded
                      ? "Đã hoàn tiền"
                      : "Chưa hoàn tiền"}
                  </span>
                </Typography>
              </Grid>
            </Grid>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setModalOpen(false)}>Đóng</Button>
          {selectedAppointment &&
            !selectedAppointment.isRefunded &&
            bankInfo && (
              <Button
                variant="contained"
                color="primary"
                onClick={() =>
                  handleRefundToggle(selectedAppointment.appointmentId)
                }
                disabled={processingRefund || !bankInfo || loadingBankInfo}
              >
                {processingRefund ? "Đang xử lý..." : "Đánh dấu đã hoàn tiền"}
              </Button>
            )}
          {selectedAppointment &&
            !selectedAppointment.isRefunded &&
            !bankInfo &&
            !loadingBankInfo && (
              <Button variant="contained" color="primary" disabled={true}>
                Không thể hoàn tiền (không có thông tin tài khoản)
              </Button>
            )}
        </DialogActions>
      </Dialog>
    </Box>
  );
}

// Dữ liệu mẫu được cập nhật để phù hợp với cấu trúc dự kiến
const mockCanceledAppointments = [
  {
    id: 6,
    patient: {
      id: 1,
      userId: "20250409000148-52838-19460614",
      firstName: "Donald",
      lastName: "Trump",
      phone: "0129384756",
      email: "donaldtrump@gmail.com",
    },
    workSchedule: {
      id: 13,
      dateAppointment: "16-04-2025",
      shift: {
        id: 2,
        shift: 2,
        start: "13-00-00",
        end: "17-00-00",
      },
      doctor: {
        id: 1,
        firstName: "Thư",
        lastName: "Lê",
        specialization: "TÂM LÝ HỌC TÂM THẦN",
      },
    },
    numericalOrder: 1,
    note: "",
    createdAt: "16-04-2025-14-20-08",
    status: "CANCELLED",
    bankAccount: "19038211111",
    bankName: "Vietcombank",
    isRefunded: false,
  },
];
