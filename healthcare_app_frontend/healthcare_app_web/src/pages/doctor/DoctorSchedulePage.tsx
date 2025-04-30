import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Checkbox,
  Stack,
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  InputAdornment,
} from "@mui/material";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { addDays, format, startOfWeek, addWeeks, subWeeks } from "date-fns";
import { vi } from "date-fns/locale";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import SaveIcon from "@mui/icons-material/Save";
import { formatDateToString } from "../../utils/dateUtils";
import {
  getWorkScheduleBetweenDate,
  addMultipleWorkSchedule,
} from "../../services/authenticate/workSchedule_service";
import { getShiftByStatusTrue } from "../../services/authenticate/shift_service";
import { parse } from "date-fns/esm";

interface Shift {
  id: number;
  shift: number;
  start: string;
  end: string;
  status?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Định nghĩa các ngày trong tuần theo enum TypeDay
const DAYS_OF_WEEK = [
  { key: "MONDAY", label: "Thứ 2" },
  { key: "TUESDAY", label: "Thứ 3" },
  { key: "WEDNESDAY", label: "Thứ 4" },
  { key: "THURSDAY", label: "Thứ 5" },
  { key: "FRIDAY", label: "Thứ 6" },
  { key: "SATURDAY", label: "Thứ 7" },
  { key: "SUNDAY", label: "Chủ nhật" },
];

// Interface định nghĩa cấu trúc dữ liệu cho một ngày trong lịch làm việc
interface ScheduleItem {
  dayIndex: number; // Chỉ số của ngày trong tuần (0-6)
  date: Date;
  selectedShifts: number[]; // Mảng chứa các ca đã được chọn (bao gồm luôn lockedShifts)
  lockedShifts: number[]; // Mảng chứa các ca đã được đăng ký trước đó, không thể chỉnh sửa
}

// Định nghĩa schema xác thực cho maxSlots sử dụng Yup
const MaxSlotsSchema = Yup.object().shape({
  maxSlots: Yup.number()
    .required("Số lượng bệnh nhân là bắt buộc")
    .min(20, "Số lượng tối thiểu là 20 bệnh nhân")
    .max(40, "Số lượng tối đa là 40 bệnh nhân")
    .integer("Vui lòng nhập số nguyên"),
});

interface MaxSlotsFormValues {
  maxSlots: number;
}

/**
 * DoctorSchedulePage - Trang quản lý và đăng ký lịch làm việc của bác sĩ
 *
 * CÁCH HIỂN THỊ LỊCH:
 * 1. Cấu trúc dữ liệu:
 *    - Mỗi tuần bao gồm 7 ngày, mỗi ngày có thể có nhiều ca làm việc
 *    - Mỗi ngày được biểu diễn qua đối tượng ScheduleItem gồm:
 *      + dayIndex: vị trí của ngày trong tuần (0-6)
 *      + date: đối tượng Date đại diện cho ngày
 *      + selectedShifts: mảng các ca đã chọn (bao gồm cả ca đã khóa và sẽ đăng ký mới)
 *      + lockedShifts: mảng các ca đã được đăng ký trước đó (không thể hủy chọn)
 *
 * 2. Hiển thị lịch đã tồn tại:
 *    - Khi component được tải, hệ thống gọi API getWorkScheduleBetweenDate để lấy lịch đã đăng ký
 *    - Các ca làm việc đã đăng ký được chuyển thành lockedShifts và selectedShifts
 *    - Trên giao diện, các ca này được hiển thị dưới dạng checkbox đã được chọn và bị khóa
 *
 * 3. Thêm lịch mới:
 *    - Người dùng có thể chọn các ca trống (không có trong lockedShifts) bằng cách click vào checkbox
 *    - Các ca được chọn sẽ được thêm vào selectedShifts nhưng không có trong lockedShifts
 *    - Khi lưu lịch, chỉ các ca trong selectedShifts mà không có trong lockedShifts sẽ được gửi lên server
 *    - Sau khi lưu thành công, các ca mới sẽ được thêm vào lockedShifts
 *    - Chỉ lưu được 1 tuần mỗi lần
 */

const DoctorSchedulePage = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const doctorId = user?.userId;

  // Số tuần tối đa cho phép đặt lịch (1 tháng ~ 4 tuần)
  const MAX_WEEKS_AHEAD = 4;

  // Lưu trữ danh sách các ca làm việc từ API
  const [shifts, setShifts] = useState<Shift[]>([]);

  // Lưu trữ ngày hiện tại để tính toán giới hạn tuần
  const [today] = useState(new Date());

