import React, { useRef, useState } from "react";
import { View, TextInput, StyleSheet } from "react-native";

interface FieldOTPProps {
  length: number;
  onComplete?: (otp: string) => void;
}

const FieldOTP: React.FC<FieldOTPProps> = ({ length = 6, onComplete }) => {
  const [otp, setOtp] = useState<string[]>(new Array(length).fill(""));
  const inputRefs = useRef<TextInput[]>([]);

  const handleChange = (value: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Di chuyển tới ô tiếp theo
    if (value && index < length - 1) {
      inputRefs.current[index + 1].focus();
    }

    // Kiểm tra nếu đã nhập đủ số
    if (newOtp.join("").length === length) {
      onComplete && onComplete(newOtp.join(""));
    }
  };

  const handleKeyPress = (event: any, index: number) => {
    if (event.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  return (
    <View style={styles.container}>
      {otp.map((_, index) => (
        <TextInput
          key={index}
          ref={(ref) => (inputRefs.current[index] = ref as TextInput)}
          style={styles.input}
          maxLength={1}
          keyboardType="numeric"
          value={otp[index]}
          onChangeText={(value) => handleChange(value, index)}
          onKeyPress={(event) => handleKeyPress(event, index)}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  input: {
    width: 45,
    height: 45,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    textAlign: "center",
    fontSize: 20,
  },
});

export default FieldOTP;
