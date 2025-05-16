import React, { useState, useEffect } from "react";
import {
  Typography,
  Paper,
  Grid,
  CircularProgress,
  Box,
  Card,
  CardContent,
  ToggleButtonGroup,
  ToggleButton,
  Alert,
  Container,
  SxProps,
} from "@mui/material";
import {
  AnimatedLine,
  AnimatedLineProps,
  LineChart,
} from "@mui/x-charts/LineChart";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import PeopleIcon from "@mui/icons-material/People";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { getDashboard } from "../../services/appointment/dashboard_service";
import { useChartId, useDrawingArea, useXScale } from "@mui/x-charts";

interface DashboardVisualize {
  salaries: {
    month: Record<string, number>;
    year: Record<string, number>;
    quarter: Record<string, number>;
  };
  // 3 năm tiếp theo (tính từ năm hiện tại)
  // Dữ liệu dự đoán doanh thu cho 3 năm tiếp theo
  salaries_prediction: Array<number>;
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
// interface để dự đoán doanh thu cho 3 năm tiếp theo
interface CustomAnimatedLineProps extends AnimatedLineProps {
  limit?: number;
  chartData?: string[];
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
  // State cho thông tin so sánh năm
  const [yearComparison, setYearComparison] = useState({
    revenue: { current: 0, previous: 0 },
    patients: { current: 0, previous: 0 },
  });
  // State cho dự đoán doanh thu
  const [salaryPredictions, setSalaryPredictions] = useState<number[]>([]);

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

        // Lưu dữ liệu dự đoán doanh thu
        if (dashboardData.visualize.salaries_prediction) {
          setSalaryPredictions(dashboardData.visualize.salaries_prediction);
        }

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

        // Tạo mảng dự đoán cho 3 năm tiếp theo
        const predictionYears = [];
        const lastYear =
          years.length > 0
            ? parseInt(years[years.length - 1])
            : new Date().getFullYear();

        for (let i = 1; i <= 3; i++) {
          predictionYears.push(String(lastYear + i));
        }

        // Kết hợp dữ liệu thực tế và dự đoán trong cùng một mảng
        const allYears = [...years, ...predictionYears];
        const combinedData = [
          ...years.map((year) => yearlyRevenue[year] || 0),
          ...Array.from({ length: 3 }, (_, i) => salaryPredictions[i] || 0),
        ];

        // Mảng để đánh dấu dữ liệu nào là dự đoán
        const isPrediction = [
          ...Array(years.length).fill(false),
          ...Array(predictionYears.length).fill(true),
        ];

        // For band scale, use the actual years length as the limit
        // This represents the index of the first prediction year
        const predictionLimit = years.length;

        return {
          xAxisData: allYears,
          seriesData: combinedData,
          isPrediction: isPrediction,
          predictionLimit: predictionLimit,
          title: "Doanh thu theo năm (năm gần đây + 3 năm dự đoán)",
          actualYearsCount: years.length,
        };
      }
      default:
        return {
          xAxisData: [],
          seriesData: [],
          isPrediction: [],
          title: "",
          actualYearsCount: 0,
        };
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