  // State lưu ngày bắt đầu của tuần hiện tại (mặc định là thứ 2)
  const [currentWeekStart, setCurrentWeekStart] = useState(
    startOfWeek(today, { weekStartsOn: 1 })
  );

  // State lưu trữ lịch làm việc của cả tuần hiện tại
  const [weekSchedule, setWeekSchedule] = useState<ScheduleItem[]>([]);

  // State lưu trữ thông báo thành công để hiển thị cho người dùng
  const [successMessage, setSuccessMessage] = useState("");

  // State lưu trữ thông báo lỗi để hiển thị cho người dùng
  const [errorMessage, setErrorMessage] = useState("");

  // State cho hộp thoại xác nhận
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  // State lưu trữ lịch làm việc đang chờ lưu
  const [pendingSchedules, setPendingSchedules] = useState<any[]>([]);

  // Thêm state để lưu giá trị maxSlots hiện tại từ Formik
  const [currentMaxSlots, setCurrentMaxSlots] = useState<number>(20);

  // Gọi API để lấy thông tin về các ca làm việc khi component được tạo
  useEffect(() => {
    const fetchShifts = async () => {
      try {
        const response = await getShiftByStatusTrue();
        if (response.data && response.data.data) {
          setShifts(response.data.data);
          console.log("Đã lấy ca làm việc:", response.data.data);
        }
      } catch (error) {
        console.error("Lỗi khi lấy ca làm việc:", error);
      }
    };

    fetchShifts();
  }, []);

  // Hàm định dạng thời gian từ "07-00-00" sang "07:00"
  const formatShiftTime = (time: string) => {
    if (!time) return "";
    return time.replace(/-/g, ":").substring(0, 5);
  };

  // Khởi tạo lịch làm việc khi tuần hiện tại thay đổi
  useEffect(() => {
    const initScheduleAndFetchData = async () => {
      // Tạo dữ liệu cho 7 ngày trong tuần mới
      const newWeekSchedule: ScheduleItem[] = [];
      for (let i = 0; i < 7; i++) {
        const currentDate = addDays(currentWeekStart, i);
        newWeekSchedule.push({
          dayIndex: i,
          date: currentDate,
          selectedShifts: [],
          lockedShifts: [],
        });
      }

      // Cập nhật state với lịch trống mới cho tuần hiện tại
      setWeekSchedule(newWeekSchedule);

      // Sau đó, nếu có doctorId, gọi API để lấy dữ liệu lịch làm việc đã đăng ký
      if (doctorId) {
        const weekStart = currentWeekStart;
        const weekEnd = addDays(currentWeekStart, 6);

        try {
          const response = await getWorkScheduleBetweenDate(
            doctorId,
            formatDateToString(weekStart),
            formatDateToString(weekEnd)
          );

          const data = response?.data?.data || [];

          if (data.length > 0) {
            const updatedSchedule = [...newWeekSchedule];
            console.log("Cập nhật lịch với dữ liệu:", updatedSchedule);

            data.forEach((item: any) => {
              // Kiểm tra dữ liệu trả về có đầy đủ không
              if (!item.workSchedule || !item.workSchedule.dateAppointment) {
                console.error("Thiếu thông tin lịch làm việc:", item);
                return;
              }

              // Parse chuỗi ngày thành đối tượng Date
              const appointmentDate = parse(
                item.workSchedule.dateAppointment,
                "dd-MM-yyyy",
                new Date()
              );

              // Tìm ngày tương ứng trong lịch làm việc
              const dayIndex = updatedSchedule.findIndex(
                (day) =>
                  day.date.getDate() === appointmentDate.getDate() &&
                  day.date.getMonth() === appointmentDate.getMonth() &&
                  day.date.getFullYear() === appointmentDate.getFullYear()
              );

              // Nếu tìm thấy ngày tương ứng, cập nhật lịch làm việc
              // Thêm vào danh sách đã chọn và đánh dấu là đã đăng ký
              if (dayIndex !== -1 && item.workSchedule.shift) {
                // Xử lý động với mọi số ca làm việc
                const shiftNumber = item.workSchedule.shift.shift;
                if (shiftNumber) {
                  // Thêm ca làm việc vào danh sách đã chọn nếu chưa có
                  if (
                    !updatedSchedule[dayIndex].selectedShifts.includes(
                      shiftNumber
                    )
                  ) {
                    updatedSchedule[dayIndex].selectedShifts.push(shiftNumber);
                  }
                  // Đánh dấu ca làm việc đã được đăng ký (không thể hủy)
                  if (
                    !updatedSchedule[dayIndex].lockedShifts.includes(
                      shiftNumber
                    )
                  ) {
                    updatedSchedule[dayIndex].lockedShifts.push(shiftNumber);
                  }
                }
              }
            });

            console.log("Đã cập nhật lịch làm việc:", updatedSchedule);
            setWeekSchedule(updatedSchedule);
          }
        } catch (error) {
          console.error("Lỗi khi tải lịch làm việc:", error);
          setErrorMessage("Lỗi khi tải lịch làm việc");
          setTimeout(() => setErrorMessage(""), 3000);
        }
      }
    };

    initScheduleAndFetchData();
  }, [currentWeekStart, doctorId]);

