import { StyleSheet, View, ScrollView, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ProfileHeader } from "../../components/profile/ProfileHeader";
import { MenuItem } from "../../components/profile/MenuItem";
import {
  NavigationProp,
  ParamListBase,
  useTheme,
} from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
export const ProfileScreen = () => {
  const navigation: NavigationProp<ParamListBase> = useNavigation();

  const handleEditProfile = () => {
    navigation.navigate("EditProfile");
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Profile</Text>
        <ProfileHeader
          name="Jhalok Deb"
          email="jhalokde@gmail.com"
          imageUrl="https://randomuser.me/api/portraits/men/1.jpg"
          onEditPress={handleEditProfile}
        />
        <View style={styles.menuContainer}>
          <MenuItem
            icon="person-outline"
            title="Edit Profile"
            onPress={handleEditProfile}
          />
          <MenuItem
            icon="notifications-outline"
            title="Notification"
            onPress={() => {}}
          />
          <MenuItem
            icon="calendar-outline"
            title="My Appointments"
            onPress={() => {}}
          />
          <MenuItem icon="heart-outline" title="Favorite" onPress={() => {}} />
          <MenuItem
            icon="fitness-outline"
            title="Health Assessment"
            onPress={() => {}}
          />
          <MenuItem
            icon="help-circle-outline"
            title="Help & Support"
            onPress={() => {}}
          />
          <MenuItem
            icon="information-circle-outline"
            title="About DocSwift"
            onPress={() => {}}
          />
          <MenuItem icon="language" title="Language" onPress={() => {}} />
          <MenuItem
            icon="log-out-outline"
            title="Log Out"
            onPress={() => {}}
            textColor="#FF4444"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 10,
    marginBottom: 10,
  },
  menuContainer: {
    marginTop: 10,
  },
});
