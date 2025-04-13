import React, { useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  Button,
} from "@mui/material";
import { Drug } from "../../types/medical";
import { useFormik } from "formik";
import * as Yup from "yup";

// Interface định nghĩa các props cho component DrugForm
// Cho phép sử dụng chung một form cho cả thêm mới và chỉnh sửa
interface DrugFormProps {
  open: boolean; // Trạng thái hiển thị của modal
  onClose: () => void; // Hàm xử lý khi đóng modal
  onSubmit: (drug: Partial<Drug>) => void; // Hàm xử lý khi submit form
  drug?: Drug | null; // Thông tin thuốc (khi chỉnh sửa)
  mode: "add" | "edit"; // Chế độ form: thêm mới hoặc chỉnh sửa
}

// Schema validation sử dụng Yup
// Định nghĩa các quy tắc kiểm tra dữ liệu nhập vào
const validationSchema = Yup.object({
  drugName: Yup.string()
    .required("Tên thuốc là bắt buộc")
    .min(2, "Tên thuốc phải có ít nhất 2 ký tự"),
  drugType: Yup.string().required("Loại thuốc là bắt buộc"),
  unit: Yup.string()
    .required("Đơn vị là bắt buộc")
    .min(1, "Đơn vị không được để trống"),
});

const DrugForm: React.FC<DrugFormProps> = ({
  open,
  onClose,
  onSubmit,
  drug,
  mode,
}) => {
  // Sử dụng formik để quản lý form và validation
  const formik = useFormik({
    initialValues: {
      drugName: "",
      drugType: "",
      unit: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  // Effect để cập nhật giá trị form khi chuyển sang chế độ chỉnh sửa
  // Hoặc reset form khi chuyển sang chế độ thêm mới
  useEffect(() => {
    if (drug && mode === "edit") {
      formik.setValues({
        drugName: drug.drugName,
        drugType: drug.drugType || "",
        unit: drug.unit,
      });
    } else if (mode === "add") {
      formik.resetForm();
    }
  }, [drug, mode]);

  // Xử lý đóng modal và reset form
  const handleClose = () => {
    formik.resetForm();
    onClose();
  };

  // Xác định tiêu đề và nút bấm dựa trên chế độ form
  const title = mode === "add" ? "Thêm thuốc mới" : "Chỉnh sửa thông tin thuốc";
  const buttonText = mode === "add" ? "Thêm thuốc" : "Lưu thay đổi";

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                name="drugName"
                label="Tên thuốc"
                value={formik.values.drugName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.drugName && Boolean(formik.errors.drugName)
                }
                helperText={formik.touched.drugName && formik.errors.drugName}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="drugType"
                label="Loại thuốc"
                value={formik.values.drugType}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.drugType && Boolean(formik.errors.drugType)
                }
                helperText={formik.touched.drugType && formik.errors.drugType}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="unit"
                label="Đơn vị"
                value={formik.values.unit}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.unit && Boolean(formik.errors.unit)}
                helperText={formik.touched.unit && formik.errors.unit}
                fullWidth
                required
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

export default DrugForm;
