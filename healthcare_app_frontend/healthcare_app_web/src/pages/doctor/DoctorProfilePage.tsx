// Import các thư viện React và các component cần thiết
import React, { useState, useEffect } from "react";
import { Container, Grid, Box, IconButton, Alert } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import LockIcon from "@mui/icons-material/Lock";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router";
// Import các component cho phần thông tin cá nhân và chuyên môn của bác sĩ
import { PersonalInfoSection } from "../../components/profile/PersonalInfoSection";
import { DoctorExperienceSection } from "../../components/doctor/DoctorExperienceSection";
import { DoctorEducationSection } from "../../components/doctor/DoctorEducationSection";
import { DoctorCertificatesSection } from "../../components/doctor/DoctorCertificatesSection";
import { EditProfileModal } from "../../components/profile/EditProfileModal";
import AvatarUploadModal from "../../components/profile/AvatarUploadModal";
// Import types và services
import { Doctor } from "../../types/doctor";
import { Diploma } from "../../types";
import { useSelector, useDispatch } from "react-redux";
import {
  getDoctorInfo,
  updateDoctorAvatar,
} from "../../services/authenticate/user_service";
import { setUser } from "../../stores/slices/user.slice";
import { ROUTING } from "../../constants/routing";

// Dữ liệu mẫu - thông thường sẽ lấy từ API
const mockDoctorData: any = {
  id: 1,
  userId: "dr123",
  firstName: "John",
  lastName: "Smith",
  sex: true,
  dob: "1980-05-15",
  address: {
    id: 1,
    number: "123",
    street: "Medical Street",
    ward: "Healthcare",
    district: "Central",
    city: "Metropolis",
    country: "USA",
  },
  phone: "+1234567890",
  avatar: "https://randomuser.me/api/portraits/men/41.jpg",
  email: "john.smith@healthcare.com",
  emailVerify: true,
  status: true,
  specialization: "Cardiologist",
  experience: {
    id: 1,
    compName: "Metro Hospital",
    specialization: "Cardiology",
    startDate: "2015-01-01",
    endDate: "",
    compAddress: {
      city: "Metropolis",
      country: "USA",
      id: 2,
      number: "123",
      street: "Hospital Street",
      ward: "Healthcare",
      district: "Central",
    },
    description:
      "Specialized in cardiovascular treatments and heart surgeries.",
  },
  educations: [
    {
      id: 1,
      schoolName: "Medical University",
      joinedDate: "2000-09-01",
      graduateDate: "2006-06-30",
      diploma: Diploma.BACHELOR,
      doctorId: 0,
    },
    {
      id: 2,
      schoolName: "Health Academy",
      joinedDate: "1996-09-01",
      graduateDate: "2000-05-30",
      diploma: Diploma.DOCTOR,
      doctorId: 0,
    },
  ],
  certificates: [
    {
      id: 1,
      certName: "Advanced Cardiovascular Life Support",
      issueDate: "2018-03-15",
      doctorId: 1,
      address: {
        city: "Metropolis",
        id: 3,
        number: "123",
        street: "Medical Street",
        ward: "Healthcare",
        district: "Central",
      },
    },
    {
      id: 2,
      certName: "Board Certification in Cardiology",
      issueDate: "2016-07-22",
      doctorId: 1,
      address: {
        city: "Metropolis",
        id: 4,
        number: "123",
        street: "Medical Street",
        ward: "Healthcare",
        district: "Central",
      },
    },
  ],
};

