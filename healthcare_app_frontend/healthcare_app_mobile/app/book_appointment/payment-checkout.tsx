import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Clipboard,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { Client } from "@stomp/stompjs";
import { createAppointment } from "../../services/appointment/booking_service"; // Import the appointment creation service
import {
  getAppointmentPrice,
  getAppointmentPriceByTypeDisease,
} from "../../services/appointment/price_service"; // Import the price service

const PaymentCheckout = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const workScheduleId = parseInt(params.workScheduleId as string, 10);
  const userId = params.userId as string;
  const doctorName = params.doctorName as string;
  const serviceName = params.serviceName as string;
  const dateAppointment = params.dateAppointment as string;
  const timeAppointment = params.timeAppointment as string;

  // Các state quản lý trạng thái thanh toán
  const [verifyingPayment, setVerifyingPayment] = useState(false); // Trạng thái đang xác minh thanh toán
  const [paymentError, setPaymentError] = useState<string | null>(null); // Lưu thông báo lỗi khi thanh toán thất bại
  const [note, setNote] = useState(""); // Ghi chú cho cuộc hẹn nếu cần
  const [isConnected, setIsConnected] = useState(false); // Trạng thái kết nối với server
  const getIntervalNumber = useRef(null);

  // Các thông số cần thiết cho thanh toán
  const [appointmentFee, setAppointmentFee] = useState<number>(0);
  const [fetchingPrice, setFetchingPrice] = useState<boolean>(true);
  const [priceError, setPriceError] = useState<string | null>(null);
  const code = workScheduleId + userId?.replace(/-/g, ""); // Tạo mã giao dịch duy nhất từ ID lịch làm việc và ID người dùng
  const acc = process.env?.EXPO_PUBLIC_ACC || ""; // Số tài khoản từ biến môi trường
  const bank = process.env?.EXPO_PUBLIC_BANK || ""; // Mã ngân hàng từ biến môi trường

  // Fetch giá phí khám bệnh từ API
  useEffect(() => {
    const fetchAppointmentPrice = async () => {
      try {
        setFetchingPrice(true);
        setPriceError(null);

        let response;
        if (serviceName) {
          response = await getAppointmentPriceByTypeDisease(serviceName);

          // Nếu dữ liệu là null, dù code là 200, lấy giá mặc định
          if (response.code === 200 && !response.data) {
            response = await getAppointmentPrice();
          }
        } else {
          // Nếu không có thông tin service, lấy giá mặc định
          response = await getAppointmentPrice();
        }

        if (response.code === 200 && response.data) {
          // lọc status true
          // Nếu dữ liệu là mảng, lọc ra các giá hợp lệ
          if (Array.isArray(response.data)) {
            const validPrices = response.data.filter(
              (item) => item.status === true
            );
            if (validPrices.length > 0) {
              setAppointmentFee(validPrices[0].price);
            } else {
              setPriceError("Không tìm thấy thông tin giá hợp lệ");
            }
          } else {
            setAppointmentFee(response.data.price);
          }
        } else {
          setPriceError("Không thể lấy thông tin phí khám bệnh");
          console.error("API error:", response);
        }
      } catch (error) {
        setPriceError("Có lỗi xảy ra khi lấy thông tin phí khám bệnh");
        console.error("Failed to fetch appointment price:", error);
      } finally {
        setFetchingPrice(false);
      }
    };

    fetchAppointmentPrice();
  }, []);

  // Hàm xử lý khi hoàn tất thanh toán
  const handlePaymentComplete = async () => {
    try {
      // Gọi API để tạo cuộc hẹn mới
      await createAppointment(userId, note, workScheduleId, code);
      // Chuyển hướng đến trang xác nhận sau khi thanh toán thành công
      router.push({
        pathname: "/book_appointment/confirmation",
        params: {
          doctorName: doctorName,
          serviceName: serviceName,
          dateAppointment: dateAppointment,
          timeAppointment: timeAppointment,
        },
      });
    } catch (err) {
      console.error("Failed to process payment:", err);
    }
  };

  const copyToClipboard = (text: string) => {
    Clipboard.setString(text);
  };

  const client = new Client({
    brokerURL: `ws://${process.env.EXPO_PUBLIC_HOST_ID}:8081/appointment/socket`,
    debug: (msg) => {
      console.log("STOMP: " + msg);
    },
    onConnect: () => {
      client.subscribe("/patient/result_check_payment", () => {
        handlePaymentComplete().catch((error) => {
          console.log(error);
          setPaymentError("Có lỗi xảy ra trong quá trình xác minh thanh toán.");
        });
      });
    },
  });
  client.appendMissingNULLonIncoming = true;
  client.discardWebsocketOnCommFailure = true;
  client.forceBinaryWSFrames = true;

  useEffect(() => {
    client.activate();

    getIntervalNumber.current = setInterval(() => {
      if (appointmentFee > 0) {
        client.publish({
          destination: "/app/check_payment",
          body: JSON.stringify({
            amount_in: appointmentFee,
            transaction_content: code,
          }),
        });
      }
    }, 3000);

    return () => {
      client.deactivate();
      clearInterval(getIntervalNumber.current);
    };
  }, [appointmentFee]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={styles.headerSection}>
          <Text style={styles.header}>Thanh toán</Text>
          <Text style={styles.subtitle}>
            Vui lòng thanh toán để hoàn tất đặt lịch
          </Text>
        </View>

        <View style={styles.cardSection}>
          <Text style={styles.sectionTitle}>Thông tin thanh toán</Text>

          {fetchingPrice ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#26b9c8" />
              <Text style={styles.loadingText}>
                Đang tải thông tin phí khám bệnh...
              </Text>
            </View>
          ) : priceError ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{priceError}</Text>
            </View>
          ) : (
            <Text style={styles.feeText}>
              Phí khám bệnh: {appointmentFee.toLocaleString("vi-VN")} VNĐ
            </Text>
          )}

          {paymentError && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{paymentError}</Text>
            </View>
          )}

          {!fetchingPrice && !priceError && (
            <>
              <View style={styles.qrContainer}>
                <Image
                  source={{
                    uri: `https://qr.sepay.vn/img?bank=${bank}&acc=${acc}&template=compact&amount=${appointmentFee}&des=${code}`,
                  }}
                  style={styles.qrImage}
                  resizeMode="contain"
                />
              </View>

              <View style={styles.paymentDetailsContainer}>
                <Text style={styles.detailsTitle}>Thông tin chuyển khoản:</Text>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Chủ tài khoản:</Text>
                  <View style={styles.detailValueContainer}>
                    <Text style={styles.detailValue}>NGUYEN HO DANG QUANG</Text>
                    <TouchableOpacity
                      onPress={() => copyToClipboard("NGUYEN HO DANG QUANG")}
                    >
                      <Ionicons name="copy-outline" size={18} color="#26b9c8" />
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Ngân hàng:</Text>
                  <View style={styles.detailValueContainer}>
                    <Text style={styles.detailValue}>BIDV</Text>
                    <TouchableOpacity onPress={() => copyToClipboard("BIDV")}>
                      <Ionicons name="copy-outline" size={18} color="#26b9c8" />
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Số TK:</Text>
                  <View style={styles.detailValueContainer}>
                    <Text style={styles.detailValue}>{acc}</Text>
                    <TouchableOpacity onPress={() => copyToClipboard(acc)}>
                      <Ionicons name="copy-outline" size={18} color="#26b9c8" />
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Số tiền:</Text>
                  <View style={styles.detailValueContainer}>
                    <Text style={styles.detailValue}>
                      {appointmentFee.toLocaleString("vi-VN")}đ
                    </Text>
                    <TouchableOpacity
                      onPress={() => copyToClipboard(appointmentFee.toString())}
                    >
                      <Ionicons name="copy-outline" size={18} color="#26b9c8" />
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Nội dung CK:</Text>
                  <View style={styles.detailValueContainer}>
                    <Text style={styles.detailValue}>{code}</Text>
                    <TouchableOpacity onPress={() => copyToClipboard(code)}>
                      <Ionicons name="copy-outline" size={18} color="#26b9c8" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              <Text style={styles.instructionText}>
                Sử dụng app ngân hàng để quét mã QR hoặc chuyển khoản thủ công
                theo thông tin trên.
              </Text>
            </>
          )}
        </View>

        <View style={styles.noteContainer}>
          <MaterialIcons name="info-outline" size={20} color="#26b9c8" />
          <Text style={styles.noteText}>
            Hệ thống sẽ tự động xác minh thanh toán của bạn. Vui lòng không đóng
            màn hình này cho đến khi hoàn tất.
          </Text>
        </View>
      </ScrollView>

      {/* <View>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={handlePaymentComplete}
        >
          <Text style={styles.cancelButtonText}>Hoàn tất thanh toán</Text>
        </TouchableOpacity>
      </View> */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => router.back()}
        >
          <Text style={styles.cancelButtonText}>Hủy</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  headerSection: {
    marginBottom: 20,
    alignItems: "center",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#26b9c8",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
  },
  cardSection: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    color: "#333",
  },
  feeText: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 16,
    color: "#26b9c8",
  },
  errorContainer: {
    backgroundColor: "#ffebee",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: "#d32f2f",
    fontSize: 14,
  },
  qrContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
  },
  qrImage: {
    width: 250,
    height: 250,
    borderWidth: 1,
    borderColor: "#eeeeee",
    borderRadius: 8,
  },
  paymentDetailsContainer: {
    marginTop: 20,
  },
  detailsTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
    color: "#333",
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#eeeeee",
    paddingVertical: 12,
  },
  detailLabel: {
    fontSize: 14,
    color: "#666",
    flex: 2,
  },
  detailValueContainer: {
    flex: 3,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  detailValue: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
    marginRight: 10,
    textAlign: "right",
  },
  instructionText: {
    marginTop: 16,
    fontSize: 14,
    color: "#666",
    fontStyle: "italic",
    textAlign: "center",
  },
  noteContainer: {
    flexDirection: "row",
    backgroundColor: "#e0f7fa",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 16,
  },
  noteText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: "#333",
  },
  footer: {
    padding: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  cancelButton: {
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#26b9c8",
    justifyContent: "center",
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#26b9c8",
    fontWeight: "bold",
    fontSize: 16,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  loadingText: {
    marginLeft: 10,
    fontSize: 14,
    color: "#666",
  },
});

export default PaymentCheckout;
