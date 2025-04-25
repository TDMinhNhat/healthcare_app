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
import { useNavigate } from "react-router";
import { ROUTING } from "../../constants/routing";
import { getDashboard } from "../../services/appointment/dashboard_service";

interface DashboardVisualize {
  salaries: {
    month: Record<string, number>;
    year: Record<string, number>;
    quarter: Record<string, number>;
  };
  patients: {
    month: Record<string, number>;
    year: Record<string, number>;
    quarter: Record<string, number>;
  };
}

interface AdminDashboardResponse {
  salaries: {
    total: number;
    total_previous_year: number;
    total_this_year: number;
  };
  doctors: {
    total: number;
    total_previous_year: number;
    total_this_year: number;
  };
  patients: {
    total: number;
    total_previous_year: number;
    total_this_year: number;
  };
  visualize: DashboardVisualize;
}

const AdminDashboardPage: React.FC = () => {
  const navigate = useNavigate();

  // Lấy thông tin người dùng từ Redux store
  const user = useSelector((state: any) => state.user.user);

  // State để theo dõi loại xem thời gian đã chọn (quý, tháng hoặc năm)
  const [timeView, setTimeView] = useState<"quarter" | "month" | "year">(
    "quarter"
  );

  // Các state cho dữ liệu bảng điều khiển
  // State cho tổng doanh thu
  const [totalRevenue, setTotalRevenue] = useState(0);
  // State cho tổng số bệnh nhân
  const [totalPatients, setTotalPatients] = useState(0);
  // State cho tổng số bác sĩ
  const [totalDoctors, setTotalDoctors] = useState(0);
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
  // State cho doanh thu theo năm
  const [yearlyRevenue, setYearlyRevenue] = useState<Record<string, number>>(
    {}
  );
  // State cho số bệnh nhân theo năm
  const [yearlyPatients, setYearlyPatients] = useState<Record<string, number>>(
    {}
  );
  // State cho trạng thái tải
  const [isLoading, setIsLoading] = useState(true);
  // State cho lỗi
  const [error, setError] = useState<string | null>(null);
  // State cho thông tin so sánh năm trước
  const [yearComparison, setYearComparison] = useState({
    revenue: { current: 0, previous: 0 },
    patients: { current: 0, previous: 0 },
  });

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
        // Gọi API để lấy dữ liệu dashboard
        const response = await getDashboard();
        const dashboardData: AdminDashboardResponse = response.data;

        // Cập nhật state với dữ liệu từ API
        setTotalRevenue(dashboardData.salaries.total);
        setTotalPatients(dashboardData.patients.total);
        setTotalDoctors(dashboardData.doctors.total);

        // Cập nhật dữ liệu so sánh năm
        setYearComparison({
          revenue: {
            current: dashboardData.salaries.total_this_year,
            previous: dashboardData.salaries.total_previous_year,
          },
          patients: {
            current: dashboardData.patients.total_this_year,
            previous: dashboardData.patients.total_previous_year,
          },
        });

        // Xử lý dữ liệu tháng (chuyển tên tháng sang số tháng)
        const monthlyRevenueData: Record<string, number> = {};
        const monthlyPatientsData: Record<string, number> = {};

        // Danh sách tháng theo thứ tự
        const monthOrder = [
          "JANUARY",
          "FEBRUARY",
          "MARCH",
          "APRIL",
          "MAY",
          "JUNE",
          "JULY",
          "AUGUST",
          "SEPTEMBER",
          "OCTOBER",
          "NOVEMBER",
          "DECEMBER",
        ];

        // Xử lý dữ liệu theo tháng
        monthOrder.forEach((month, index) => {
          const monthNum = String(index + 1);
          if (dashboardData.visualize.salaries.month[month] !== undefined) {
            monthlyRevenueData[monthNum] =
              dashboardData.visualize.salaries.month[month];
          }
          if (dashboardData.visualize.patients.month[month] !== undefined) {
            monthlyPatientsData[monthNum] =
              dashboardData.visualize.patients.month[month];
          }
        });

        setMonthlyRevenue(monthlyRevenueData);
        setMonthlyPatients(monthlyPatientsData);

        // Xử lý dữ liệu theo quý
        const quarterlyRevenueData: Record<string, number> = {};
        const quarterlyPatientsData: Record<string, number> = {};

        // Lấy key - value dưới dạng mảng
        Object.entries(dashboardData.visualize.salaries.quarter).forEach(
          ([quarter, value]) => {
            quarterlyRevenueData[`Q${quarter}`] = value;
          }
        );

        Object.entries(dashboardData.visualize.patients.quarter).forEach(
          ([quarter, value]) => {
            quarterlyPatientsData[`Q${quarter}`] = value;
          }
        );

        setQuarterlyRevenue(quarterlyRevenueData);
        setQuarterlyPatients(quarterlyPatientsData);

        // Xử lý dữ liệu theo năm
        setYearlyRevenue(dashboardData.visualize.salaries.year);
        setYearlyPatients(dashboardData.visualize.patients.year);

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
    newTimeView: "quarter" | "month" | "year" | null
  ) => {
    if (newTimeView !== null) {
      setTimeView(newTimeView);
    }
  };

  // Hàm xử lý khi người dùng nhấp vào điểm trên biểu đồ với kiểm tra dữ liệu đúng đắn
  const handleChartItemClick = (value: string) => {
    if (value !== undefined) {
      // const period =
      //   timeView === "quarter" ? `Q${dataIndex + 1}` : `${dataIndex + 1}`;
      console.log(`Điều hướng đến: /admin/doctor-revenue/${timeView}/${value}`);
      navigate(`/admin/doctor-revenue/${timeView}/${value}`);
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
      case "year": {
        // Lấy 5 năm gần đây nhất theo thứ tự tăng dần (từ cũ đến mới)
        const years = Object.keys(yearlyRevenue)
          .sort((a, b) => parseInt(a) - parseInt(b))
          .slice(0, 5);

        return {
          xAxisData: years,
          seriesData: years.map((year) => yearlyRevenue[year] || 0),
          title: "Doanh thu theo năm (5 năm gần đây)",
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
      case "year": {
        // Lấy 5 năm gần đây nhất theo thứ tự tăng dần (từ cũ đến mới)
        const years = Object.keys(yearlyPatients)
          .sort((a, b) => parseInt(a) - parseInt(b))
          .slice(0, 5);

        return {
          xAxisData: years,
          seriesData: years.map((year) => yearlyPatients[year] || 0),
          title: "Số bệnh nhân theo năm (5 năm gần đây)",
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
        <Grid item xs={12} sm={6} md={4}>
          <Card
            sx={{ height: "100%", bgcolor: "primary.light", color: "white" }}
          >
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <AttachMoneyIcon sx={{ fontSize: 40, mr: 1 }} />
                <Typography variant="h5" component="div">
                  Doanh Thu Năm Nay
                </Typography>
              </Box>
              <Typography variant="h3" fontWeight="bold">
                {formatCurrency(yearComparison.revenue.current)}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1, opacity: 0.8 }}>
                Năm {new Date().getFullYear()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Thẻ Tổng Số Bệnh Nhân */}
        <Grid item xs={12} sm={6} md={4}>
          <Card
            sx={{ height: "100%", bgcolor: "success.light", color: "white" }}
          >
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <PeopleIcon sx={{ fontSize: 40, mr: 1 }} />
                <Typography variant="h5" component="div">
                  Bệnh Nhân Năm Nay
                </Typography>
              </Box>
              <Typography variant="h3" fontWeight="bold">
                {formatPatientCount(yearComparison.patients.current)}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1, opacity: 0.8 }}>
                Năm {new Date().getFullYear()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Thẻ Tổng Số Bác Sĩ */}
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ height: "100%", bgcolor: "info.light", color: "white" }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <LocalHospitalIcon sx={{ fontSize: 40, mr: 1 }} />
                <Typography variant="h5" component="div">
                  Bác Sĩ
                </Typography>
              </Box>
              <Typography variant="h3" fontWeight="bold">
                {formatPatientCount(totalDoctors)}
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
          <ToggleButton value="year" aria-label="year view">
            Năm
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
                    highlightScope: {
                      highlight: "item",
                    },
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
                sx={{ cursor: "pointer" }}
                // Xử lý tất cả các sự kiện nhấp có thể để đảm bảo trải nghiệm người dùng tốt hơn
                onAxisClick={(event, d) => {
                  console.log("Nhấp vào trục:", d);
                  if (d && d.dataIndex !== undefined) {
                    handleChartItemClick(d.axisValue);
                  }
                }}
                // onLineClick={(event, d) => {
                //   console.log("Nhấp vào đường:", d);
                //   if (d && d.dataIndex !== undefined) {
                //     handleChartItemClick(d.dataIndex);
                //   }
                // }}
                onMarkClick={(event, d) => {
                  console.log("Nhấp vào điểm đánh dấu:", d);
                  if (d && d.dataIndex !== undefined) {
                    handleChartItemClick(d.axisValue);
                  }
                }}
                // onAreaClick={(event, d) => {
                //   console.log("Nhấp vào vùng:", d);
                //   if (d && d.dataIndex !== undefined) {
                //     handleChartItemClick(d.dataIndex);
                //   }
                // }}
              />
              <Typography variant="body2" textAlign="center" sx={{ mt: 1 }}>
                Nhấn vào biểu đồ để xem chi tiết doanh thu theo bác sĩ
              </Typography>
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
    </Container>
  );
};

export default AdminDashboardPage;