  const isCurrentWeek = () => {
    const currentWeekStartTime = startOfWeek(today, {
      weekStartsOn: 1,
    }).getTime();
    return currentWeekStart.getTime() === currentWeekStartTime;
  };

  const isMaxWeekAhead = () => {
    // Kiểm tra xem tuần hiện tại có phải là tuần cuối trong khoảng cho phép không
    const maxWeekStartTime = startOfWeek(addWeeks(today, MAX_WEEKS_AHEAD), {
      weekStartsOn: 1,
    }).getTime();
    return currentWeekStart.getTime() === maxWeekStartTime;
  };

  const handlePrevWeek = () => {
    if (!isCurrentWeek()) {
      setCurrentWeekStart(subWeeks(currentWeekStart, 1));
    }
  };

  const handleNextWeek = () => {
    if (!isMaxWeekAhead()) {
      const nextWeekStart = startOfWeek(addWeeks(currentWeekStart, 1), {
        weekStartsOn: 1,
      });
      setCurrentWeekStart(nextWeekStart);
    }
  };

  const toggleShift = (dayIndex: number, shiftNumber: number) => {
    const newSchedule = [...weekSchedule]; // Tạo bản sao của lịch tuần hiện tại
    const daySchedule = newSchedule[dayIndex]; // Lấy lịch của ngày hiện tại
    // Kiểm tra xem ca đã bị khóa hay chưa
    if (daySchedule.lockedShifts.includes(shiftNumber)) {
      return; // Không thể thay đổi ca đã khóa
    }

    // Kiểm tra xem ca đã được chọn hay chưa
    if (daySchedule.selectedShifts.includes(shiftNumber)) {
      // Nếu đã chọn, bỏ chọn ca
      daySchedule.selectedShifts = daySchedule.selectedShifts.filter(
        (shift) => shift !== shiftNumber
      );
    } else {
      // Nếu chưa chọn, thêm ca vào danh sách đã chọn
      daySchedule.selectedShifts.push(shiftNumber);
    }

    setWeekSchedule(newSchedule);
  };

  /**
   * Chọn tất cả các ca làm việc có thể chọn
   *
   * Quy trình:
   * - Duyệt qua tất cả các ngày trong tuần
   * - Với mỗi ngày, duyệt qua tất cả các ca làm việc từ API
   * - Nếu ca làm việc chưa bị khóa và chưa được chọn, thêm vào danh sách đã chọn
   * - Cách này hỗ trợ linh hoạt với số lượng ca không cố định
   */
  const selectAllShifts = () => {
    const newSchedule = weekSchedule.map((day) => {
      // Tạo bản sao của danh sách ca đã chọn
      const updatedShifts = [...day.selectedShifts];

      // Duyệt qua mảng shifts
      shifts.forEach((shift) => {
        const shiftNumber = shift.shift;
        // Kiểm tra xem ca làm việc đã bị khóa hay chưa
        // Nếu chưa bị khóa và chưa được chọn, thêm vào danh sách đã chọn
        if (
          !day.lockedShifts.includes(shiftNumber) &&
          !updatedShifts.includes(shiftNumber)
        ) {
          updatedShifts.push(shiftNumber);
        }
      });

      // Trả về đối tượng ngày với danh sách ca đã chọn được cập nhật
      return {
        ...day,
        selectedShifts: updatedShifts,
      };
    });
    setWeekSchedule(newSchedule);
  };

  const clearAllSelections = () => {
    // Duyệt qua từng ngày trong lịch tuần hiện tại
    // Đặt lại danh sách ca đã chọn về danh sách ca đã khóa (không thể thay đổi)
    const newSchedule = weekSchedule.map((day) => ({
      ...day,
      selectedShifts: [...day.lockedShifts],
    }));
    setWeekSchedule(newSchedule);
  };

