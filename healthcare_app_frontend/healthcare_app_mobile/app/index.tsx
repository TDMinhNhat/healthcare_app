import {StyleSheet, SafeAreaView, View, Text, TextInput, Pressable, Image} from "react-native"
import {useState} from "react";
import {Link} from "expo-router";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function HomeScreen() {

    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [showPassword, setShowPassword] = useState<boolean>(false);

    return (
        <SafeAreaView style={style.main}>
            <View style={style.container}>
                <View>
                    <Text style={style.title}>ĐĂNG NHẬP</Text>
                </View>
                <View style={style.itemArea}>
                    <TextInput
                        inputMode={"email"}
                        placeholder={"Nhập tài khoản email"}
                        onChangeText={(text: string) => setEmail(text)}
                        style={style.input}
                    />
                </View>
                <View style={style.itemAreaPassword}>
                    <TextInput
                        secureTextEntry={!showPassword}
                        placeholder={"Nhập mật khẩu"}
                        onChangeText={(text: string) => setEmail(text)}
                        style={style.inputPassword}
                    />
                    <MaterialCommunityIcons
                        name={showPassword ? 'eye-off' : 'eye'}
                        size={24}
                        color="#aaa"
                        style={style.togglePassword}
                        onPress={() => setShowPassword(!showPassword)}
                    />
                </View>
                <View style={style.itemArea}>
                    <Link href={"/register"}>
                        <View>
                            <Text style={style.forgotPass}>
                                Tạo Tài Khoản
                            </Text>
                        </View>
                    </Link>
                    <Link href={"/forgot_password"}>
                        <View>
                            <Text style={style.forgotPass}>
                                Quên Mật Khẩu
                            </Text>
                        </View>
                    </Link>
                </View>
                <View style={style.itemArea}>
                    <Pressable style={style.button}>
                        <Text style={style.buttonText}>Đăng Nhập</Text>
                    </Pressable>
                </View>
                <View style={style.itemArea}>
                    <Pressable style={style.button}>
                        <Text style={style.buttonText}>Đăng Nhập Bằng Khuôn Mặt</Text>
                    </Pressable>
                </View>
                <View style={style.itemArea}>
                    <View style={{width: "100%"}}>
                        <Text style={{textAlign: "center"}}>
                            Hoặc
                        </Text>
                    </View>
                </View>
                <View style={[style.itemArea, style.socialButtonArea]}>
                    <Pressable style={[style.socialButton, {borderColor: "blue"}]}>
                        <FontAwesome5 name="facebook" size={24} color="blue" />
                        <Text style={[style.socialButtonText, {color: "blue"}]}>Facebook</Text>
                    </Pressable>
                    <Pressable style={[style.socialButton, {borderColor: "orange"}]}>
                        <FontAwesome name="google" size={24} color="orange" />
                        <Text style={[style.socialButtonText, {color: "orange"}]}>Google</Text>
                    </Pressable>
                    <Pressable style={[style.socialButton, {borderColor: "black"}]}>
                        <FontAwesome name="apple" size={24} color="black" />
                        <Text style={[style.socialButtonText, {color: "black"}]}>Apple</Text>
                    </Pressable>
                </View>
            </View>
        </SafeAreaView>
    );
}

const style = StyleSheet.create({
    main: {
        width: "100%",
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    container: {
        width: "85%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center"
    },
    title: {
        fontSize: 30,
        fontWeight: "bold",
    },
    itemArea: {
        width: "100%",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 20
    },
    itemAreaPassword: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 20,
        width: "100%",
        borderStyle: "solid",
        borderColor: "black",
        borderWidth: 1,
    },
    input: {
        width: "100%",
        borderStyle: "solid",
        borderColor: "black",
        borderWidth: 1,
    },
    inputPassword: {
        width: "80%"
    },
    togglePassword: {
        marginRight: 10
    },
    forgotPassArea: {
        width: "100%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-end",
    },
    forgotPass: {
        color: "#26b9c8",
        textDecorationLine: "underline"
    },
    button: {
        backgroundColor: "#26b9c8",
        padding: 10,
        width: "100%",
        borderRadius: 10
    },
    buttonText: {
        color: "white",
        textAlign: "center"
    },
    socialButtonArea: {
        width: "100%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    socialButton: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        borderStyle: "solid",
        borderWidth: 1,
        padding: 10
    },
     socialButtonText: {
        marginLeft: 5
     }
});