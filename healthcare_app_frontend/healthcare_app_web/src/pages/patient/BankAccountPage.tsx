import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Paper,
  Grid,
  CircularProgress,
  Alert,
  IconButton,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  FormHelperText,
  Divider,
  Card,
  CardContent,
} from "@mui/material";
import { useNavigate } from "react-router";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useSelector } from "react-redux";
import { ROUTING } from "../../constants/routing";
import {
  addBankAccount,
  getPatientBankAccount,
  updateBankAccount,
} from "../../services/authenticate/user_service";
import { useFormik } from "formik";
import * as Yup from "yup";

// Define the BankAccount interface based on the actual API response
interface BankAccount {
  id?: number;
  patient?: {
    id: number;
    userId: string;
    firstName: string;
    lastName: string;
    // other patient fields...
  };
  bankName: string;
  accountNumber: string;
  createdAt?: string;
  updatedAt?: string;
}

// Danh sách các ngân hàng phổ biến ở Việt Nam
const VIETNAMESE_BANKS = [
  "BIDV - Ngân hàng TMCP Đầu tư và Phát triển Việt Nam",
  "Vietcombank - Ngân hàng TMCP Ngoại thương Việt Nam",
  "VietinBank - Ngân hàng TMCP Công thương Việt Nam",
  "Agribank - Ngân hàng Nông nghiệp và Phát triển Nông thôn Việt Nam",
  "Techcombank - Ngân hàng TMCP Kỹ thương Việt Nam",
  "ACB - Ngân hàng TMCP Á Châu",
  "MBBank - Ngân hàng TMCP Quân đội",
  "TPBank - Ngân hàng TMCP Tiên Phong",
  "VPBank - Ngân hàng TMCP Việt Nam Thịnh Vượng",
  "HDBank - Ngân hàng TMCP Phát triển TP Hồ Chí Minh",
  "SacomBank - Ngân hàng TMCP Sài Gòn Thương Tín",
  "OCB - Ngân hàng TMCP Phương Đông",
  "Eximbank - Ngân hàng TMCP Xuất Nhập khẩu Việt Nam",
  "LienVietPostBank - Ngân hàng TMCP Bưu điện Liên Việt",
  "SHB - Ngân hàng TMCP Sài Gòn - Hà Nội",
  "VIB - Ngân hàng TMCP Quốc tế Việt Nam",
];

// Schema validation dùng Yup
const bankAccountSchema = Yup.object({
  accountNumber: Yup.string()
    .required("Vui lòng nhập số tài khoản")
    .matches(/^\d{8,19}$/, "Số tài khoản không hợp lệ (8-19 chữ số)"),
  bankName: Yup.string().required("Vui lòng chọn ngân hàng"),
});

/**
 * Component quản lý tài khoản ngân hàng của bệnh nhân
 * Cho phép xem, thêm và cập nhật thông tin tài khoản ngân hàng
 */
