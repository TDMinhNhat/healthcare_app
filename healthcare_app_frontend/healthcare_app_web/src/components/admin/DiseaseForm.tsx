import React, { useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  Button,
  FormControlLabel,
  Switch,
} from "@mui/material";
import { Disease } from "../../types/typeDisease";
import { useFormik } from "formik";
import * as Yup from "yup";

// Interface định nghĩa các props cho component DiseaseForm
interface DiseaseFormProps {
  open: boolean; // Trạng thái hiển thị của modal
  onClose: () => void; // Hàm xử lý khi đóng modal
  onSubmit: (disease: Partial<Disease>) => void; // Hàm xử lý khi submit form
  disease?: Disease | null; // Thông tin loại bệnh (khi chỉnh sửa)
  mode: "add" | "edit"; // Chế độ form: thêm mới hoặc chỉnh sửa
}

// Schema validation sử dụng Yup
const validationSchema = Yup.object({
  name: Yup.string()
    .required("Tên loại bệnh là bắt buộc")
    .max(255, "Tên loại bệnh không được vượt quá 255 ký tự"),
});

const DiseaseForm: React.FC<DiseaseFormProps> = ({
  open,
  onClose,
  onSubmit,
  disease,
  mode,
}) => {
  // Sử dụng formik để quản lý form và validation
  const formik = useFormik({
    initialValues: {
      name: "",
      status: true,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  // Effect để cập nhật giá trị form khi chuyển sang chế độ chỉnh sửa
  // Hoặc reset form khi chuyển sang chế độ thêm mới
  useEffect(() => {
    if (disease && mode === "edit") {
      formik.setValues({
        name: disease.name,
        status: disease.status,
      });
    } else if (mode === "add") {
      formik.resetForm();
      formik.setValues({
        name: "",
        status: true,
      });
    }
  }, [disease, mode, open]);

  // Xử lý đóng modal và reset form
  const handleClose = () => {
    formik.resetForm();
    onClose();
  };

  // Xác định tiêu đề và nút bấm dựa trên chế độ form
  const title =
    mode === "add" ? "Thêm loại bệnh mới" : "Chỉnh sửa thông tin loại bệnh";
  const buttonText = mode === "add" ? "Thêm loại bệnh" : "Lưu thay đổi";

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                name="name"
                label="Tên loại bệnh"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    name="status"
                    checked={formik.values.status}
                    onChange={formik.handleChange}
                  />
                }
                label="Hoạt động"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="error">
            Hủy
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={formik.isSubmitting}
          >
            {buttonText}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default DiseaseForm;