  // Component tùy chỉnh đường nét được định nghĩa trong component chính
  // để có thể truy cập dữ liệu revenueChartConfig
  // liimt là vị trí của đường chia giữa dữ liệu thực tế và dự đoán
  function CustomAnimatedLine(props: CustomAnimatedLineProps) {
    const { limit, ...other } = props;
    const { top, bottom, height, left, width } = useDrawingArea();
    const chartId = useChartId();

    if (limit === undefined) {
      return <AnimatedLine {...other} />;
    }

    // Lấy vị trí phần trăm cho đường chia dựa trên giá trị giới hạn
    const totalItems = revenueChartConfig.xAxisData.length;

    // Tính toán vị trí đường chia dựa trên chỉ mục giới hạn và tổng số mục
    const positionRatio = limit / totalItems;
    const dividerPosition = left + width * positionRatio;

    const clipIdleft = `${chartId}-${props.ownerState.id}-line-limit-${limit}-1`;
    const clipIdRight = `${chartId}-${props.ownerState.id}-line-limit-${limit}-2`;

    return (
      <React.Fragment>
        {/* Thêm đường dọc để đánh dấu rõ ràng điểm bắt đầu dự đoán */}
        {/* <line
          x1={dividerPosition}
          y1={top}
          x2={dividerPosition}
          y2={top + height}
          stroke="#888"
          strokeWidth={1}
          strokeDasharray="3,3"
        /> */}

        {/* Đường cắt cho phần dữ liệu thực tế */}
        <clipPath id={clipIdleft}>
          <rect
            x={left}
            y={0}
            width={dividerPosition - left}
            height={top + height + bottom}
          />
        </clipPath>

        {/* Đường cắt cho phần dữ liệu dự đoán */}
        {/*
          clip này sẽ cắt phần bên phải của biểu đồ, chỉ hiển thị phần bên trái
          của biểu đồ với dữ liệu thực tế. Điều này giúp tạo hiệu ứng đường nét đứt
         */}
        <clipPath id={clipIdRight}>
          <rect
            x={dividerPosition}
            y={0}
            width={left + width - dividerPosition}
            height={top + height + bottom}
          />
        </clipPath>

        {/* Hiển thị phần dữ liệu thực tế với đường liền */}
        <g clipPath={`url(#${clipIdleft})`} className="line-before">
          <AnimatedLine {...other} />
        </g>

        {/* Hiển thị phần dữ liệu dự đoán với đường nét đứt */}
        <g clipPath={`url(#${clipIdRight})`} className="line-after">
          <AnimatedLine
            {...other}
            strokeDasharray="5,5" // Áp dụng đường nét đứt trực tiếp tại đây
            strokeWidth={3} // Làm đường dự đoán dày hơn một chút
          />
        </g>
      </React.Fragment>
    );
  }

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
        <Grid item xs={12} sm={6} md={6}>
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
                    scaleType: "band", // Cần giữ lại để định vị đồ thị chính xác
                    data: revenueChartConfig.xAxisData,
                    tickLabelStyle: { fontSize: 12, fontWeight: 600 },
                  },
                ]}
                series={[
                  {
                    data: revenueChartConfig.seriesData,
                    label: "Doanh thu (VND)",
                    color: "#2196f3",
                    // Sử dụng itemProps để tùy chỉnh từng điểm dữ liệu
                    ...(timeView === "year" && {
                      valueFormatter: (value, context) => {
                        if (
                          context &&
                          revenueChartConfig.isPrediction &&
                          revenueChartConfig.isPrediction[context.dataIndex]
                        ) {
                          return `${formatCurrency(value)} (Dự đoán)`;
                        }
                        return formatCurrency(value);
                      },
                    }),
                  },
                ]}
                height={320}
                width={500}
                margin={{ left: 100, right: 20 }}
                tooltip={{
                  trigger: "item",
                  valueFormatter: (value) =>
                    value ? formatCurrency(value) : "Không có dữ liệu",
                }}
                slots={{
                  line: timeView === "year" ? CustomAnimatedLine : undefined,
                }}
                slotProps={{
                  legend: { hidden: false },
                  line:
                    timeView === "year"
                      ? { limit: revenueChartConfig.predictionLimit }
                      : undefined,
                }}
                sx={{
                  cursor: "pointer",
                }}
                // Xử lý sự kiện nhấp
                onAxisClick={(event, d) => {
                  console.log("Nhấp vào trục:", d);
                  if (
                    d &&
                    d.dataIndex !== undefined &&
                    timeView === "year" &&
                    d.dataIndex < revenueChartConfig.actualYearsCount
                  ) {
                    handleChartItemClick(d.axisValue);
                  } else if (
                    d &&
                    d.dataIndex !== undefined &&
                    timeView !== "year"
                  ) {
                    handleChartItemClick(d.axisValue);
                  }
                }}
                onMarkClick={(event, d) => {
                  console.log("Nhấp vào điểm đánh dấu:", d);
                  if (
                    d &&
                    d.dataIndex !== undefined &&
                    d.seriesId === "0" && // Chỉ áp dụng cho series thực tế (id 0)
                    timeView === "year" &&
                    d.dataIndex < revenueChartConfig.actualYearsCount
                  ) {
                    handleChartItemClick(d.axisValue);
                  } else if (
                    d &&
                    d.dataIndex !== undefined &&
                    d.seriesId === "0" &&
                    timeView !== "year"
                  ) {
                    handleChartItemClick(d.axisValue);
                  }
                }}
              />
              <Typography variant="body2" textAlign="center" sx={{ mt: 1 }}>
                Nhấn vào biểu đồ để xem chi tiết doanh thu theo bác sĩ
                {/* {timeView === "year" && (
                  <span
                    style={{
                      color: "#ff9800",
                      fontStyle: "italic",
                      display: "block",
                    }}
                  >
                    (Dữ liệu dự đoán 3 năm tiếp theo không có chi tiết doanh
                    thu)
                  </span>
                )} */}
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
