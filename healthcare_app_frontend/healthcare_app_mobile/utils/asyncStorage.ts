import AsyncStorage from "@react-native-async-storage/async-storage";

const getUserAsyncStorage = async () => {
  try {
    const user = await AsyncStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error("Error getting user from localStorage", error);
    return null;
  }
};

const setUserAsyncStorage = async (user: any) => {
  try {
    await AsyncStorage.setItem("user", JSON.stringify(user));
  } catch (error) {
    console.error("Error setting user in localStorage", error);
  }
};

const removeUserAsyncStorage = async () => {
  try {
    await AsyncStorage.removeItem("user");
  } catch (error) {
    console.error("Error removing user from localStorage", error);
  }
};
export { getUserAsyncStorage, setUserAsyncStorage, removeUserAsyncStorage };
