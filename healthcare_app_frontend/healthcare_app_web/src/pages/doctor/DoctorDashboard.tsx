import React, { useState, useEffect } from "react";
import {
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Box,
  Stack,
} from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import { PieChart } from "@mui/x-charts/PieChart";

const DoctorDashboard: React.FC = () => {
  // Dữ liệu mẫu cho số lượng bệnh nhân khám trong tuần
  const weeklyPatientVisits = {
    monday: 12,
    tuesday: 15,
    wednesday: 9,
    thursday: 18,
    friday: 14,
    saturday: 22,
    sunday: 5,
  };

  // Dữ liệu mẫu về phân bố giới tính bệnh nhân - đã loại bỏ 'other'
  const patientsByGender = {
    male: 72,
    female: 48,
  };

  // Tổng số bệnh nhân được lấy từ server
  const totalPatients = 120; // Trong thực tế sẽ được lấy từ API

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
              <Typography variant="h3">8</Typography>
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

        {/* Biểu đồ số lượng bệnh nhân khám trong tuần */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Số bệnh nhân khám trong tuần
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
                <BarChart
                  xAxis={[
                    {
                      scaleType: "band", // Kiểu dữ liệu cho trục x dạng biểu đồ cột
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
                  series={[
                    {
                      data: [
                        weeklyPatientVisits.monday,
                        weeklyPatientVisits.tuesday,
                        weeklyPatientVisits.wednesday,
                        weeklyPatientVisits.thursday,
                        weeklyPatientVisits.saturday,
                        weeklyPatientVisits.sunday,
                      ],
                      label: "Số bệnh nhân", // Nhãn cho dữ liệu
                    },
                  ]}
                  colors={["#2196f3"]} // Màu xanh dương cho biểu đồ
                  height={320} // Chiều cao biểu đồ (pixel)
                  width={590} // Chiều rộng biểu đồ (pixel)
                  yAxis={[
                    {
                      label: "Số bệnh nhân khám", // Nhãn cho trục y
                    },
                  ]}
                  tooltip={{ trigger: "item" }} // Hiển thị tooltip khi di chuột qua từng cột
                />
              </Box>
            </Stack>
          </Paper>
        </Grid>

        {/* Biểu đồ phân bố bệnh nhân theo giới tính */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Tổng số bệnh nhân theo giới tính
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
                  Tổng số bệnh nhân: {totalPatients}
                </Typography>

                <PieChart
                  series={[
                    {
                      data: [
                        {
                          id: 0,
                          value: patientsByGender.male, // Số lượng bệnh nhân nam
                          label: "Nam",
                          color: "#2196f3", // Màu xanh dương đại diện cho nam
                        },
                        {
                          id: 1,
                          value: patientsByGender.female, // Số lượng bệnh nhân nữ
                          label: "Nữ",
                          color: "#e91e63", // Màu hồng đại diện cho nữ
                        },
                      ],
                      highlightScope: { faded: "global", highlighted: "item" }, // Cấu hình hiệu ứng khi di chuột
                      faded: {
                        innerRadius: 30, // Độ rỗng ở giữa hình tròn
                        additionalRadius: -30, // Thu nhỏ các phân đoạn bị mờ
                        color: "gray", // Màu khi mờ
                      },
                    },
                  ]}
                  height={300} // Chiều cao biểu đồ
                  width={500} // Chiều rộng biểu đồ
                  margin={{ top: 50, left: 50, right: 50 }} // Định vị lề cho biểu đồ
                  slotProps={{
                    legend: {
                      hidden: false, // Hiển thị chú thích
                      position: { vertical: "top", horizontal: "middle" }, // Vị trí chú thích
                      direction: "row", // Hướng chú thích
                    },
                  }}
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
