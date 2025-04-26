import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
  Rating,
  Avatar,
  CircularProgress,
  Divider,
  Paper,
  Alert,
  Pagination,
  TablePagination,
  Stack,
} from "@mui/material";
import { useTranslation } from "react-i18next";
// import { getDoctorsBySpecialty } from "../../services/doctor_service";
import MedicationIcon from "@mui/icons-material/Medication";
import { getAllDoctorByTypeDiseaseName } from "../../services/authenticate/typeDisease_service.ts";

/**
 * Props cho component DoctorList
 * @param specialty - Loại dịch vụ/chuyên khoa được chọn
 * @param onSelect - Hàm callback khi người dùng chọn một bác sĩ
 * @param onBack - Hàm callback khi người dùng quay lại bước trước
 */
interface DoctorListProps {
  specialty: any; // Now represents a service
  onSelect: (doctor: any) => void;
  // onBack: () => void;
}

// Dữ liệu mẫu cho danh sách bác sĩ theo chuyên khoa
const mockDoctorsBySpecialty = {
  "1": [
    // Cardiology
    {
      id: "101",
      userId: "d101",
      firstName: "John",
      lastName: "Smith",
      specialization: "Cardiology",
      experience: 12,
      rating: 4.8,
      reviews: 124,
      image:
        "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=1470&auto=format&fit=crop",
    },
    {
      id: "102",
      userId: "d102",
      firstName: "Sarah",
      lastName: "Johnson",
      specialization: "Cardiology",
      experience: 9,
      rating: 4.6,
      reviews: 98,
      image:
        "https://images.unsplash.com/photo-1594824476967-48c8b964273f?q=80&w=1470&auto=format&fit=crop",
    },
  ],
  "2": [
    // Dermatology
    {
      id: "201",
      userId: "d201",
      firstName: "Michael",
      lastName: "Brown",
      specialization: "Dermatology",
      experience: 15,
      rating: 4.9,
      reviews: 152,
      image:
        "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=1528&auto=format&fit=crop",
    },
  ],
  "3": [
    // Neurology
    {
      id: "301",
      userId: "d301",
      firstName: "Jessica",
      lastName: "Williams",
      specialization: "Neurology",
      experience: 11,
      rating: 4.7,
      reviews: 134,
      image:
        "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=1470&auto=format&fit=crop",
    },
    {
      id: "302",
      userId: "d302",
      firstName: "David",
      lastName: "Miller",
      specialization: "Neurology",
      experience: 8,
      rating: 4.5,
      reviews: 89,
      image:
        "https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=1470&auto=format&fit=crop",
    },
  ],
  "4": [
    // Orthopedics
    {
      id: "401",
      userId: "d401",
      firstName: "Robert",
      lastName: "Davis",
      specialization: "Orthopedics",
      experience: 14,
      rating: 4.8,
      reviews: 142,
      image:
        "https://images.unsplash.com/photo-1622902046580-2b47f47f5471?q=80&w=1374&auto=format&fit=crop",
    },
  ],
  "5": [
    // Pediatrics
    {
      id: "501",
      userId: "d501",
      firstName: "Jennifer",
      lastName: "Taylor",
      specialization: "Pediatrics",
      experience: 10,
      rating: 4.9,
      reviews: 168,
      image:
        "https://images.unsplash.com/photo-1651008376811-b90baee60c1f?q=80&w=1374&auto=format&fit=crop",
    },
    {
      id: "502",
      userId: "d502",
      firstName: "William",
      lastName: "Anderson",
      specialization: "Pediatrics",
      experience: 7,
      rating: 4.6,
      reviews: 92,
      image:
        "https://images.unsplash.com/photo-1612531386530-97286d97c2d2?q=80&w=1470&auto=format&fit=crop",
    },
  ],
  "6": [
    // Psychiatry
    {
      id: "601",
      userId: "d601",
      firstName: "Karen",
      lastName: "Martinez",
      specialization: "Psychiatry",
      experience: 13,
      rating: 4.7,
      reviews: 115,
      image:
        "https://images.unsplash.com/photo-1527613426441-4da17471b66d?q=80&w=1470&auto=format&fit=crop",
    },
  ],
};

/**
 * Component hiển thị danh sách bác sĩ theo chuyên khoa được chọn
 * Cho phép người dùng chọn bác sĩ để đặt lịch khám
 * Hỗ trợ phân trang để hiển thị danh sách dài
 */
