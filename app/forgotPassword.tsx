import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import AuthInputField from '@/src/components/utils/auth/AuthInputField';
import AuthButton from '@/src/components/utils/auth/AuthButton';
import { SafeAreaView } from 'react-native';

export default function ForgotPasswordScreen() {
    const [email, setEmail] = useState('');
    const router = useRouter();

    const handleSendCode = () => {
        router.push('/verification?source=forgotPassword');
    };

    return (
        <SafeAreaView className="flex-1 items-center justify-center bg-white px-6">
            {/* Illustration */}
            <Image
                source={require('../assets/images/forgot_password.png')} // Add an appropriate image for forgot password
                className="mb-4 h-64 w-64"
            />

            {/* Title */}
            <Text className="mb-4 text-2xl font-bold text-gray-800">
                Reset Your Password
            </Text>
            <Text className="text-center text-gray-500">
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

            <AuthButton title="Send Code" onPress={handleSendCode} />

            {/* Sign In Link */}
            <View className="mt-6 w-full flex-row items-center justify-center gap-2">
                <Text className="text-gray-800">Remember your password?</Text>
                <TouchableOpacity onPress={() => router.push('/')}>
                    <Text className="text-blue-600">Sign in</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
