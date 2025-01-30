import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  NavigationProp,
  ParamListBase,
  useNavigation,
  useTheme,
} from "@react-navigation/native";
import BackButton from "../../components/BackButton";
import Button from "../../components/Button";

const DoctorDetailsScreen = () => {
  const navigation: NavigationProp<ParamListBase> = useNavigation();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <BackButton />
      </View>

      <View style={styles.profileSection}>
        <Image
          source={{
            uri: "https://randomuser.me/api/portraits/women/35.jpg",
          }}
          style={styles.profileImage}
        />
        <Text style={styles.doctorName}>Dr. Uroos Fatima</Text>
        <Text style={styles.doctorSpecialty}>Psychiatrist</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <View style={[styles.statIcon, { backgroundColor: "#E6F2FF" }]}>
            <Ionicons name="people" size={28} color="#4A90E2" />
          </View>
          <Text style={styles.statValue}>1000+</Text>
          <Text style={styles.statLabel}>Patients</Text>
        </View>
        <View style={styles.statItem}>
          <View style={[styles.statIcon, { backgroundColor: "#FFF0F5" }]}>
            <Ionicons name="time" size={28} color="#FF69B4" />
          </View>
          <Text style={styles.statValue}>10 Yrs</Text>
          <Text style={styles.statLabel}>Experience</Text>
        </View>
        <View style={styles.statItem}>
          <View style={[styles.statIcon, { backgroundColor: "#FFFACD" }]}>
            <Ionicons name="star" size={28} color="#FFD700" />
          </View>
          <Text style={styles.statValue}>4.5</Text>
          <Text style={styles.statLabel}>Ratings</Text>
        </View>
      </View>

      <View style={styles.consultationOptions}>
        <ConsultationOption
          icon="videocam"
          title="Video Consultation"
          subtitle="Chat"
          price="$23.77"
          color="#4A90E2"
        />
        <ConsultationOption
          icon="call"
          title="Audio Consultation"
          subtitle="Chat"
          price="$23.77"
          color="#FF69B4"
        />
        <ConsultationOption
          icon="chatbubble"
          title="Message"
          subtitle="Online"
          price="Free"
          color="#8A2BE2"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About Doctor</Text>
        <Text style={styles.sectionContent}>
          Dr. Bellamy Nicholas is a top specialist London Bridge Hospital at
          London. He has achieved several awards and recognition
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Working time</Text>
        <View style={styles.workingTime}>
          <Ionicons name="time-outline" size={20} color="#666" />
          <Text style={styles.workingTimeText}>
            Mon - Sat (08:30 AM - 09:00 PM)
          </Text>
        </View>
      </View>

      <View style={styles.reviewsSection}>
        <Text style={styles.sectionTitle}>Reviews</Text>
        <TouchableOpacity>
          <Text style={styles.seeAllText}>See all</Text>
        </TouchableOpacity>
      </View>

      <Button
        title="Set Appointment"
        onPress={() => {}}
        style={styles.setApoinmentButton}
      />
    </ScrollView>
  );
};

interface ConsultationOptionProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  price: string;
  color: string;
}

const ConsultationOption = ({
  icon,
  title,
  subtitle,
  price,
  color,
}: ConsultationOptionProps) => (
  <View style={[styles.consultationOption, { backgroundColor: color }]}>
    <View style={styles.optionHeader}>
      <View style={styles.consultationIconContainer}>
        <Ionicons name={icon} size={18} color="#fff" />
      </View>
      <View style={styles.priceContainer}>
        <Text style={styles.consultationPrice}>{price}</Text>
      </View>
    </View>
    <Text
      style={styles.optionTitle}
      // chỉnh để xuống dòng khi text quá dài (xuống trọn vẹn 1 từ, không bị nửa trên nửa dưới)
      lineBreakStrategyIOS="push-out"
      textBreakStrategy="simple"
    >
      {title}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    position: "absolute",
    top: 8,
    left: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  profileSection: {
    alignItems: "center",
    marginTop: 20,
  },
  profileImage: {
    width: 130,
    height: 130,
    borderRadius: 20,
  },
  doctorName: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 12,
    color: "#333",
  },
  doctorSpecialty: {
    fontSize: 16,
    color: "#666",
    // marginTop: 4,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 16,
    paddingHorizontal: 16,
  },
  statItem: {
    alignItems: "center",
  },
  statIcon: {
    width: 50,
    height: 50,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  statValue: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
  },
  consultationOptions: {
    marginTop: 16,
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  consultationOption: {
    flex: 1,
    padding: 8,
    borderRadius: 12,
  },
  optionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  consultationIconContainer: {
    width: 30,
    height: 30,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  optionTitle: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
    marginTop: 8,
    flexWrap: "wrap",
    textAlign: "left",
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  consultationPrice: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  section: {
    marginTop: 16,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  sectionContent: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  workingTime: {
    flexDirection: "row",
    alignItems: "center",
  },
  workingTimeText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 8,
  },
  reviewsSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
    paddingHorizontal: 16,
  },
  seeAllText: {
    fontSize: 14,
    color: "#432C81",
  },
  setApoinmentButton: {
    margin: 16,
  },
});

export default DoctorDetailsScreen;
