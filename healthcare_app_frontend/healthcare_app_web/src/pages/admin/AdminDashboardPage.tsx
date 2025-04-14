import React, { useState, useEffect } from "react";
import {
  Typography,
  Paper,
  Grid,
  CircularProgress,
  Box,
  Card,
  CardContent,
  Stack,
  ToggleButtonGroup,
  ToggleButton,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Chip,
  Container,
} from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import { PieChart } from "@mui/x-charts/PieChart";
import { LineChart } from "@mui/x-charts/LineChart";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import PeopleIcon from "@mui/icons-material/People";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import { useSelector } from "react-redux";
import { format } from "date-fns";

interface AdminDashboardResponse {
  revenue: {
    total: number; // Tổng doanh thu
    quarterly: Record<string, number>; // Doanh thu theo quý
    monthly: Record<string, number>; // Doanh thu theo tháng
  };
  patients: {
    total: number; // Tổng số bệnh nhân
    quarterly: Record<string, number>; // Số bệnh nhân theo quý
    monthly: Record<string, number>; // Số bệnh nhân theo tháng
  };
  topDoctors: TopDoctor[]; // Danh sách bác sĩ hàng đầu
}

// Giao diện dữ liệu cho thông tin bác sĩ
interface TopDoctor {
  id: number;
  userId: string;
  firstName: string;
  lastName: string;
  avatar: string;
  specialization: string; // Chuyên khoa
  patientCount: number; // Số lượng bệnh nhân
  //   revenue: number; // Doanh thu
}

