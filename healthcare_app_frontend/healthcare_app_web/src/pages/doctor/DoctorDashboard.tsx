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
} from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";

const DoctorDashboard: React.FC = () => {
  // State to track the selected time period view
  const [timeView, setTimeView] = useState<"week" | "month" | "year">("week");

  // State để lưu số lịch hẹn hôm nay
  const [todayAppointments, setTodayAppointments] = useState(0);

  // State để lưu dữ liệu từ API
  const [weeklyPatientVisits, setWeeklyPatientVisits] = useState({
    monday: 0,
    tuesday: 0,
    wednesday: 0,
    thursday: 0,
    friday: 0,
    saturday: 0,
    sunday: 0,
  });

  const [monthlyPatientVisits, setMonthlyPatientVisits] = useState({
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

  // Tính toán 5 năm gần nhất để hiển thị thống kê linh hoạt
  const currentYear = new Date().getFullYear();
  const initialYearlyData = Object.fromEntries(
    Array(5)
      .fill(0)
      .map((_, i) => [`${currentYear - 4 + i}`, 0])
  );

  const [yearlyPatientVisits, setYearlyPatientVisits] =
    useState(initialYearlyData);

  const [totalPatients, setTotalPatients] = useState(0);

  // Giả lập gọi API để lấy dữ liệu
  useEffect(() => {
    // Hàm giả lập gọi API lấy dữ liệu theo tuần
    const fetchWeeklyData = () => {
      // Giả lập thời gian trễ của mạng
      setTimeout(() => {
        // Dữ liệu mẫu - trong thực tế sẽ được trả về từ API
        const mockData = {
          monday: 12,
          tuesday: 15,
          wednesday: 9,
          thursday: 18,
          friday: 14,
          saturday: 22,
          sunday: 5,
        };
        setWeeklyPatientVisits(mockData);
      }, 500);
    };

    // Hàm giả lập gọi API lấy dữ liệu theo tháng
    const fetchMonthlyData = () => {
      setTimeout(() => {
        // Dữ liệu mẫu - trong thực tế sẽ được trả về từ API
        const mockData = {
          jan: 115,
          feb: 130,
          mar: 142,
          apr: 125,
          may: 133,
          jun: 141,
          jul: 128,
          aug: 134,
          sep: 138,
          oct: 142,
          nov: 132,
          dec: 145,
        };
        setMonthlyPatientVisits(mockData);
      }, 700);
    };

    // Hàm giả lập gọi API lấy dữ liệu theo năm
    const fetchYearlyData = () => {
      setTimeout(() => {
        // Tạo dữ liệu mẫu dựa trên 5 năm gần nhất
        // 2021 : 1000,
        // 2022 : 1200,
        // 2023 : 1500,
        // 2024 : 1700,
        // 2025 : 2000,
        const mockData = {};
        for (let i = 0; i < 5; i++) {
          const year = `${currentYear - 4 + i}`;
          // Giả lập số lượng bệnh nhân từ 1000-2000
          mockData[year] = 1000 + Math.floor(Math.random() * 1000);
        }
        setYearlyPatientVisits(mockData);
      }, 900);
    };

    // Hàm giả lập gọi API lấy tổng số bệnh nhân
    const fetchTotalPatients = () => {
      setTimeout(() => {
        // Dữ liệu mẫu - trong thực tế sẽ được trả về từ API
        setTotalPatients(120);
      }, 600);
    };

    // Hàm giả lập gọi API lấy số lịch hẹn hôm nay
    const fetchTodayAppointments = () => {
      setTimeout(() => {
        // Dữ liệu mẫu - trong thực tế sẽ được trả về từ API
        setTodayAppointments(8);
      }, 400);
    };

    // Gọi các hàm giả lập API
    fetchWeeklyData();
    fetchMonthlyData();
    fetchYearlyData();
    fetchTotalPatients();
    fetchTodayAppointments();

    // Trong thực tế, bạn có thể sử dụng axios hoặc fetch như sau:
    /*
    const fetchData = async () => {
      try {
        const response = await axios.get('https://api.example.com/patient-visits/weekly');
        setWeeklyPatientVisits(response.data);
        
        // Các API call khác tương tự...
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
      }
    };
    
    fetchData();
    */
  }, []); // Mảng dependencies rỗng để chỉ gọi API một lần khi component mount

  // Xử lý thay đổi chế độ xem thời gian
  const handleTimeViewChange = (
    event: React.MouseEvent<HTMLElement>,
    newTimeView: "week" | "month" | "year" | null
  ) => {
    if (newTimeView !== null) {
      setTimeView(newTimeView);
    }
  };

  // Get chart data based on selected time view
  const getChartConfig = () => {
    switch (timeView) {
      case "week":
        return {
          xAxisData: [
            "Thứ 2",
            "Thứ 3",
            "Thứ 4",
            "Thứ 5",
            "Thứ 6",
            "Thứ 7",
            "Chủ nhật",
          ],
          seriesData: [
            weeklyPatientVisits.monday,
            weeklyPatientVisits.tuesday,
            weeklyPatientVisits.wednesday,
            weeklyPatientVisits.thursday,
            weeklyPatientVisits.friday,
            weeklyPatientVisits.saturday,
            weeklyPatientVisits.sunday,
          ],
          title: "Số bệnh nhân khám trong tuần",
        };
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
            monthlyPatientVisits.jan,
            monthlyPatientVisits.feb,
            monthlyPatientVisits.mar,
            monthlyPatientVisits.apr,
            monthlyPatientVisits.may,
            monthlyPatientVisits.jun,
            monthlyPatientVisits.jul,
            monthlyPatientVisits.aug,
            monthlyPatientVisits.sep,
            monthlyPatientVisits.oct,
            monthlyPatientVisits.nov,
            monthlyPatientVisits.dec,
          ],
          title: "Số bệnh nhân khám trong năm (theo tháng)",
        };
      case "year":
        // Lấy danh sách các năm và sắp xếp theo thứ tự tăng dần
        const yearKeys = Object.keys(yearlyPatientVisits).sort();
        return {
          xAxisData: yearKeys,
          seriesData: yearKeys.map((year) => yearlyPatientVisits[year]),
          title: "Số bệnh nhân khám theo 5 năm gần nhất",
        };
      default:
        return { xAxisData: [], seriesData: [], title: "" };
    }
  };

  const chartConfig = getChartConfig();

  return (
    <>
      <Grid container spacing={3}>
        {/* Thẻ hiển thị số lịch hẹn hôm nay */}
        <Grid item xs={12} sm={6} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="div">
                Lịch hẹn hôm nay
              </Typography>
              <Typography variant="h3">{todayAppointments}</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Thẻ hiển thị tổng số bệnh nhân */}
        <Grid item xs={12} sm={6} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="div">
                Tổng số bệnh nhân
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
                <ToggleButton value="week" aria-label="week view">
                  Tuần
                </ToggleButton>
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
