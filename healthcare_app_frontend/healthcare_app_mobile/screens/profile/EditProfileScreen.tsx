import React, { useState } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import TextInput from "../../components/TextInput";
import Button from "../../components/Button";
import { Formik } from "formik";
import * as Yup from "yup";
import Header from "../../components/Header";
import { SafeAreaView } from "react-native-safe-area-context";

export const EditProfileScreen = () => {
  const navigation = useNavigation();
  const [gender, setGender] = useState<"Male" | "Female">("Male");
  const [showDatePicker, setShowDatePicker] = useState(false);

  const validationSchema = Yup.object({
    fullName: Yup.string().required("Required"),
    dateOfBirth: Yup.date().required("Required"),
    email: Yup.string().email("Invalid email").required("Required"),
  });

  const handleSave = (values: any) => {
    const formData = {
      ...values,
      gender: gender,
    };
    console.log("Form values:", formData);
  };

  const formatDate = (date: Date) => {
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Edit Profile" />

      <Formik
        initialValues={{
          fullName: "Jhalok Deb",
          dateOfBirth: new Date(),
          email: "jhalokde@gmail.com",
        }}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          handleSave(values);
        }}
      >
        {({ handleSubmit, setFieldValue, values }) => (
          <>
            <View style={styles.form}>
              <TextInput
                name="fullName"
                label="Full name"
                placeholder="Enter your full name"
              />

              <View>
                <Text style={styles.label}>Date of Birth</Text>
                <TouchableOpacity
                  style={styles.dateButton}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Text>{formatDate(values.dateOfBirth)}</Text>
                </TouchableOpacity>
                {showDatePicker && (
                  <DateTimePicker
                    value={values.dateOfBirth}
                    mode="date"
                    display={Platform.OS === "ios" ? "spinner" : "default"}
                    onChange={(event, selectedDate) => {
                      setShowDatePicker(Platform.OS === "ios");
                      if (selectedDate) {
                        setFieldValue("dateOfBirth", selectedDate);
                      }
                    }}
                  />
                )}
              </View>

              <View style={styles.genderContainer}>
                <Text style={styles.label}>Gender</Text>
                <View style={styles.genderButtons}>
                  <TouchableOpacity
                    style={[
                      styles.genderButton,
                      gender === "Male" && styles.genderButtonActive,
                    ]}
                    onPress={() => setGender("Male")}
                  >
                    <Text
                      style={[
                        styles.genderButtonText,
                        gender === "Male" && styles.genderButtonTextActive,
                      ]}
                    >
                      Male
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.genderButton,
                      gender === "Female" && styles.genderButtonActive,
                    ]}
                    onPress={() => setGender("Female")}
                  >
                    <Text
                      style={[
                        styles.genderButtonText,
                        gender === "Female" && styles.genderButtonTextActive,
                      ]}
                    >
                      Female
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <TextInput
                name="email"
                label="Email"
                placeholder="Enter your email"
              />
            </View>
            <View style={styles.buttonContainer}>
              <Button title="Save" onPress={() => handleSubmit()} />
            </View>
          </>
        )}
      </Formik>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  form: {
    flex: 1,
    paddingHorizontal: 16,
    gap: 16,
  },
  buttonContainer: {
    padding: 16,
  },
  genderContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  genderButtons: {
    flexDirection: "row",
    gap: 12,
  },
  genderButton: {
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  genderButtonActive: {
    backgroundColor: "#5B21B6",
    borderColor: "#5B21B6",
  },
  genderButtonText: {
    fontSize: 16,
    color: "#666",
  },
  genderButtonTextActive: {
    color: "#fff",
  },
  dateButton: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    overflow: "hidden",
  },
  picker: {
    width: "100%",
  },
});
