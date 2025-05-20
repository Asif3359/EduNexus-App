import { Stack } from 'expo-router';
import { SafeAreaView } from 'react-native';
import './../global.css';
import { StripeProvider } from './components/StripeProvider';

export default function RootLayout() {
    return (
        <StripeProvider>
            <SafeAreaView style={{ flex: 1 }}>
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
                        name="login"
                        options={{ title: 'Login', headerShown: false }}
                    />
                    <Stack.Screen
                        name="signup"
                        options={{ title: 'Sign Up', headerShown: false }}
                    />
                    <Stack.Screen
                        name="forgotPassword"
                        options={{
                            title: 'Forgot Password',
                            headerShown: true,
                        }}
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
                        name="resetSuccess"
                        options={{
                            title: 'Profile',
                            headerShown: false,
                            animation: 'none',
                        }}
                    />
                    <Stack.Screen
                        name="profileSetupScreen"
                        options={{ title: 'Profile Setup', headerShown: true }}
                    />

                    {/* onboarding */}
                    <Stack.Screen
                        name="onboarding/index"
                        options={{ title: 'Onboarding', headerShown: false }}
                    />

                    {/* User  */}
                    <Stack.Screen
                        name="user/index"
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
                        name="user/profile"
                        options={{ title: 'Profile', headerShown: false }}
                    />
                    <Stack.Screen
                        name="paymentScreen"
                        options={{ title: 'Payment', headerShown: true }}
                    />
                    <Stack.Screen
                        name="user/studentProfilesetup"
                        options={{ title: 'Profile Setup', headerShown: true }}
                    />
                    <Stack.Screen
                        name="user/applyForTeacher"
                        options={{
                            title: 'Apply for teacher',
                            headerShown: true,
                        }}
                    />
                    <Stack.Screen
                        name="user/profileDetails"
                        options={{
                            title: 'Profile Details',
                            headerShown: true,
                        }}
                    />

                    {/* Teacher */}
                    <Stack.Screen
                        name="teacher/index"
                        options={{
                            title: 'Teacher Home',
                            headerShown: false,
                            animation: 'none',
                        }}
                    />
                    <Stack.Screen
                        name="teacher/InstructorProfile"
                        options={{ title: 'Profile', headerShown: true }}
                    />
                    <Stack.Screen
                        name="teacher/profile"
                        options={{ title: 'Profile', headerShown: false }}
                    />
                    <Stack.Screen
                        name="teacher/teacherProfilesetup"
                        options={{ title: 'Profile setup', headerShown: true }}
                    />

                    <Stack.Screen
                        name="teacher/createCourse"
                        options={{ title: 'New Course', headerShown: true }}
                    />
                    <Stack.Screen
                        name="teacher/courseList"
                        options={{ title: 'Course List', headerShown: true }}
                    />
                    <Stack.Screen
                        name="teacher/schedule"
                        options={{
                            title: 'Scheduled Classes',
                            headerShown: true,
                        }}
                    />
                    <Stack.Screen
                        name="manageLessons/addVideo"
                        options={{ title: 'Add Video', headerShown: true }}
                    />
                    <Stack.Screen
                        name="manageLessons/addLiveClass"
                        options={{ title: 'Add Live Class', headerShown: true }}
                    />
                    <Stack.Screen
                        name="teacher/profileDetails"
                        options={{
                            title: 'Profile Details',
                            headerShown: true,
                        }}
                    />

                    {/* Courses  */}
                    <Stack.Screen
                        name="course/[id]"
                        options={{ title: 'Course ', headerShown: true }}
                    />
                    <Stack.Screen
                        name="manageLessons/[moduleId]"
                        options={{ title: 'Module  ', headerShown: true }}
                    />
                </Stack>
            </SafeAreaView>
        </StripeProvider>
    );
}
