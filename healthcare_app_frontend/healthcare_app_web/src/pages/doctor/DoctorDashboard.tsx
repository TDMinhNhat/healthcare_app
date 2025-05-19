import React, { useState, useEffect } from "react";
import {
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Box,
  Stack,
  ToggleButtonGroup,
  ToggleButton,
  CircularProgress,
  Alert,
} from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import { getDoctorDashboard } from "../../services/appointment/dashboard_service";
import { useSelector } from "react-redux";

interface DoctorDashboardResponse {
  data: {
    total_patient_done: number;
    charts: {
      monthly: Record<string, number>;
      yearly: Record<string, number>;
    };
    total_patient_today: number;
  };
}

const DoctorDashboard: React.FC = () => {
  const user = useSelector((state: any) => state.user.user);

  // State to track the selected time period view
  const [timeView, setTimeView] = useState<"month" | "year">("month");

  // State for dashboard data
  const [todayAppointments, setTodayAppointments] = useState(0);
  const [totalPatients, setTotalPatients] = useState(0);
  const [monthlyData, setMonthlyData] = useState<Record<string, number>>({});
  const [yearlyData, setYearlyData] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch dashboard data from API
  useEffect(() => {
    const fetchDashboardData = async () => {
      // Check if user exists and has userId
      if (!user?.userId) {
        setError("Không tìm thấy thông tin người dùng");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        console.log("Fetching doctor dashboard data for userId:", user.userId);

        const response = await getDoctorDashboard(user.userId);
        const dashboardData: DoctorDashboardResponse = response;
        console.log("Doctor dashboard data:", dashboardData.data);
        // Update states with API data
        setTotalPatients(dashboardData.data.total_patient_done);
        setTodayAppointments(dashboardData.data.total_patient_today);
        setMonthlyData(dashboardData.data.charts.monthly);
        setYearlyData(dashboardData.data.charts.yearly);
        setError(null);
      } catch (err) {
        console.error("Error fetching doctor dashboard data:", err);
        setError("Không thể tải dữ liệu bảng điều khiển");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  // Xử lý thay đổi chế độ xem thời gian
  const handleTimeViewChange = (
    event: React.MouseEvent<HTMLElement>,
    newTimeView: "month" | "year" | null
  ) => {
    if (newTimeView !== null) {
      setTimeView(newTimeView);
    }
  };

  // Get chart data based on selected time view
  const getChartConfig = () => {
    switch (timeView) {
      case "month": {
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
        // Tạo mảng tháng từ 1 đến 12
        // ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"]
        const months = Array.from({ length: 12 }, (_, i) => String(i + 1));

        return {
          xAxisData: monthNames,
          seriesData: months.map((month) => monthlyData[month] || 0),
          title: "Số bệnh nhân khám trong năm (theo tháng)",
        };
      }

      case "year": {
        // Get years from API data and sort them
        const yearKeys = Object.keys(yearlyData).sort();

        return {
          xAxisData: yearKeys,
          seriesData: yearKeys.map((year) => yearlyData[year] || 0),
          title: "Số bệnh nhân khám theo các năm",
        };
      }

      default:
        return { xAxisData: [], seriesData: [], title: "" };
    }
  };

  const chartConfig = getChartConfig();

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <>
      <Grid container spacing={3}>
        {/* Thẻ hiển thị số bệnh nhân hôm nay */}
        <Grid item xs={12} sm={6} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="div">
                Số bệnh nhân hôm nay
              </Typography>
              <Typography variant="h3">{todayAppointments}</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Thẻ hiển thị tổng bệnh nhân đã khám */}
        <Grid item xs={12} sm={6} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="div">
                Tổng bệnh nhân đã khám
              </Typography>
              <Typography variant="h3">{totalPatients}</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Biểu đồ số lượng bệnh nhân khám */}
        <Grid item xs={12} md={12}>
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
                <BarChart
                  xAxis={[
                    {
                      scaleType: "band",
                      data: chartConfig.xAxisData,
                      tickLabelStyle: {
                        fontSize: 12,
                        fontWeight: 600,
                      },
                    },
                  ]}
                  series={[
                    {
                      data: chartConfig.seriesData,
                      label: "Số bệnh nhân",
                    },
                  ]}
                  colors={["#2196f3"]}
                  height={320}
                  width={600}
                  yAxis={[
                    {
                      // label: "Số bệnh nhân khám",
                    },
                  ]}
                  margin={{ left: timeView === "year" ? 120 : 80 }}
                  tooltip={{ trigger: "item" }}
                />
              </Box>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};

export default DoctorDashboard;
