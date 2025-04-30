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
import DownloadIcon from "@mui/icons-material/Download";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import {
  getListDoctorByQuarter,
  getListDoctorByMonth,
  getListDoctorByYear,
} from "../../services/appointment/dashboard_service";
import { useSelector } from "react-redux";

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

  // Get user information from Redux store
  const user = useSelector((state: any) => state.user.user);

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
      return `QUÝ ${period?.replace("Q", "")}`;
    } else if (periodType === "month") {
      return `THÁNG ${period?.replace("T", "")}`;
    } else if (periodType === "year") {
      return `NĂM ${period}`;
    }
    return "";
  };

  // Xử lý khi nhấn nút quay lại
  const handleBackClick = () => {
    navigate("/admin/dashboard");
  };

  // Function to handle Excel export with template
  const handleExcelExport = async () => {
    try {
      console.log("Starting Excel export process");

      // Fetch the template file from public folder
      // console.log("Fetching template file");
      const response = await fetch("/template.xlsx");
      const templateArrayBuffer = await response.arrayBuffer();
      // console.log("Template file loaded successfully");

      // Load the template workbook with ExcelJS
      // console.log("Creating workbook from template");
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(templateArrayBuffer);
      // console.log("Workbook created successfully");

      // Get the first worksheet
      const worksheet = workbook.getWorksheet(1);
      // console.log("Worksheet accessed:", worksheet.name);

      // Add report details to the header sections
      // Thêm chi tiết giai đoạn báo cáo vào ô D2
      worksheet.getCell("D2").value = `${getPeriodTitle()}`;
      worksheet.getCell("D2").font = { bold: true, size: 16 }; // Đậm và font size 16

      // Thêm người lập báo cáo vào ô B3 (lấy từ Redux)
      const reporterName = user ? `${user.firstName} ${user.lastName}` : "N/A";
      worksheet.getCell("B3").value = reporterName;
      worksheet.getCell("B3").font = { size: 12 }; // Font size 12

      // Thêm ngày lập báo cáo vào ô B4
      const currentDate = new Date();
      const formattedDate = `${currentDate.getDate()}/${
        currentDate.getMonth() + 1
      }/${currentDate.getFullYear()}`;
      worksheet.getCell("B4").value = formattedDate;
      worksheet.getCell("B4").font = { size: 12 }; // Font size 12

      // // Add data starting from row 6
      // console.log("Adding data to worksheet");
      // console.log("length", doctorRevenues.length);
      doctorRevenues.forEach((doctor, index) => {
        // Chỉ insert row từ hàng thứ 2 trở đi
        if (index > 0) {
          worksheet.insertRow(index + 7, [], "i");
        }

        const row = worksheet.getRow(index + 7);

        // Thiết lập giá trị cho từng ô trong dòng
        row.getCell(1).value = index + 1; // STT
        row.getCell(2).value = doctor.doctorId; // Mã bác sĩ
        row.getCell(3).value = doctor.doctorName; // Tên bác sĩ
        row.getCell(4).value = doctor.specialty; // Chuyên khoa
        row.getCell(5).value = doctor.patientsCount; // Số lượng bệnh nhân
        row.getCell(6).value = doctor.totalRevenue; // Tổng doanh thu

        // Áp dụng các thay đổi cho dòng
        row.commit();
      });

      // Tính tổng doanh thu
      const totalRevenue = doctorRevenues.reduce(
        (sum, doctor) => sum + doctor.totalRevenue,
        0
      );

      // Thêm dòng tổng cộng bằng cách insert một row mới
      const summaryRowIndex = doctorRevenues.length + 6 + 1; // 6 là số dòng tiêu đề
      worksheet.insertRow(summaryRowIndex, [], "i");
      const summaryRow = worksheet.getRow(summaryRowIndex);
      summaryRow.getCell(5).value = "Tổng cộng:";
      summaryRow.getCell(6).value = totalRevenue;

      // Apply bold font to the summary row
      // summaryRow.font = { bold: true };
      summaryRow.commit();

      // Vị trí bắt đầu của phần chữ ký (thêm khoảng trống 3 dòng sau dòng tổng)
      const signatureRow = doctorRevenues.length + 6 + 3; // 6 là số dòng tiêu đề

      // Thêm ngày tháng năm
      const dateRow = worksheet.getRow(signatureRow);
      dateRow.getCell(5).value = `Ngày ... tháng ... năm ...`;
      dateRow.getCell(5).alignment = { horizontal: "center" };
      dateRow.getCell(5).font = { size: 12 }; // Tăng kích thước font
      dateRow.commit();

      // Thêm kế toán trưởng
      const accountantRow = worksheet.getRow(signatureRow + 1);
      accountantRow.getCell(5).value = "Kế toán trưởng";
      accountantRow.getCell(5).alignment = {
        horizontal: "center",
        vertical: "middle",
      };
      accountantRow.getCell(5).font = { bold: true, size: 14 }; // Tăng kích thước font và giữ đậm
      accountantRow.commit();

      // Thêm (ký, ghi rõ họ tên)
      const signatureInfoRow = worksheet.getRow(signatureRow + 2);
      signatureInfoRow.getCell(5).value = "(Ký, ghi rõ họ tên)";
      signatureInfoRow.getCell(5).alignment = { horizontal: "center" };
      signatureInfoRow.getCell(5).font = { italic: true };
      signatureInfoRow.commit();

      // Fallback to the buffer approach
      const buffer = await workbook.xlsx.writeBuffer();

      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      saveAs(blob, `doanh-thu-bac-si-${periodType}-${period}.xlsx`);
    } catch (error) {
      console.error("Error exporting Excel:", error);
      alert("Có lỗi xảy ra khi xuất file Excel. Vui lòng thử lại sau.");
    }
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
        <Box sx={{ flexGrow: 1 }} />
        <Button
          variant="contained"
          color="primary"
          startIcon={<DownloadIcon />}
          onClick={handleExcelExport}
          sx={{ ml: 2 }}
        >
          Xuất Excel
        </Button>
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