// Component trang hồ sơ bác sĩ
const DoctorProfilePage: React.FC = () => {
  // Khai báo các state cần thiết
  const [doctorData, setDoctorData] = useState<any | null>(null); // Lưu thông tin bác sĩ
  const [loading, setLoading] = useState(true); // Trạng thái đang tải
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // Trạng thái hiển thị modal chỉnh sửa
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false); // Trạng thái hiển thị modal tải lên avatar
  const [avatarLoading, setAvatarLoading] = useState(false); // Trạng thái đang tải khi cập nhật avatar
  const [avatarError, setAvatarError] = useState<string | null>(null); // Lỗi khi cập nhật avatar
  const [error, setError] = useState<string | null>(null); // Lưu thông báo lỗi nếu có
  const user = useSelector((state: any) => state.user.user); // Lấy thông tin người dùng từ Redux
  const dispatch = useDispatch(); // Hook để gửi action đến Redux
  const navigate = useNavigate(); // Hook chuyển trang

  useEffect(() => {
    // Hàm lấy dữ liệu bác sĩ từ API
    const fetchDoctorData = async () => {
      setLoading(true);
      try {
        // Gọi API để lấy thông tin bác sĩ dựa vào userId
        const response = await getDoctorInfo(user.userId);
        if (response.data && response.data.code === 200) {
          console.log("Doctor data:", response.data.data.doctor.sex);
          setDoctorData(response.data.data);
        } else {
          setError("Failed to retrieve doctor data");
        }
      } catch (error) {
        console.error("Error fetching doctor data:", error);
        setError("Error loading doctor data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorData();
  }, [user?.userId]);
  console.log("Doctor data:", doctorData);

  // Hàm mở modal chỉnh sửa thông tin cá nhân
  const handleOpenEditModal = () => {
    setIsEditModalOpen(true);
  };

  // Hàm đóng modal chỉnh sửa thông tin cá nhân
  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
  };

  // Hàm mở modal tải lên avatar
  const handleOpenAvatarModal = () => {
    setIsAvatarModalOpen(true);
  };

  // Hàm đóng modal tải lên avatar
  const handleCloseAvatarModal = () => {
    setIsAvatarModalOpen(false);
  };

  // Hàm xử lý khi lưu thông tin cá nhân
  const handleSaveProfile = (updatedData: any) => {
    // Cập nhật state local để hiển thị ngay lập tức
    setDoctorData({ ...doctorData, ...updatedData });
    // Lưu ý: Không cần gọi API ở đây vì đã được thực hiện trong EditProfileModal
  };

  // Hàm xử lý khi lưu avatar mới
  const handleSaveAvatar = async (newAvatar: string) => {
    try {
      setAvatarLoading(true);
      setAvatarError(null);

      // Gọi API để cập nhật avatar bác sĩ
      const response = await updateDoctorAvatar(user.userId, {
        uri: newAvatar,
      });

      if (response?.data?.code === 200) {
        // Cập nhật state local với dữ liệu trả về từ API
        setDoctorData({
          ...doctorData,
          doctor: response.data.data, // Cập nhật thông tin doctor với dữ liệu mới
        });

        // Cập nhật Redux state với avatar mới
        const updatedUser = {
          ...user,
          avatar: response.data.data.avatar, // Avatar là trực tiếp trong data object, không phải trong doctor.avatar
        };
        dispatch(setUser(updatedUser));

        console.log(
          "Doctor avatar updated successfully:",
          response.data.data.avatar
        );
      } else {
        throw new Error("Failed to update doctor avatar");
      }
    } catch (error) {
      console.error("Error updating doctor avatar:", error);
      setAvatarError("Failed to update avatar. Please try again.");
    } finally {
      setAvatarLoading(false);
    }
  };

  // Hiển thị trạng thái đang tải
  if (loading) {
    return <div>Đang tải...</div>;
  }

  // Hiển thị thông báo lỗi nếu có
  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  // Hiển thị thông báo khi không có dữ liệu
  if (!doctorData) {
    return <Alert severity="info">Không có dữ liệu</Alert>;
  }

  // Render giao diện chính khi đã có dữ liệu
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={3}>
        {/* Phần thông tin cá nhân */}
        <Grid item xs={12}>
          <Box sx={{ position: "relative" }}>
            <PersonalInfoSection
              firstName={doctorData.doctor?.firstName || "Không có thông tin"}
              lastName={doctorData.doctor?.lastName || "Không có thông tin"}
              email={doctorData.doctor?.email || "Không có thông tin"}
              phone={doctorData.doctor?.phone || "Không có thông tin"}
              dob={doctorData.doctor?.dob || "Không có thông tin"}
              sex={doctorData.doctor?.sex ?? "Không có thông tin"}
              address={doctorData.doctor?.address || null}
              avatar={doctorData.doctor?.avatar || "/default-avatar.png"}
              onEditAvatar={handleOpenAvatarModal}
              hideEditButton={false} // Hiển thị nút chỉnh sửa
            />
            {/* Nút chỉnh sửa thông tin */}
            <IconButton
              color="primary"
              onClick={handleOpenEditModal}
              sx={{
                position: "absolute",
                top: "12px",
                right: "12px",
                bgcolor: "background.paper",
                "&:hover": {
                  bgcolor: "action.hover",
                },
                boxShadow: 1,
                zIndex: 1,
              }}
              aria-label="Chỉnh sửa"
              size="small"
            >
              <EditIcon />
            </IconButton>
            {/* Nút đổi mật khẩu */}
            <Button
              variant="outlined"
              startIcon={<LockIcon />}
              size="small"
              sx={{
                position: "absolute",
                top: "12px",
                right: "52px",
                zIndex: 1,
                bgcolor: "background.paper",
                boxShadow: 1,
                minWidth: 0,
                px: 1.5,
              }}
              onClick={() => navigate(ROUTING.CHANGE_PASSWORD)}
            >
              Đổi mật khẩu
            </Button>
          </Box>
        </Grid>
        {/* Phần thông tin kinh nghiệm */}
        <Grid item xs={12} md={6}>
          <DoctorExperienceSection
            experiences={doctorData.experiences || []}
            specialization={
              doctorData.doctor?.typeDisease?.name || "Không có thông tin"
            }
          />
        </Grid>
        {/* Phần thông tin học vấn và chứng chỉ */}
        <Grid item xs={12} md={6}>
          <DoctorEducationSection education={doctorData.educations || []} />
          <Box sx={{ mt: 3 }}>
            <DoctorCertificatesSection
              certificates={doctorData.certificates || []}
            />
          </Box>
        </Grid>
      </Grid>

      {/* Modal chỉnh sửa thông tin cá nhân */}
      <EditProfileModal
        open={isEditModalOpen}
        onClose={handleCloseEditModal}
        onSave={handleSaveProfile}
        userData={{
          firstName: doctorData.doctor?.firstName || "",
          lastName: doctorData.doctor?.lastName || "",
          email: doctorData.doctor?.email || "",
          phone: doctorData.doctor?.phone || "",
          dob: doctorData.doctor?.dob || "",
          sex: doctorData.doctor?.sex,
          address: doctorData.doctor?.address || null,
        }}
      />

      {/* Modal tải lên avatar */}
      <AvatarUploadModal
        open={isAvatarModalOpen}
        currentAvatar={doctorData.doctor?.avatar || "/default-avatar.png"}
        onClose={handleCloseAvatarModal}
        onSave={handleSaveAvatar}
        isLoading={avatarLoading}
        error={avatarError}
      />
    </Container>
  );
};

export default DoctorProfilePage;