const AdminDashboardPage: React.FC = () => {
  // Lấy thông tin người dùng từ Redux store
  const user = useSelector((state: any) => state.user.user);

  // State để theo dõi loại xem thời gian đã chọn (quý hoặc tháng)
  const [timeView, setTimeView] = useState<"quarter" | "month">("quarter");

  // Các state cho dữ liệu bảng điều khiển
  // State cho tổng doanh thu
  const [totalRevenue, setTotalRevenue] = useState(0);
  // State cho tổng số bệnh nhân
  const [totalPatients, setTotalPatients] = useState(0);
  // State cho doanh thu theo tháng
  const [monthlyRevenue, setMonthlyRevenue] = useState<Record<string, number>>(
    {}
  );
  // State cho doanh thu theo quý
  const [quarterlyRevenue, setQuarterlyRevenue] = useState<
    Record<string, number>
  >({});
  // State cho số bệnh nhân theo tháng
  const [monthlyPatients, setMonthlyPatients] = useState<
    Record<string, number>
  >({});
  // State cho số bệnh nhân theo quý
  const [quarterlyPatients, setQuarterlyPatients] = useState<
    Record<string, number>
  >({});
  // State cho danh sách bác sĩ hàng đầu
  const [topDoctors, setTopDoctors] = useState<TopDoctor[]>([]);
  // State cho trạng thái tải
  const [isLoading, setIsLoading] = useState(true);
  // State cho lỗi
  const [error, setError] = useState<string | null>(null);

  // Lấy dữ liệu bảng điều khiển từ API
  useEffect(() => {
    const fetchDashboardData = async () => {
      // Kiểm tra xem có thông tin người dùng không
      if (!user?.userId) {
        setError("Không tìm thấy thông tin người dùng");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        // Thông thường sẽ gọi API ở đây:
        // const response = await getAdminDashboard();
        // const dashboardData: AdminDashboardResponse = response.data;

        // Dữ liệu mẫu cho demo
        const dashboardData: AdminDashboardResponse = {
          revenue: {
            total: 1250000000,
            quarterly: {
              Q1: 280000000,
              Q2: 320000000,
              Q3: 350000000,
              Q4: 300000000,
            },
            monthly: {
              "1": 90000000,
              "2": 85000000,
              "3": 105000000,
              "4": 98000000,
              "5": 110000000,
              "6": 112000000,
              "7": 125000000,
              "8": 115000000,
              "9": 110000000,
              "10": 95000000,
              "11": 105000000,
              "12": 100000000,
            },
          },
          patients: {
            total: 4800,
            quarterly: {
              Q1: 1200,
              Q2: 1350,
              Q3: 1280,
              Q4: 970,
            },
            monthly: {
              "1": 400,
              "2": 380,
              "3": 420,
              "4": 430,
              "5": 450,
              "6": 470,
              "7": 490,
              "8": 420,
              "9": 370,
              "10": 320,
              "11": 340,
              "12": 310,
            },
          },
          topDoctors: [
            {
              id: 1,
              userId: "BS001",
              firstName: "Nguyễn",
              lastName: "Văn A",
              avatar: "https://i.pravatar.cc/150?img=1",
              specialization: "Nội khoa",
              patientCount: 520,
            },
            {
              id: 2,
              userId: "BS002",
              firstName: "Trần",
              lastName: "Thị B",
              avatar: "https://i.pravatar.cc/150?img=2",
              specialization: "Nhi khoa",
              patientCount: 480,
            },
            {
              id: 3,
              userId: "BS003",
              firstName: "Lê",
              lastName: "Minh C",
              avatar: "https://i.pravatar.cc/150?img=3",
              specialization: "Da liễu",
              patientCount: 450,
            },
            {
              id: 4,
              userId: "BS004",
              firstName: "Phạm",
              lastName: "Thanh D",
              avatar: "https://i.pravatar.cc/150?img=4",
              specialization: "Tim mạch",
              patientCount: 420,
            },
            {
              id: 5,
              userId: "BS005",
              firstName: "Hoàng",
              lastName: "Bảo E",
              avatar: "https://i.pravatar.cc/150?img=5",
              specialization: "Thần kinh",
              patientCount: 380,
            },
          ],
        };

        // Cập nhật state với dữ liệu từ API
        setTotalRevenue(dashboardData.revenue.total);
        setTotalPatients(dashboardData.patients.total);
        setMonthlyRevenue(dashboardData.revenue.monthly);
        setQuarterlyRevenue(dashboardData.revenue.quarterly);
        setMonthlyPatients(dashboardData.patients.monthly);
        setQuarterlyPatients(dashboardData.patients.quarterly);
        setTopDoctors(dashboardData.topDoctors);
        setError(null);
      } catch (err) {
        console.error("Error fetching admin dashboard data:", err);
        setError("Không thể tải dữ liệu bảng điều khiển");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  // Hàm định dạng tiền tệ
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Hàm định dạng số lượng bệnh nhân
  const formatPatientCount = (count: number): string => {
    return new Intl.NumberFormat("vi-VN").format(count);
  };

  // Xử lý khi thay đổi chế độ xem thời gian
  const handleTimeViewChange = (
    event: React.MouseEvent<HTMLElement>,
    newTimeView: "quarter" | "month" | null
  ) => {
    if (newTimeView !== null) {
      setTimeView(newTimeView);
    }
  };

  // Lấy dữ liệu biểu đồ dựa trên chế độ xem thời gian đã chọn cho doanh thu
  const getRevenueChartConfig = () => {
    switch (timeView) {
      case "month": {
        // Dữ liệu cho xem theo tháng
        const monthNames = [
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
        ];
        const months = Array.from({ length: 12 }, (_, i) => String(i + 1));

        return {
          xAxisData: monthNames,
          seriesData: months.map((month) => monthlyRevenue[month] || 0),
          title: "Doanh thu theo tháng trong năm",
        };
      }
      case "quarter": {
        // Dữ liệu cho xem theo quý
        const quarters = ["Q1", "Q2", "Q3", "Q4"];

        return {
          xAxisData: quarters,
          seriesData: quarters.map((quarter) => quarterlyRevenue[quarter] || 0),
          title: "Doanh thu theo quý trong năm",
        };
      }
      default:
        return { xAxisData: [], seriesData: [], title: "" };
    }
  };

  // Lấy dữ liệu biểu đồ dựa trên chế độ xem thời gian đã chọn cho bệnh nhân
  const getPatientsChartConfig = () => {
    switch (timeView) {
      case "month": {
        // Dữ liệu cho xem theo tháng
        const monthNames = [
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
        ];
        const months = Array.from({ length: 12 }, (_, i) => String(i + 1));

        return {
          xAxisData: monthNames,
          seriesData: months.map((month) => monthlyPatients[month] || 0),
          title: "Số bệnh nhân theo tháng trong năm",
        };
      }
      case "quarter": {
        // Dữ liệu cho xem theo quý
        const quarters = ["Q1", "Q2", "Q3", "Q4"];

        return {
          xAxisData: quarters,
          seriesData: quarters.map(
            (quarter) => quarterlyPatients[quarter] || 0
          ),
          title: "Số bệnh nhân theo quý trong năm",
        };
      }
      default:
        return { xAxisData: [], seriesData: [], title: "" };
    }
  };

  // Lấy cấu hình biểu đồ
  const revenueChartConfig = getRevenueChartConfig();
  const patientsChartConfig = getPatientsChartConfig();

  // Hiển thị màn hình tải khi đang tải dữ liệu
  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  // Hiển thị thông báo lỗi nếu có lỗi
  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  // Hiển thị giao diện chính của trang bảng điều khiển
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", mb: 3 }}>
        Bảng Điều Khiển Quản Trị
      </Typography>

      {/* Thẻ tổng kết */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Thẻ Tổng Doanh Thu */}
        <Grid item xs={12} sm={6} md={6}>
          <Card
            sx={{ height: "100%", bgcolor: "primary.light", color: "white" }}
          >
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <AttachMoneyIcon sx={{ fontSize: 40, mr: 1 }} />
                <Typography variant="h5" component="div">
                  Tổng Doanh Thu
                </Typography>
              </Box>
              <Typography variant="h3" fontWeight="bold">
                {formatCurrency(totalRevenue)}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1, opacity: 0.8 }}>
                Năm {new Date().getFullYear()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Thẻ Tổng Số Bệnh Nhân */}
        <Grid item xs={12} sm={6} md={6}>
          <Card
            sx={{ height: "100%", bgcolor: "success.light", color: "white" }}
          >
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <PeopleIcon sx={{ fontSize: 40, mr: 1 }} />
                <Typography variant="h5" component="div">
                  Tổng Số Bệnh Nhân
                </Typography>
              </Box>
              <Typography variant="h3" fontWeight="bold">
                {formatPatientCount(totalPatients)}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1, opacity: 0.8 }}>
                Năm {new Date().getFullYear()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Nút chuyển đổi cho giai đoạn thời gian */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <ToggleButtonGroup
          value={timeView}
          exclusive
          onChange={handleTimeViewChange}
          aria-label="time view"
          size="small"
        >
          <ToggleButton value="quarter" aria-label="quarter view">
            Quý
          </ToggleButton>
          <ToggleButton value="month" aria-label="month view">
            Tháng
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Biểu đồ - Cạnh nhau */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Biểu đồ Doanh Thu */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom fontWeight="medium">
              {revenueChartConfig.title}
            </Typography>
            <Box sx={{ height: 350, width: "100%" }}>
              <LineChart
                xAxis={[
                  {
                    scaleType: "band",
                    data: revenueChartConfig.xAxisData,
                    tickLabelStyle: { fontSize: 12, fontWeight: 600 },
                  },
                ]}
                series={[
                  {
                    data: revenueChartConfig.seriesData,
                    label: "Doanh thu (VND)",
                    color: "#2196f3",
                  },
                ]}
                height={320}
                width={500}
                margin={{ left: 100, right: 20 }}
                tooltip={{
                  trigger: "item",
                  valueFormatter: (value) => formatCurrency(value),
                }}
                slotProps={{
                  legend: { hidden: false },
                }}
              />
            </Box>
          </Paper>
        </Grid>

        {/* Biểu đồ Thống kê Bệnh nhân */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom fontWeight="medium">
              {patientsChartConfig.title}
            </Typography>
            <Box sx={{ height: 350, width: "100%" }}>
              <LineChart
                xAxis={[
                  {
                    scaleType: "band",
                    data: patientsChartConfig.xAxisData,
                    tickLabelStyle: { fontSize: 12, fontWeight: 600 },
                  },
                ]}
                series={[
                  {
                    data: patientsChartConfig.seriesData,
                    label: "Số bệnh nhân",
                    color: "#4caf50",
                  },
                ]}
                height={320}
                width={500}
                margin={{ left: 70, right: 20 }}
                tooltip={{ trigger: "item" }}
                slotProps={{
                  legend: { hidden: false },
                }}
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Bảng Top Bác sĩ */}
      <Paper sx={{ p: 2, mb: 4 }}>
        <Typography
          variant="h6"
          gutterBottom
          fontWeight="medium"
          sx={{ mb: 2 }}
        >
          Top Bác Sĩ Theo Số Lượng Bệnh Nhân Trong Tháng
        </Typography>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Thứ hạng</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Bác sĩ</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Chuyên khoa</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Số bệnh nhân</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {topDoctors.map((doctor, index) => (
                <TableRow key={doctor.id} hover>
                  <TableCell>
                    <Chip
                      label={`#${index + 1}`}
                      color={index < 3 ? "primary" : "default"}
                      size="small"
                      sx={{ fontWeight: "bold" }}
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Avatar
                        src={doctor.avatar}
                        alt={doctor.lastName}
                        sx={{ mr: 2 }}
                      />
                      <Typography>
                        BS. {doctor.firstName} {doctor.lastName}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{doctor.specialization}</TableCell>
                  <TableCell>
                    {formatPatientCount(doctor.patientCount)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
};

export default AdminDashboardPage;
