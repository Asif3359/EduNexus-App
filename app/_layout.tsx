import { Stack } from 'expo-router';
import './../global.css';

export default function RootLayout() {
    return (
        <Stack>
            <Stack.Screen
                name="index"
                options={{ title: 'Home', headerShown: false }}
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
                name="forgotPassword"
                options={{ title: 'Forgot Password', headerShown: true }}
            />
            <Stack.Screen
                name="resetSuccess"
                options={{ title: 'Profile', headerShown: false }}
            />
            <Stack.Screen
                name="onboarding/index"
                options={{ title: 'Onboarding', headerShown: false }}
            />
        </Stack>
    );
}