  const handleSaveSchedule = () => {
    try {
      if (!doctorId) {
        setErrorMessage("Không tìm thấy thông tin người dùng");
        return;
      }
      // Tạo danh sách các ca làm việc cần lưu
      const schedulesToSave = [];
      // Duyệt qua từng ngày trong lịch tuần hiện tại
      for (const day of weekSchedule) {
        const formattedDate = format(day.date, "dd-MM-yyyy");

        // Duyệt qua từng ca đã chọn trong ngày
        for (const shiftNumber of day.selectedShifts) {
          // Nếu ca chưa bị khóa thêm vào danh sách cần lưu
          if (!day.lockedShifts.includes(shiftNumber)) {
            schedulesToSave.push({
              doctorId: doctorId,
              shift: shiftNumber,
              maxSlots: currentMaxSlots, // Sử dụng giá trị hiện tại từ Formik
              dateAppointment: formattedDate,
            });
          }
        }
      }

      if (schedulesToSave.length === 0) {
        setSuccessMessage("Không có lịch mới cần lưu");
        setTimeout(() => setSuccessMessage(""), 3000);
        return;
      }

      // Lưu trữ lịch và mở hộp thoại xác nhận
      setPendingSchedules(schedulesToSave);
      setOpenConfirmDialog(true);
    } catch (error) {
      console.error("Lỗi khi chuẩn bị lịch làm việc:", error);
      setErrorMessage("Lỗi khi chuẩn bị lịch làm việc");
      setTimeout(() => setErrorMessage(""), 3000);
    }
  };

  const confirmSaveSchedule = async () => {
    try {
      setOpenConfirmDialog(false);

      const response = await addMultipleWorkSchedule(pendingSchedules);

      if (response && response.data && response.data.code === 200) {
        setSuccessMessage(
          `Đã lưu ${pendingSchedules.length} ca làm việc mới thành công. Lưu ý: Các ca làm việc đã được đăng ký không thể chỉnh sửa hoặc xóa.`
        );

        // Cập nhật lại lịch làm việc, chỉ cần nhập lokeckShifts, ko cần nhập lại selectedShifts
        // Vì selectedShifts đã được cập nhật trước đó
        const updatedSchedule = weekSchedule.map((day) => {
          const newLockedShifts = [...day.lockedShifts]; // Bản sao của danh sách ca đã khóa
          // Duyệt qua các ca đã chọn trong ngày, biến selectedShifts thành lockedShifts
          day.selectedShifts.forEach((shift) => {
            // Nếu ca chưa bị khóa, thêm vào danh sách đã khóa
            if (!newLockedShifts.includes(shift)) {
              newLockedShifts.push(shift);
            }
          });

          return {
            ...day,
            lockedShifts: newLockedShifts,
          };
        });

        setWeekSchedule(updatedSchedule);
        setTimeout(() => setSuccessMessage(""), 5000);
      } else {
        throw new Error("Không thể lưu lịch làm việc");
      }
    } catch (error) {
      console.error("Lỗi khi lưu lịch làm việc:", error);
      setErrorMessage("Lỗi khi lưu lịch làm việc");
      setTimeout(() => setErrorMessage(""), 3000);
    } finally {
      setPendingSchedules([]);
    }
  };

  const handleCloseDialog = () => {
    setOpenConfirmDialog(false);
    setPendingSchedules([]);
  };

  const formatWeekRange = () => {
    const weekEnd = addDays(currentWeekStart, 6);
    return `${format(currentWeekStart, "dd/MM/yyyy")} - ${format(
      weekEnd,
      "dd/MM/yyyy"
    )}`;
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{ display: "flex", alignItems: "center", mb: 3 }}
      >
        <CalendarMonthIcon sx={{ mr: 1 }} />
        Thêm Lịch Làm Việc
      </Typography>

