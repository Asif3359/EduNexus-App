import { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import AuthInputField from '@/src/components/utils/auth/AuthInputField';
import AuthButton from '@/src/components/utils/auth/AuthButton';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import Constants from 'expo-constants';

export default function ForgotPasswordScreen() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const apiUrl = (Constants.expoConfig as any).extra.BACKEND_API;

    const handleSendCode = async () => {
        if (!email.trim()) {
            Alert.alert('Error', 'Please enter your email address');
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            Alert.alert('Error', 'Please enter a valid email address');
            return;
        }

        // try {
        //     setLoading(true);

        //     // Send request to backend to send verification code
        //     const response = await axios.post(
        //         `${apiUrl}/auth/forgot-password`,
        //         {
        //             email: email.trim(),
        //         }
        //     );

        //     if (response.data.success) {
        //         // Navigate to verification screen with email as parameter
        //         router.push({
        //             pathname: '/verification',
        //             params: {
        //                 source: 'forgotPassword',
        //                 email: email.trim(),
        //             },
        //         });
        //     } else {
        //         Alert.alert(
        //             'Error',
        //             response.data.message || 'Failed to send verification code'
        //         );
        //     }
        // } catch (error) {
        //     console.error('Forgot password error:', error);
        //     Alert.alert(
        //         'Error',
        //         'An error occurred while sending the verification code'
        //     );
        // } finally {
        //     setLoading(false);
        // }

        router.push({
            pathname: '/verification',
            params: {
                source: 'forgotPassword',
                email: email.trim(),
            },
        });
    };

    return (
        <SafeAreaView className="flex-1 items-center justify-center bg-white px-6">
            {/* Illustration */}
            <Image
                source={require('../assets/images/forgot_password.png')}
                className="mb-4 h-64 w-64"
                resizeMode="contain"
            />

            {/* Title */}
            <Text className="mb-4 text-2xl font-bold text-gray-800">
                Reset Your Password
            </Text>
            <Text className="mb-6 text-center text-gray-500">
                Enter your email address and we'll send you instructions to
                reset your password
            </Text>

            {/* Email Input */}
            <AuthInputField
                label="Email"
                placeholder="example@gmail.com"
                value={email}
                onChangeText={setEmail}
            />

            <AuthButton
                title={loading ? 'Sending...' : 'Send Code'}
                onPress={handleSendCode}
            />

            {/* Sign In Link */}
            <View className="mt-6 w-full flex-row items-center justify-center gap-2">
                <Text className="text-gray-800">Remember your password?</Text>
                <TouchableOpacity onPress={() => router.push('/')}>
                    <Text className="font-medium text-blue-600">Sign in</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
