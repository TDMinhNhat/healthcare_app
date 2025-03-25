import React, { useState, useEffect } from "react";
import {
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  CircularProgress,
  Box,
  Alert,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import EmptyState from "../../components/EmptyState";
import { BarChart } from "@mui/x-charts/BarChart";
import { PieChart } from "@mui/x-charts/PieChart";

// Dữ liệu mẫu đơn giản cho toa thuốc - theo cấu trúc của MedicalRecordDrug
const MOCK_MEDICATIONS = [
  {
    drug: {
      id: 1,
      drugName: "Amlodipine",
      unit: "viên",
    },
    howUse: "Uống 1 viên mỗi ngày vào buổi sáng",
    quantity: 30,
  },
  {
    drug: {
      id: 2,
      drugName: "Losartan",
      unit: "viên",
    },
    howUse: "Uống 1 viên mỗi ngày vào buổi tối",
    quantity: 30,
  },
  {
    drug: {
      id: 3,
      drugName: "Vitamin C",
      unit: "viên",
    },
    howUse: "Uống 1 viên mỗi ngày sau bữa sáng",
    quantity: 60,
  },
];

const PatientDashboard: React.FC = () => {
  // Lấy thông tin người dùng từ Redux store
  const user = useSelector((state: any) => state.user.user);

  // Các state để quản lý dữ liệu và trạng thái tải
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [patientData, setPatientData] = useState<any | null>(null);
  const [medications, setMedications] = useState<any[] | null>(null);
  const [medicationsLoading, setMedicationsLoading] = useState<boolean>(true);
  const [medicationsError, setMedicationsError] = useState<string | null>(null);
  const dispatch = useDispatch();

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
        // Dữ liệu mẫu cho demo - trong thực tế sẽ gọi API
        const data = {
          appointmentStats: {
            total: 12, // Tổng số lịch hẹn
            completed: 10, // Số lịch hẹn đã hoàn thành
            upcoming: 2, // Số lịch hẹn sắp tới
            cancelled: 1, // Số lịch hẹn đã hủy
          },
          // Dữ liệu lịch hẹn theo ngày trong tuần
          weeklyAppointments: {
            monday: 2, // Số lịch hẹn thứ 2
            tuesday: 1, // Số lịch hẹn thứ 3
            wednesday: 3, // Số lịch hẹn thứ 4
            thursday: 0, // Số lịch hẹn thứ 5
            friday: 2, // Số lịch hẹn thứ 6
            saturday: 4, // Số lịch hẹn thứ 7
            sunday: 0, // Số lịch hẹn chủ nhật
          },
        };
        setPatientData(data);
        setError(null);
      } catch (err) {
        setError("Không thể tải dữ liệu bệnh nhân");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPatientData();
  }, [user]);

  // Lấy dữ liệu thuốc riêng biệt
  useEffect(() => {
    const fetchMedications = async () => {
      // Kiểm tra ID người dùng tồn tại
      if (!user?.userId) {
        setMedicationsError("Không tìm thấy thông tin người dùng");
        setMedicationsLoading(false);
        return;
      }

      try {
        setMedicationsLoading(true);
        // Giả lập gọi API với độ trễ 500ms
        await new Promise((resolve) => setTimeout(resolve, 500));
        // Sử dụng dữ liệu mẫu
        setMedications(MOCK_MEDICATIONS);
        setMedicationsError(null);
      } catch (err) {
        setMedicationsError("Không thể tải dữ liệu thuốc");
        console.error(err);
      } finally {
        setMedicationsLoading(false);
      }
    };

    fetchMedications();
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
  if (!patientData) {
    return <Alert severity="info">Đang tải dữ liệu...</Alert>;
  }

  const { appointmentStats, weeklyAppointments } = patientData;

  // Chuẩn bị dữ liệu cho biểu đồ
  const appointmentChartData = [
    {
      id: 0,
      value: appointmentStats.completed,
      label: "Đã hoàn thành",
      color: "#4caf50",
    },
    {
      id: 1,
      value: appointmentStats.upcoming,
      label: "Sắp tới",
      color: "#2196f3",
    },
    {
      id: 2,
      value: appointmentStats.cancelled,
      label: "Đã hủy",
      color: "#f44336",
    },
  ];

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

        {/* Biểu đồ thống kê lịch hẹn theo ngày trong tuần */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Thống kê lịch hẹn trong tuần
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
                {/* Biểu đồ thống kê số lịch hẹn theo ngày trong tuần */}
                <BarChart
                  xAxis={[
                    {
                      scaleType: "band", // Sử dụng dạng biểu đồ cột
                      data: [
                        "Thứ 2",
                        "Thứ 3",
                        "Thứ 4",
                        "Thứ 5",
                        "Thứ 6",
                        "Thứ 7",
                        "Chủ nhật",
                      ],
                      tickLabelStyle: {
                        fontSize: 12,
                        fontWeight: 600,
                      },
                    },
                  ]}
                  // Cấu hình dữ liệu hiển thị trên biểu đồ
                  series={[
                    {
                      data: [
                        weeklyAppointments.monday, // Số lịch hẹn thứ 2
                        weeklyAppointments.tuesday, // Số lịch hẹn thứ 3
                        weeklyAppointments.wednesday, // Số lịch hẹn thứ 4
                        weeklyAppointments.thursday, // Số lịch hẹn thứ 5
                        weeklyAppointments.friday, // Số lịch hẹn thứ 6
                        weeklyAppointments.saturday, // Số lịch hẹn thứ 7
                        weeklyAppointments.sunday, // Số lịch hẹn chủ nhật
                      ],
                      label: "Số lịch hẹn", // Nhãn cho chuỗi dữ liệu
                    },
                  ]}
                  // Sử dụng màu xanh dương cho biểu đồ lịch hẹn trong tuần
                  colors={["#2196f3"]}
                  height={320} // Chiều cao của biểu đồ (pixel)
                  width={590} // Chiều rộng của biểu đồ (pixel)
                  // Thêm tiêu đề trục Y
                  yAxis={[
                    {
                      label: "Số lịch hẹn",
                    },
                  ]}
                  // Cấu hình tooltip hiển thị khi di chuột vào từng cột
                  tooltip={{ trigger: "item" }}
                />
              </Box>
            </Stack>
          </Paper>
        </Grid>

        {/* Phần hiển thị toa thuốc */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom mb={2}>
              Toa thuốc
            </Typography>

            {/* Hiển thị trạng thái tải dữ liệu thuốc */}
            {medicationsLoading ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
                <CircularProgress size={24} />
              </Box>
            ) : medicationsError ? (
              <Alert severity="error" sx={{ mb: 2 }}>
                {medicationsError}
              </Alert>
            ) : medications && medications.length > 0 ? (
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        Tên thuốc
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        Cách dùng
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        Số lượng
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Đơn vị</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {medications.map((med, index) => (
                      <TableRow key={index}>
                        <TableCell>{med.drug.drugName}</TableCell>
                        <TableCell>{med.howUse}</TableCell>
                        <TableCell align="center">{med.quantity}</TableCell>
                        <TableCell>{med.drug.unit}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <EmptyState message="Không có thuốc nào đang được sử dụng" />
            )}
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};

export default PatientDashboard;