      {successMessage && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {successMessage}
        </Alert>
      )}

      {errorMessage && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errorMessage}
        </Alert>
      )}

      <Paper sx={{ mb: 3, p: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <IconButton
                onClick={handlePrevWeek}
                aria-label="Tuần trước"
                disabled={isCurrentWeek()}
                sx={{
                  color: isCurrentWeek() ? "text.disabled" : "inherit",
                  "&:hover": {
                    color: isCurrentWeek() ? "text.disabled" : "primary.main",
                  },
                }}
              >
                <NavigateBeforeIcon />
              </IconButton>

              <Typography
                variant="h6"
                sx={{ flexGrow: 1, textAlign: "center" }}
              >
                {formatWeekRange()}
                {isCurrentWeek() && (
                  <Typography variant="caption" display="block" color="primary">
                    Tuần hiện tại
                  </Typography>
                )}
              </Typography>

              <IconButton
                onClick={handleNextWeek}
                aria-label="Tuần sau"
                disabled={isMaxWeekAhead()}
                sx={{
                  color: isMaxWeekAhead() ? "text.disabled" : "inherit",
                  "&:hover": {
                    color: isMaxWeekAhead() ? "text.disabled" : "primary.main",
                  },
                }}
              >
                <NavigateNextIcon />
              </IconButton>
            </Stack>
          </Grid>

          <Grid item xs={12} md={6}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1}
              justifyContent="flex-end"
            >
              <Button variant="outlined" onClick={selectAllShifts} size="small">
                Chọn tất cả
              </Button>

              <Button
                variant="outlined"
                color="error"
                onClick={clearAllSelections}
                size="small"
              >
                Bỏ chọn tất cả
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Paper>

      {/* Thay thế TextField cho maxSlots bằng Formik */}
      <Paper sx={{ mb: 3, p: 2 }}>
        <Formik
          initialValues={{ maxSlots: 20 }}
          validationSchema={MaxSlotsSchema}
          onSubmit={(values: MaxSlotsFormValues) => {
            // Form này không cần xử lý submit vì nó là một phần của form lớn hơn
            // Giá trị được lưu trong state và sử dụng khi form chính được gửi đi
          }}
        >
          {({ values, errors, touched, handleChange, handleBlur }) => {
            // Update currentMaxSlots when values change using regular effect pattern
            if (values.maxSlots !== currentMaxSlots) {
              setCurrentMaxSlots(values.maxSlots);
            }

            return (
              <Form>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1">
                      Số lượng bệnh nhân tối đa mỗi ca:
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Field
                      as={TextField}
                      name="maxSlots"
                      type="number"
                      value={values.maxSlots}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.maxSlots && Boolean(errors.maxSlots)}
                      helperText={
                        touched.maxSlots && errors.maxSlots
                          ? errors.maxSlots
                          : "Giới hạn từ 20 đến 40 bệnh nhân mỗi ca"
                      }
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            bệnh nhân/ca
                          </InputAdornment>
                        ),
                      }}
                      size="small"
                      fullWidth
                    />
                  </Grid>
                </Grid>
              </Form>
            );
          }}
        </Formik>
      </Paper>

      <Paper sx={{ mb: 3, overflow: "auto" }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold", width: "100px" }}>
                  Ca
                </TableCell>

                {weekSchedule.map((day) => (
                  <TableCell
                    key={`day-${day.dayIndex}`}
                    align="center"
                    sx={{ fontWeight: "bold", minWidth: "120px" }}
                  >
                    {DAYS_OF_WEEK[day.dayIndex].label}
                    <Typography variant="body2" color="textSecondary">
                      {format(day.date, "dd/MM")}
                    </Typography>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {shifts.length > 0 ? (
                shifts.map((shift) => (
                  <TableRow key={`shift-${shift.shift}`}>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Ca {shift.shift}
                      <Typography
                        variant="caption"
                        display="block"
                        color="textSecondary"
                      >
                        {`${formatShiftTime(shift.start)} - ${formatShiftTime(
                          shift.end
                        )}`}
                      </Typography>
                    </TableCell>

                    {weekSchedule.map((day) => (
                      <TableCell
                        key={`${day.dayIndex}-shift${shift.shift}`}
                        align="center"
                      >
                        <Checkbox
                          checked={day.selectedShifts.includes(shift.shift)}
                          onChange={() =>
                            toggleShift(day.dayIndex, shift.shift)
                          }
                          disabled={day.lockedShifts.includes(shift.shift)}
                        />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    Không có ca làm việc nào được cấu hình
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<SaveIcon />}
          onClick={handleSaveSchedule}
        >
          Lưu lịch
        </Button>
      </Box>

      {/* Hộp thoại xác nhận */}
      <Dialog
        open={openConfirmDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Xác nhận thêm lịch làm việc"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <strong>Lưu ý quan trọng:</strong> Sau khi thêm, các ca làm việc này
            sẽ không thể chỉnh sửa hoặc xóa. Bạn có chắc chắn muốn tiếp tục
            không?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="inherit">
            Hủy bỏ
          </Button>
          <Button
            onClick={confirmSaveSchedule}
            color="primary"
            variant="contained"
            autoFocus
          >
            Xác nhận thêm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DoctorSchedulePage;