const BankAccountPage: React.FC = () => {
  // Lấy thông tin người dùng từ Redux store
  const user = useSelector((state: any) => state.user.user);
  const navigate = useNavigate();

  // State quản lý dữ liệu và trạng thái trang
  const [bankAccount, setBankAccount] = useState<BankAccount | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [saveLoading, setSaveLoading] = useState<boolean>(false);

  // Khởi tạo Formik
  const formik = useFormik({
    initialValues: {
      accountNumber: "",
      bankName: "",
    },
    validationSchema: bankAccountSchema,
    onSubmit: async (values) => {
      handleSave(values);
    },
    enableReinitialize: true,
  });

  // Lấy thông tin tài khoản ngân hàng khi component được tải
  useEffect(() => {
    const fetchBankAccountData = async () => {
      if (!user || !user.userId) {
        setError("Không tìm thấy thông tin người dùng");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await getPatientBankAccount(user.userId);

        if (response.data.code === 200 && response.data.data) {
          // Đã có tài khoản ngân hàng
          const bankAccountData = response.data.data;
          setBankAccount(bankAccountData);

          // Cập nhật giá trị ban đầu cho Formik
          formik.setValues({
            accountNumber: bankAccountData.accountNumber || "",
            bankName: bankAccountData.bankName || "",
          });
        } else {
          // Chưa có tài khoản ngân hàng
          setBankAccount(null);
          setIsEditing(true); // Cho phép thêm mới ngay
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin tài khoản ngân hàng:", error);
        setError(
          "Đã xảy ra lỗi khi tải thông tin tài khoản ngân hàng. Vui lòng thử lại sau."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBankAccountData();
  }, [user]);

  // Hàm xử lý khi người dùng bấm nút Lưu
  const handleSave = async (values: {
    accountNumber: string;
    bankName: string;
  }) => {
    try {
      setSaveLoading(true);

      let response;
      if (bankAccount) {
        // Using real API implementation for update
        response = await updateBankAccount(
          user.userId,
          values.bankName,
          values.accountNumber
        );
        setSuccess("Cập nhật tài khoản ngân hàng thành công!");
      } else {
        // Using real API for adding new bank account
        response = await addBankAccount(
          user.userId,
          values.bankName,
          values.accountNumber
        );
        setSuccess("Thêm tài khoản ngân hàng thành công!");
      }

      if (response.data.code === 200 || response.data.code === 201) {
        setBankAccount(response.data.data);
        setIsEditing(false);
      } else {
        setError(
          "Không thể lưu thông tin tài khoản ngân hàng. Vui lòng thử lại."
        );
      }
    } catch (error) {
      console.error("Lỗi khi lưu thông tin tài khoản ngân hàng:", error);
      setError(
        "Đã xảy ra lỗi khi lưu thông tin tài khoản ngân hàng. Vui lòng thử lại sau."
      );
    } finally {
      setSaveLoading(false);
    }
  };

  // Hàm xử lý khi người dùng bấm nút Hủy
  const handleCancel = () => {
    if (bankAccount) {
      // Khôi phục dữ liệu từ state ban đầu
      formik.resetForm({
        values: {
          accountNumber: bankAccount.accountNumber,
          bankName: bankAccount.bankName,
        },
      });
      setIsEditing(false);
    } else {
      // Quay lại trang profile nếu đang thêm mới và hủy
      navigate(ROUTING.PROFILE);
    }

    // Xóa thông báo
    setError(null);
    setSuccess(null);
  };

  // Hàm xử lý khi người dùng bấm nút Chỉnh sửa
  const handleEdit = () => {
    setIsEditing(true);
    setError(null);
    setSuccess(null);
  };

  // Render giao diện tải khi đang loading
  if (loading && !bankAccount) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="60vh"
        >
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        {/* Tiêu đề và nút quay lại */}
        <Box display="flex" alignItems="center" mb={3}>
          <IconButton onClick={() => navigate(-1)} sx={{ mr: 1 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h5" component="h1">
            Quản lý tài khoản ngân hàng
          </Typography>
        </Box>

        {/* Hiển thị thông báo lỗi nếu có */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Hiển thị thông báo thành công nếu có */}
        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {success}
          </Alert>
        )}

        {/* Form thông tin tài khoản ngân hàng */}
        <form onSubmit={formik.handleSubmit}>
          <Card variant="outlined" sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                Thông tin tài khoản ngân hàng
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <Grid container spacing={3}>
                {/* Trường nhập số tài khoản */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="accountNumber"
                    name="accountNumber"
                    label="Số tài khoản"
                    variant="outlined"
                    value={formik.values.accountNumber}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    disabled={!isEditing}
                    error={
                      formik.touched.accountNumber &&
                      Boolean(formik.errors.accountNumber)
                    }
                    helperText={
                      formik.touched.accountNumber &&
                      formik.errors.accountNumber
                    }
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>

                {/* Trường chọn ngân hàng */}
                <Grid item xs={12}>
                  <FormControl
                    fullWidth
                    error={
                      formik.touched.bankName && Boolean(formik.errors.bankName)
                    }
                  >
                    <InputLabel id="bank-select-label">Ngân hàng</InputLabel>
                    <Select
                      labelId="bank-select-label"
                      id="bankName"
                      name="bankName"
                      value={formik.values.bankName}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      label="Ngân hàng"
                      disabled={!isEditing}
                    >
                      <MenuItem value="">
                        <em>Chọn ngân hàng</em>
                      </MenuItem>
                      {VIETNAMESE_BANKS.map((bank) => (
                        <MenuItem key={bank} value={bank}>
                          {bank}
                        </MenuItem>
                      ))}
                    </Select>
                    {formik.touched.bankName && formik.errors.bankName && (
                      <FormHelperText>{formik.errors.bankName}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Các nút thao tác */}
          <Box display="flex" justifyContent="flex-end" gap={2}>
            {isEditing ? (
              // Hiển thị nút Lưu và Hủy khi đang chỉnh sửa
              <>
                <Button
                  variant="outlined"
                  onClick={handleCancel}
                  disabled={saveLoading}
                >
                  Hủy
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  disabled={saveLoading}
                  startIcon={saveLoading && <CircularProgress size={20} />}
                >
                  {saveLoading ? "Đang lưu..." : "Lưu thay đổi"}
                </Button>
              </>
            ) : (
              // Hiển thị nút Chỉnh sửa khi đang xem
              <Button
                variant="contained"
                color="primary"
                onClick={handleEdit}
                disabled={loading}
              >
                Chỉnh sửa
              </Button>
            )}
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default BankAccountPage;
