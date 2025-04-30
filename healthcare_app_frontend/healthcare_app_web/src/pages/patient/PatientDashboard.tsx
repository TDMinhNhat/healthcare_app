import React, { useState, useEffect } from "react";
import {
  Typography,
  Paper,
  Grid,
  CircularProgress,
  Box,
  Alert,
  Stack,
  ToggleButtonGroup,
  ToggleButton,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import EmptyState from "../../components/EmptyState";
import { BarChart } from "@mui/x-charts/BarChart";
import { PieChart } from "@mui/x-charts/PieChart";
import EventIcon from "@mui/icons-material/Event";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import { format } from "date-fns";
import { getPatientDashboard } from "../../services/appointment/dashboard_service";

interface Appointment {
  id: number;
  workScheduleId: number;
  date: string;
  startTime: string;
  endTime: string;
  status: "WAITING" | "IN_PROGRESS" | "DONE" | "CANCELLED";
  doctorName: string;
  specialization: string;
  reason?: string;
  doctorId?: number;
  numericalOrder?: number;
}
interface DashboardResponse {
  charts: {
    monthly: Record<string, number>;
    yearly: Record<string, number>;
  };
  appointments: {
    book_appointment: {
      id: number;
      patientId: string;
      workSchedule: number;
      numericalOrder: number;
      note: string;
      createdAt: string;
      status: string;
    };
    work_schedule: {
      id: number;
      doctor: {
        id: number;
        userId: string;
        firstName: string;
        lastName: string;
        specialization: string;
        typeDisease: {
          name: string;
        };
      };
      shift: {
        start: string;
        end: string;
      };
      dateAppointment: string;
    };
  }[];
  appointmentStats: {
    total: number;
    cancelled: number;
    complete: number;
    upcoming: number;
  };
}

const PatientDashboard: React.FC = () => {
  // Lấy thông tin người dùng từ Redux store
  const user = useSelector((state: any) => state.user.user);

  // State để theo dõi chế độ xem thời gian (tháng hoặc năm)
  const [timeView, setTimeView] = useState<"month" | "year">("month");

  // Tách state thành các phần riêng biệt để dễ quản lý - giống Doctor Dashboard
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Tách các trạng thái dữ liệu riêng biệt thay vì lưu trong một đối tượng patientData duy nhất
  const [appointmentStats, setAppointmentStats] = useState({
    total: 0,
    completed: 0,
    upcoming: 0,
    cancelled: 0,
  });

  const [monthlyAppointments, setMonthlyAppointments] = useState({
    jan: 0,
    feb: 0,
    mar: 0,
    apr: 0,
    may: 0,
    jun: 0,
    jul: 0,
    aug: 0,
    sep: 0,
    oct: 0,
    nov: 0,
    dec: 0,
  });

  const [yearlyAppointments, setYearlyAppointments] = useState<
    Record<string, number>
  >({});

  const [todayAppointments, setTodayAppointments] = useState<Appointment[]>([]);
  const [appointmentsLoading, setAppointmentsLoading] = useState<boolean>(true);
  const [appointmentsError, setAppointmentsError] = useState<string | null>(
    null
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Helper function to format time from API format
  const formatTimeFromApiFormat = (timeString: string): string => {
    // Format from "07-00-00" to "07:00"
    const parts = timeString.split("-");
    if (parts.length >= 2) {
      return `${parts[0]}:${parts[1]}`;
    }
    return timeString;
  };

  // Lấy dữ liệu thống kê của bệnh nhân
  useEffect(() => {
    const fetchPatientData = async () => {
      // Kiểm tra ID người dùng tồn tại
      if (!user?.userId) {
        setError("Không tìm thấy thông tin người dùng");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setAppointmentsLoading(true);

        console.log("Fetching patient dashboard data for userId:", user.userId);
        const response = await getPatientDashboard(user.userId);
        const dashboardData: DashboardResponse = response.data;
        console.log("Dashboard data:", dashboardData);

        // Update appointment stats
        setAppointmentStats({
          total: dashboardData.appointmentStats.total,
          completed: dashboardData.appointmentStats.complete,
          upcoming: dashboardData.appointmentStats.upcoming,
          cancelled: dashboardData.appointmentStats.cancelled,
        });

        // Update monthly appointments chart data
        setMonthlyAppointments({
          jan: dashboardData.charts.monthly.jan,
          feb: dashboardData.charts.monthly.feb,
          mar: dashboardData.charts.monthly.mar,
          apr: dashboardData.charts.monthly.apr,
          may: dashboardData.charts.monthly.may,
          jun: dashboardData.charts.monthly.jun,
          jul: dashboardData.charts.monthly.jul,
          aug: dashboardData.charts.monthly.aug,
          sep: dashboardData.charts.monthly.sep,
          oct: dashboardData.charts.monthly.oct,
          nov: dashboardData.charts.monthly.nov,
          dec: dashboardData.charts.monthly.dec,
        });

        // Update yearly appointments chart data
        setYearlyAppointments(dashboardData.charts.yearly);

        const today = format(new Date(), "dd-MM-yyyy");
        // Format today's appointments from the API response
        const formattedAppointments: Appointment[] = dashboardData.appointments
          // lọc ngày hiện tại
          .filter((appt) => appt.work_schedule.dateAppointment === today)
          .map((appt) => ({
            id: appt.book_appointment.id,
            workScheduleId: appt.work_schedule.id,
            date: appt.work_schedule.dateAppointment,
            startTime: formatTimeFromApiFormat(appt.work_schedule.shift.start),
            endTime: formatTimeFromApiFormat(appt.work_schedule.shift.end),
            status: appt.book_appointment.status as any,
            doctorName: `Bác sĩ ${appt.work_schedule.doctor.lastName} ${appt.work_schedule.doctor.firstName}`,
            specialization: appt.work_schedule.doctor.specialization,
            reason:
              appt.book_appointment.note ||
              appt.work_schedule.doctor.typeDisease.name,
            doctorId: appt.work_schedule.doctor.id,
            numericalOrder: appt.book_appointment.numericalOrder,
          }));
        console.log("Formatted appointments:", formattedAppointments);
        setTodayAppointments(formattedAppointments);
        setError(null);
        setAppointmentsError(null);
      } catch (err) {
        console.error("Error fetching patient dashboard data:", err);
        setError("Không thể tải dữ liệu bệnh nhân");
        setAppointmentsError("Không thể tải dữ liệu lịch hẹn");
      } finally {
        setLoading(false);
        setAppointmentsLoading(false);
      }
    };

    fetchPatientData();
  }, [user]);

  // Hiển thị trạng thái đang tải
  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  // Hiển thị lỗi nếu có
  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  // Hiển thị thông báo đang tải dữ liệu
  if (!appointmentStats) {
    return <Alert severity="info">Đang tải dữ liệu...</Alert>;
  }

  // Xử lý thay đổi chế độ xem thời gian
  const handleTimeViewChange = (
    event: React.MouseEvent<HTMLElement>,
    newTimeView: "month" | "year" | null
  ) => {
    if (newTimeView !== null) {
      setTimeView(newTimeView);
    }
  };
  const handleAppointmentClick = (appointmentId: number) => {
    navigate(`/patient/appointments/${appointmentId}`);
  };
  // Lấy chart data dưa vào chế độ xem thời gian
  const getChartConfig = () => {
    switch (timeView) {
      case "month":
        return {
          xAxisData: [
            "T1",
            "T2",
            "T3",
            "T4",
            "T5",
            "T6",
            "T7",
            "T8",
            "T9",
            "T10",
            "T11",
            "T12",
          ],
          seriesData: [
            monthlyAppointments.jan,
            monthlyAppointments.feb,
            monthlyAppointments.mar,
            monthlyAppointments.apr,
            monthlyAppointments.may,
            monthlyAppointments.jun,
            monthlyAppointments.jul,
            monthlyAppointments.aug,
            monthlyAppointments.sep,
            monthlyAppointments.oct,
            monthlyAppointments.nov,
            monthlyAppointments.dec,
          ],
          title: "Thống kê lịch hẹn trong năm (theo tháng)",
        };
      case "year":
        // Lấy danh sách các năm và sắp xếp theo thứ tự tăng dần
        const yearKeys = Object.keys(yearlyAppointments).sort();
        return {
          xAxisData: yearKeys,
          seriesData: yearKeys.map((year) => yearlyAppointments[year]),
          title: "Thống kê lịch hẹn theo năm",
        };
      default:
        return { xAxisData: [], seriesData: [], title: "" };
    }
  };

  const chartConfig = getChartConfig();

  return (
    <>
      <Grid container spacing={3}>
        {/* Thống kê lịch hẹn với biểu đồ tròn */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Thống kê lịch hẹn
            </Typography>
            <Stack spacing={2} mt={2}>
              <Box
                sx={{
                  height: 350,
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography
                  variant="h5"
                  align="center"
                  color="primary"
                  gutterBottom
                  sx={{ mb: 3 }}
                >
                  Tổng số lịch hẹn: {appointmentStats.total}
                </Typography>
                <PieChart
                  series={[
                    {
                      data: [
                        {
                          id: 0,
                          value: appointmentStats.completed, // Số lượng lịch hẹn đã hoàn thành
                          label: "Đã hoàn thành",
                          color: "#4caf50", // Màu xanh lá cây
                        },
                        {
                          id: 1,
                          value: appointmentStats.upcoming, // Số lượng lịch hẹn sắp tới
                          label: "Sắp tới",
                          color: "#2196f3", // Màu xanh dương
                        },
                        {
                          id: 2,
                          value: appointmentStats.cancelled, // Số lượng lịch hẹn đã hủy
                          label: "Đã hủy",
                          color: "#f44336", // Màu đỏ
                        },
                      ],
                      // Di chuột vào biểu đồ sẽ hiển thị thông tin chi tiết
                      // faded: global - Khi di chuột qua một phân đoạn, tất cả các phân đoạn khác sẽ mờ đi
                      // highlighted: item - Chỉ phân đoạn được di chuột qua sẽ được làm nổi bật
                      highlightScope: { faded: "global", highlighted: "item" },
                      faded: {
                        // Độ rỗng ở giữa hình tròn
                        innerRadius: 30,
                        // Thu nhỏ các phân đoạn bị mờ đi
                        additionalRadius: -30,
                        color: "gray",
                      },
                    },
                  ]}
                  height={300} // Chiều cao biểu đồ (pixel)
                  width={500} // Chiều rộng biểu đồ (pixel)
                  // Lề của biểu đồ để tránh đè lên các phần khác như chú thích
                  margin={{ top: 50, left: 50, right: 50 }}
                  slotProps={{
                    legend: {
                      hidden: false, // Hiển thị chú thích
                      position: { vertical: "top", horizontal: "middle" }, // Vị trí chú thích
                      direction: "row", // Hướng chú thích (ngang)
                    },
                  }}
                />
              </Box>
            </Stack>
          </Paper>
        </Grid>

        {/* Biểu đồ thống kê lịch hẹn theo tháng và năm */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography variant="h6" gutterBottom>
                {chartConfig.title}
              </Typography>
              <ToggleButtonGroup
                value={timeView}
                exclusive
                onChange={handleTimeViewChange}
                aria-label="time view"
                size="small"
              >
                <ToggleButton value="month" aria-label="month view">
                  Tháng
                </ToggleButton>
                <ToggleButton value="year" aria-label="year view">
                  Năm
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>
            <Stack spacing={2} mt={2}>
              <Box
                sx={{
                  height: 350,
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {/* Biểu đồ thống kê số lịch hẹn theo tháng/năm */}
                <BarChart
                  xAxis={[
                    {
                      scaleType: "band", // Sử dụng dạng biểu đồ cột
                      data: chartConfig.xAxisData,
                      tickLabelStyle: {
                        fontSize: 12,
                        fontWeight: 600,
                      },
                    },
                  ]}
                  // Cấu hình dữ liệu hiển thị trên biểu đồ
                  series={[
                    {
                      data: chartConfig.seriesData,
                      label: "Số lịch hẹn", // Nhãn cho chuỗi dữ liệu
                    },
                  ]}
                  // Sử dụng màu xanh dương cho biểu đồ lịch hẹn
                  colors={["#2196f3"]}
                  height={320} // Chiều cao của biểu đồ (pixel)
                  width={590} // Chiều rộng của biểu đồ (pixel)
                  // Thêm tiêu đề trục Y
                  yAxis={[
                    {
                      label: "Số lịch hẹn",
                    },
                  ]}
                  margin={{ left: timeView === "year" ? 120 : 80 }}
                  // Cấu hình tooltip hiển thị khi di chuột vào từng cột
                  tooltip={{ trigger: "item" }}
                />
              </Box>
            </Stack>
          </Paper>
        </Grid>

        {/* Phần hiển thị lịch hẹn hôm nay */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography
              variant="h6"
              gutterBottom
              mb={2}
              display="flex"
              alignItems="center"
            >
              <EventIcon sx={{ mr: 1 }} />
              Lịch hẹn hôm nay
            </Typography>
            {/* Hiển thị trạng thái tải dữ liệu lịch hẹn */}
            {appointmentsLoading ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
                <CircularProgress size={24} />
              </Box>
            ) : appointmentsError ? (
              <Alert severity="error" sx={{ mb: 2 }}>
                {appointmentsError}
              </Alert>
            ) : todayAppointments && todayAppointments.length > 0 ? (
              <List sx={{ width: "100%" }}>
                {todayAppointments.map((appointment, index) => (
                  <React.Fragment key={appointment.id}>
                    {index > 0 && <Divider component="li" />}
                    <ListItem
                      alignItems="flex-start"
                      sx={{
                        "&:hover": {
                          bgcolor: "rgba(0, 0, 0, 0.04)",
                          cursor: "pointer",
                        },
                      }}
                      onClick={() =>
                        handleAppointmentClick(appointment.workScheduleId)
                      }
                    >
                      <ListItemText
                        primary={
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              mb: 1,
                            }}
                          >
                            <Typography
                              variant="subtitle1"
                              component="span"
                              fontWeight="medium"
                            >
                              STT: {appointment.numericalOrder} -{" "}
                              {appointment.doctorName}
                            </Typography>
                          </Box>
                        }
                        secondary={
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              gap: 0.5,
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <AccessTimeIcon
                                fontSize="small"
                                sx={{ color: "text.secondary", fontSize: 16 }}
                              />
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                component="span"
                              >
                                {appointment.startTime} - {appointment.endTime}
                              </Typography>
                            </Box>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <MedicalServicesIcon
                                fontSize="small"
                                sx={{ color: "text.secondary", fontSize: 16 }}
                              />
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                component="span"
                              >
                                {appointment.reason}
                              </Typography>
                            </Box>
                          </Box>
                        }
                        secondaryTypographyProps={{
                          component: "div", // Change the secondary Typography to render as div instead of p
                        }}
                      />
                    </ListItem>
                  </React.Fragment>
                ))}
              </List>
            ) : (
              <EmptyState message="Không có lịch hẹn nào hôm nay" />
            )}
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};
export default PatientDashboard;
