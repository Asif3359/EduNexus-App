import { Stack } from 'expo-router';
import { View } from 'react-native';
import './../global.css';
import BottomNavigationBar from './components/BottomNavigationBar';

export default function RootLayout() {
    return (
        <View style={{ flex: 1 }}>
            <Stack>
                <Stack.Screen
                    name="index"
                    options={{
                        title: 'Home',
                        headerShown: false,
                        animation: 'none',
                    }}
                />
                <Stack.Screen
                    name="user/cource"
                    options={{
                        title: 'Cource',
                        headerShown: false,
                        animation: 'none',
                    }}
                />
                <Stack.Screen
                    name="user/CourseVideosScreen"
                    options={{ title: 'Course Videos', headerShown: true }}
                />
                <Stack.Screen
                    name="user/courseDetails"
                    options={{ title: 'Course Details', headerShown: true }}
                />
                <Stack.Screen
                    name="user/history"
                    options={{
                        title: 'History',
                        headerShown: false,
                        animation: 'none',
                    }}
                />
                <Stack.Screen
                    name="PaymentScreen"
                    options={{ title: 'Payment', headerShown: true }}
                />
                <Stack.Screen
                    name="user/profile"
                    options={{ title: 'Profile', headerShown: false }}
                />
                <Stack.Screen
                    name="teacher/InstructorProfile"
                    options={{ title: 'Profile', headerShown: true }}
                />
                <Stack.Screen
                    name="login"
                    options={{ title: 'Login', headerShown: false }}
                />
                <Stack.Screen
                    name="signup"
                    options={{ title: 'Sign Up', headerShown: false }}
                />
                <Stack.Screen
                    name="forgotPassword"
                    options={{ title: 'Forgot Password', headerShown: true }}
                />
                <Stack.Screen
                    name="verification"
                    options={{ title: 'Verification', headerShown: true }}
                />
                <Stack.Screen
                    name="resetpassword"
                    options={{ title: 'Reset Password', headerShown: true }}
                />
                <Stack.Screen
                    name="singUpsuccess"
                    options={{ title: 'Success', headerShown: false }}
                />
                <Stack.Screen
                    name="forgotPasswjord"
                    options={{ title: 'Forgot Password', headerShown: true }}
                />
                <Stack.Screen
                    name="resetSuccess"
                    options={{
                        title: 'Profile',
                        headerShown: false,
                        animation: 'none',
                    }}
                />
                <Stack.Screen
                    name="onboarding/index"
                    options={{ title: 'Onboarding', headerShown: false }}
                />
            </Stack>
        </View>
    );
}