const DoctorList: React.FC<DoctorListProps> = ({
  specialty, // Now represents a service
  onSelect,
  // onBack,
}) => {
  const { t } = useTranslation();
  // State lưu trạng thái đang tải dữ liệu
  const [loading, setLoading] = useState(true);
  // State lưu danh sách bác sĩ
  const [doctors, setDoctors] = useState<any[]>([]);
  // State lưu thông báo lỗi nếu có
  const [error, setError] = useState<string | null>(null);

  // State cho phân trang
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(4);

  /**
   * Gọi API để lấy danh sách bác sĩ theo chuyên khoa khi component mount
   * hoặc khi chuyên khoa được chọn thay đổi
   */
  useEffect(() => {
    const fetchDoctorsByService = async () => {
      try {
        setLoading(true);
        setError(null);

        // Gọi API lấy danh sách bác sĩ theo tên loại bệnh/dịch vụ
        const result = await getAllDoctorByTypeDiseaseName(specialty.name)
          .then((response) => response.data.data)
          .catch((error) => {
            console.log(error);
            return null;
          });

        // Cập nhật state với dữ liệu nhận được từ API
        setDoctors(result);
      } catch (err) {
        console.error("Failed to fetch doctors by service:", err);
        setError("Failed to load available doctors. Please try again.");
        setDoctors([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorsByService();
    // Reset về trang đầu tiên khi chuyên khoa thay đổi
    setPage(0);
  }, [specialty]);

  /**
   * Xử lý khi người dùng chuyển trang
   * @param event - Sự kiện click
   * @param newPage - Số trang mới
   */
  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  /**
   * Xử lý khi người dùng thay đổi số lượng bác sĩ hiển thị trên mỗi trang
   * @param event - Sự kiện thay đổi
   */
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Tính toán chỉ số bắt đầu và kết thúc cho phân trang
  const startIndex = page * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedDoctors = doctors.slice(startIndex, endIndex);

  return (
    <Box>
      {/* Tiêu đề trang */}
      <Typography variant="h6" gutterBottom>
        {t("patient.appointments.available_doctors")}
      </Typography>

      {/* Tên dịch vụ/chuyên khoa đã chọn */}
      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 3 }}>
        {specialty.name}
      </Typography>

      {/* Hiển thị trạng thái loading, lỗi, hoặc danh sách bác sĩ */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error" sx={{ textAlign: "center", my: 4 }}>
          {error}
        </Typography>
      ) : (
        <>
          {doctors.length === 0 ? (
            <Paper
              elevation={1}
              sx={{
                my: 4,
                p: 3,
                textAlign: "center",
                backgroundColor: "rgba(0, 0, 0, 0.02)",
              }}
            >
              <MedicationIcon
                sx={{ fontSize: 60, color: "text.secondary", mb: 2 }}
              />
              <Typography variant="h6" color="text.secondary">
                {t("patient.appointments.no_doctors_available")}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {t("patient.appointments.try_different_service")}
              </Typography>
              {/* <Button variant="outlined" onClick={onBack} sx={{ mt: 2 }}>
                {t("patient.appointments.select_different_service")}
              </Button> */}
            </Paper>
          ) : (
            <>
              {/* Danh sách bác sĩ */}
              <Grid container spacing={3}>
                {paginatedDoctors.map((doctor, index) => (
                  <Grid
                    item
                    xs={12}
                    md={6}
                    key={doctor.id || `doctor-${index}`}
                  >
                    <Card sx={{ height: "100%" }}>
                      <Box sx={{ display: "flex", p: 2 }}>
                        <Avatar
                          sx={{ width: 80, height: 80 }}
                          src={
                            doctor.avatar ||
                            "https://picsum.photos/120/120?random=1"
                          }
                          alt={
                            doctor.firstName + " " + doctor.lastName || "Doctor"
                          }
                        />
                        <Box sx={{ ml: 2, flex: 1 }}>
                          <Typography component="div" variant="h6">
                            {doctor.firstName + " " + doctor.lastName ||
                              "Unknown Doctor"}
                          </Typography>
                          {doctor.specialization && (
                            <Chip
                              label={doctor.specialization}
                              size="small"
                              color="primary"
                              sx={{ mt: 1 }}
                            />
                          )}
                        </Box>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "flex-end",
                          p: 2,
                          pt: 0,
                        }}
                      >
                        <Button
                          size="small"
                          onClick={() => onSelect(doctor)}
                          variant="contained"
                        >
                          {t("patient.appointments.select")}
                        </Button>
                      </Box>
                    </Card>
                  </Grid>
                ))}
              </Grid>

              {/* Điều khiển phân trang */}
              <Box
                sx={{ display: "flex", justifyContent: "center", mt: 3, mb: 2 }}
              >
                <Stack spacing={2}>
                  <Pagination
                    count={Math.ceil(doctors.length / rowsPerPage)}
                    page={page + 1}
                    onChange={(e, value) => setPage(value - 1)}
                    color="primary"
                  />
                </Stack>
              </Box>
            </>
          )}
        </>
      )}

      {/* Nút quay lại */}
      {/* <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
        <Button onClick={onBack}>{t("common.back")}</Button>
      </Box> */}
    </Box>
  );
};

export default DoctorList;
