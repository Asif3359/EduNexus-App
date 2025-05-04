import { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import AuthButton from '@/src/components/utils/auth/AuthButton';

export default function ResetPasswordScreen() {
    const router = useRouter();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
        useState(false);

    const handleResetPassword = () => {
        if (newPassword !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }
        if (newPassword.length < 6) {
            alert('Password must be at least 6 characters long!');
            return;
        }
        router.push('/resetSuccess'); // Redirect to login page
    };

    return (
        <SafeAreaView className="flex-1 bg-white px-6 py-6">
            {/* Title */}
            <Text className="mb-2 text-2xl font-bold text-gray-800">
                Create New Password
            </Text>
            <Text className="mb-6 text-gray-500">
                Your new password must be different from previous used passwords
            </Text>
            <View className="w-full flex-col items-center">
                {/* New Password Input */}
                <Text className="self-start text-gray-500">New Password</Text>
                <View className="mt-2 w-full flex-row items-center rounded-lg bg-gray-200 px-4 py-2">
                    <TextInput
                        placeholder="••••••"
                        className="flex-1 bg-transparent"
                        secureTextEntry={!isPasswordVisible}
                        value={newPassword}
                        onChangeText={setNewPassword}
                    />
                    <TouchableOpacity
                        onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                    >
                        <FontAwesome
                            name={isPasswordVisible ? 'eye' : 'eye-slash'}
                            size={20}
                            color="gray"
                        />
                    </TouchableOpacity>
                </View>

                {/* Confirm Password Input */}
                <Text className="mt-4 self-start text-gray-500">
                    Confirm Password
                </Text>
                <View className="mt-2 w-full flex-row items-center rounded-lg bg-gray-200 px-4 py-2">
                    <TextInput
                        placeholder="••••••"
                        className="flex-1 bg-transparent"
                        secureTextEntry={!isConfirmPasswordVisible}
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                    />
                    <TouchableOpacity
                        onPress={() =>
                            setIsConfirmPasswordVisible(
                                !isConfirmPasswordVisible
                            )
                        }
                    >
                        <FontAwesome
                            name={
                                isConfirmPasswordVisible ? 'eye' : 'eye-slash'
                            }
                            size={20}
                            color="gray"
                        />
                    </TouchableOpacity>
                </View>

                <AuthButton
                    onPress={handleResetPassword}
                    title="Reset Password"
                    isResendDisabled={!newPassword || !confirmPassword}
                />

                {/* Security Info */}
                <View className="mt-4 flex-row items-center">
                    <FontAwesome name="lock" size={16} color="gray" />
                    <Text className="ml-2 text-gray-500">
                        For your security, your password will expire in 90 days
                    </Text>
                </View>
            </View>
        </SafeAreaView>
    );
}
2;
