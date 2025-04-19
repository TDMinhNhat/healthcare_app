import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Paper,
  Box,
  CircularProgress,
  Alert,
  Button,
} from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridToolbar,
  GridCsvExportOptions,
} from "@mui/x-data-grid";
import { useParams, useNavigate } from "react-router";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

// Giao diện cho dữ liệu doanh thu của bác sĩ
interface DoctorRevenue {
  id: string;
  doctorId: string;
  doctorName: string;
  specialty: string;
  patientsCount: number;
  totalRevenue: number;
}

const DoctorRevenueDetailsPage: React.FC = () => {
  const { periodType, period } = useParams<{
    periodType: string;
    period: string;
  }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [doctorRevenues, setDoctorRevenues] = useState<DoctorRevenue[]>([]);

  useEffect(() => {
    const fetchDoctorRevenues = async () => {
      try {
        setLoading(true);
        // giả lập
        setTimeout(() => {
          const mockData: DoctorRevenue[] = Array.from(
            { length: 15 },
            (_, i) => ({
              id: `doc-${i + 1}`,
              doctorId: `D${1000 + i}`,
              doctorName: `Bác sĩ Nguyễn Văn ${String.fromCharCode(65 + i)}`,
              specialty: [
                "Nhi khoa",
                "Tim mạch",
                "Da liễu",
                "Nội tổng hợp",
                "Thần kinh",
              ][i % 5],
              patientsCount: Math.floor(Math.random() * 50) + 10,
              // Đảm bảo giá trị là số nguyên hợp lệ
              totalRevenue: Math.round(
                (Math.floor(Math.random() * 50) + 10) * 1000000
              ),
            })
          );

          // Kiểm tra dữ liệu trước khi cập nhật state
          console.log("Mock data created:", mockData);
          setDoctorRevenues(mockData);
          setLoading(false);
        }, 1000);
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu doanh thu bác sĩ:", err);
        setError("Không thể tải dữ liệu doanh thu bác sĩ");
        setLoading(false);
      }
    };

    if (periodType && period) {
      fetchDoctorRevenues();
    } else {
      setError("Thông tin thời gian không hợp lệ");
      setLoading(false);
    }
  }, [periodType, period]);

  // Định dạng tiền tệ
  const formatCurrency = (amount: number): string => {
    // Kiểm tra giá trị hợp lệ trước khi định dạng
    if (typeof amount !== "number" || isNaN(amount)) {
      return "0 ₫";
    }
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Cấu hình tùy chọn xuất CSV
  const csvOptions: GridCsvExportOptions = {
    fileName: `doanh-thu-bac-si-${periodType}-${period}-${new Date().getFullYear()}`,
    delimiter: ",",
    utf8WithBom: true,
  };

  // Cấu hình cột cho bảng dữ liệu
  const columns: GridColDef[] = [
    { field: "doctorId", headerName: "Mã bác sĩ", width: 120 },
    { field: "doctorName", headerName: "Tên bác sĩ", width: 250 },
    { field: "specialty", headerName: "Chuyên khoa", width: 150 },
    {
      field: "patientsCount",
      headerName: "Số lượng bệnh nhân",
      type: "number",
      width: 180,
    },
    {
      field: "totalRevenue",
      headerName: "Tổng doanh thu",
      type: "number",
      width: 200,
      valueFormatter: (value) => {
        // Đảm bảo params.value là một số hợp lệ
        const total = typeof value === "number" ? value : 0;
        return formatCurrency(total);
      },
    },
  ];

  // Định dạng tiêu đề thời kỳ
  const getPeriodTitle = () => {
    if (periodType === "quarter") {
      return `Quý ${period?.replace("Q", "")}`;
    } else if (periodType === "month") {
      return `Tháng ${period}`;
    }
    return "";
  };

  // Xử lý khi nhấn nút quay lại
  const handleBackClick = () => {
    navigate("/admin/dashboard");
  };

  // Hiển thị trạng thái đang tải
  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  // Hiển thị thông báo lỗi nếu có
  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleBackClick}
          sx={{ mr: 2 }}
        >
          Quay lại
        </Button>
        <Typography variant="h4" fontWeight="bold">
          Doanh thu theo bác sĩ - {getPeriodTitle()} năm{" "}
          {new Date().getFullYear()}
        </Typography>
      </Box>

      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <DataGrid
          rows={doctorRevenues}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 10 },
            },
            sorting: {
              sortModel: [{ field: "totalRevenue", sort: "desc" }],
            },
          }}
          pageSizeOptions={[5, 10, 25]}
          checkboxSelection={false}
          disableRowSelectionOnClick
          sx={{ minHeight: 400 }}
          // Thêm thanh công cụ và tùy chọn xuất dữ liệu
          slots={{ toolbar: GridToolbar }}
          slotProps={{
            toolbar: {
              showQuickFilter: true,
              quickFilterProps: { debounceMs: 500 },
              csvOptions: csvOptions,
              printOptions: {
                disableToolbarButton: false,
                hideFooter: false,
              },
            },
          }}
        />
      </Paper>
    </Container>
  );
};

export default DoctorRevenueDetailsPage;
