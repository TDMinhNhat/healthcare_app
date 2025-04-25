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
import {
  getListDoctorByQuarter,
  getListDoctorByMonth,
  getListDoctorByYear,
} from "../../services/appointment/dashboard_service";

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

        let response;
        console.log("period", period);

        // Gọi API phù hợp dựa trên loại thời gian
        if (periodType === "quarter" && period) {
          // Bỏ chữ "Q" khỏi chuỗi quý (ví dụ: "Q1" -> "1")
          const quarterNumber = period.replace("Q", "");
          response = await getListDoctorByQuarter(quarterNumber);
        } else if (periodType === "month" && period) {
          const monthNumber = period.replace("T", "");
          response = await getListDoctorByMonth(monthNumber);
        } else if (periodType === "year" && period) {
          response = await getListDoctorByYear(period);
        } else {
          throw new Error("Loại thời gian không hợp lệ");
        }
        console.log("API response:", response);
        if (response?.code === 200 && Array.isArray(response.data)) {
          // Chuyển đổi dữ liệu từ API sang định dạng phù hợp với giao diện
          const formattedData: DoctorRevenue[] = response.data.map(
            (item: any) => ({
              id: item.doctor.userId,
              doctorId: item.doctor.userId.toString(),
              doctorName: `${item.doctor.lastName} ${item.doctor.firstName}`,
              specialty:
                item.doctor.typeDisease?.name ||
                item.doctor.specialization ||
                "Không xác định",
              patientsCount: item.total_patients || 0,
              totalRevenue: item.total_salaries || 0,
            })
          );

          console.log("API data transformed:", formattedData);
          setDoctorRevenues(formattedData);
        } else {
          console.error("Invalid API response format:", response);
          throw new Error("Dữ liệu không hợp lệ");
        }
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu doanh thu bác sĩ:", err);
        setError(
          `Không thể tải dữ liệu doanh thu bác sĩ: ${
            err instanceof Error ? err.message : "Lỗi không xác định"
          }`
        );
      } finally {
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
    {
      field: "doctorId",
      headerName: "Mã bác sĩ",
      flex: 1.5,
      minWidth: 180,
      resizable: true,
    },
    {
      field: "doctorName",
      headerName: "Tên bác sĩ",
      flex: 2,
      minWidth: 200,
      resizable: true,
    },
    {
      field: "specialty",
      headerName: "Chuyên khoa",
      flex: 1.5,
      minWidth: 150,
      resizable: true,
    },
    {
      field: "patientsCount",
      headerName: "Số lượng bệnh nhân",
      type: "number",
      flex: 1,
      minWidth: 120,
      resizable: true,
    },
    {
      field: "totalRevenue",
      headerName: "Tổng doanh thu",
      type: "number",
      flex: 1.5,
      minWidth: 150,
      resizable: true,
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
          autoHeight
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
