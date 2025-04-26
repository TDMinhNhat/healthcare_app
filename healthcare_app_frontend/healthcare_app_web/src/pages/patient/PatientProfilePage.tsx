// Import các thư viện React và các component UI
import React, { useState, useEffect } from "react";
import { Container, Grid, Box, IconButton, Alert } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import LockIcon from "@mui/icons-material/Lock";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router";
import CreditCardIcon from "@mui/icons-material/CreditCard"; // Import icon cho tài khoản ngân hàng

// Import các component dùng cho hồ sơ
import { PersonalInfoSection } from "../../components/profile/PersonalInfoSection";
import { EditProfileModal } from "../../components/profile/EditProfileModal";
import AvatarUploadModal from "../../components/profile/AvatarUploadModal";
// Import services và Redux hooks
import {
  getPatientInfo,
  updatePatientAvatar,
} from "../../services/authenticate/user_service";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../stores/slices/user.slice";
import { ROUTING } from "../../constants/routing";

// Component trang hồ sơ bệnh nhân
const PatientProfilePage: React.FC = () => {
  // Khai báo các state cần thiết
  const [patientData, setPatientData] = useState<any>(null); // Lưu thông tin bệnh nhân
  const [loading, setLoading] = useState(true); // Trạng thái đang tải
  const [error, setError] = useState<string | null>(null); // Lưu thông báo lỗi nếu có
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // Trạng thái hiển thị modal chỉnh sửa
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false); // Trạng thái hiển thị modal tải lên avatar
  const [avatarLoading, setAvatarLoading] = useState(false); // Trạng thái đang tải khi cập nhật avatar
  const [avatarError, setAvatarError] = useState<string | null>(null); // Lỗi khi cập nhật avatar
  const user = useSelector((state: any) => state.user.user); // Lấy thông tin người dùng từ Redux
  const dispatch = useDispatch(); // Hook để gửi action đến Redux
  const navigate = useNavigate(); // Hook chuyển trang

  useEffect(() => {
    // Hàm chỉ lấy dữ liệu bệnh nhân để hiển thị
    const fetchPatientData = async () => {
      setLoading(true);
      try {
        // Gọi API để lấy thông tin bệnh nhân dựa vào userId
        const response = await getPatientInfo(user.userId);

        if (response.data && response.data.code === 200) {
          setPatientData(response.data.data);
          // Không cập nhật Redux state ở đây theo yêu cầu
        } else {
          setError("Failed to retrieve patient data");
        }
      } catch (error) {
        console.error("Error fetching patient data:", error);
        setError("Error loading patient data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchPatientData();
  }, [user.userId]);

  // Các hàm điều khiển modal - không gọi API
  // Hàm mở modal chỉnh sửa
  const handleOpenEditModal = () => {
    setIsEditModalOpen(true);
  };

  // Hàm đóng modal chỉnh sửa
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

  // Cập nhật state local và đảm bảo Redux state cũng được cập nhật
  const handleSaveProfile = (updatedData: any) => {
    // Cập nhật state local để hiển thị ngay lập tức
    const updatedPatientData = {
      ...patientData,
      ...updatedData,
      address: updatedData.address || patientData.address || null,
    };
    setPatientData(updatedPatientData);

    // Phần cập nhật Redux state đã bị comment lại
    // const updatedUser = {
    //   ...user,
    //   ...updatedData,
    // };
    // dispatch(setUser(updatedUser));

    // Phần cập nhật localStorage đã bị comment lại
    // localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  // Cập nhật avatar sử dụng API
  const handleSaveAvatar = async (newAvatar: string) => {
    try {
      setAvatarLoading(true);
      setAvatarError(null);
      // Gọi API để cập nhật avatar
      const response = await updatePatientAvatar(user.userId, {
        uri: newAvatar,
      });
      if (response?.data?.code === 200) {
        // Cập nhật state local với dữ liệu trả về từ API
        setPatientData(response.data.data);
        // Cập nhật Redux state
        const updatedUser = {
          ...user,
          avatar: response.data.data.avatar,
        };
        dispatch(setUser(updatedUser));
        console.log("Avatar updated successfully:", response.data.data.avatar);
      } else {
        throw new Error("Failed to update avatar");
      }
    } catch (error) {
      console.error("Error updating avatar:", error);
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
  if (!patientData) {
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
              firstName={patientData.firstName || "Không có thông tin"}
              lastName={patientData.lastName || "Không có thông tin"}
              email={patientData.email || "Không có thông tin"}
              phone={patientData.phone || "Không có thông tin"}
              dob={patientData.dob || "Không có thông tin"}
              sex={patientData.sex !== undefined ? patientData.sex : null}
              address={patientData.address || null}
              avatar={patientData.avatar || "/default-avatar.png"}
              onEditAvatar={handleOpenAvatarModal}
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
          </Box>
        </Grid>

        {/* Phần nút chức năng */}
        <Grid item xs={12}>
          <Box
            sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 2 }}
          >
            {/* Nút đổi mật khẩu */}
            <Button
              variant="outlined"
              startIcon={<LockIcon />}
              onClick={() => navigate(ROUTING.CHANGE_PASSWORD)}
            >
              Đổi mật khẩu
            </Button>

            {/* Nút quản lý tài khoản ngân hàng */}
            <Button
              variant="outlined"
              startIcon={<CreditCardIcon />}
              onClick={() => navigate(`../${ROUTING.BANK_ACCOUNT}`)}
            >
              Tài khoản ngân hàng
            </Button>
          </Box>
        </Grid>
      </Grid>

      {/* Modal chỉnh sửa thông tin cá nhân */}
      <EditProfileModal
        open={isEditModalOpen}
        onClose={handleCloseEditModal}
        onSave={handleSaveProfile}
        userData={{
          firstName: patientData.firstName || "",
          lastName: patientData.lastName || "",
          email: patientData.email || "",
          phone: patientData.phone || "",
          dob: patientData.dob || "",
          sex: patientData.sex !== undefined ? patientData.sex : "",
          address: patientData.address || null,
        }}
      />

      {/* Modal tải lên avatar */}
      <AvatarUploadModal
        open={isAvatarModalOpen}
        currentAvatar={patientData.avatar || "/default-avatar.png"}
        onClose={handleCloseAvatarModal}
        onSave={handleSaveAvatar}
        isLoading={avatarLoading}
        error={avatarError}
      />
    </Container>
  );
};

export default PatientProfilePage;
