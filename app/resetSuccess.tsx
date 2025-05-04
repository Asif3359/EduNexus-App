import {
    View,
    Text,
    TouchableOpacity,
    Image,
    SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import AuthButton from '@/src/components/utils/auth/AuthButton';

export default function ResetSuccessScreen() {
    const router = useRouter();

    return (
        <SafeAreaView className="flex-1 items-center justify-center bg-white px-6">
            {/* Success Icon */}
            <View className="flex h-28 w-28 items-center justify-center rounded-full bg-green-400">
                <FontAwesome name="check" size={48} color="white" />
            </View>

            {/* Success Message */}
            <Text className="mt-4 text-2xl font-bold text-gray-800">
                Password Changed!
            </Text>
            <Text className="mt-2 text-center text-lg text-gray-500">
                Your password has been successfully updated. You can now use
                your new password to log in.
            </Text>

            {/* Back to Login Button */}
            <AuthButton
                title="Back to Login"
                onPress={() => router.push('/')}
            />

            {/* Security Note */}
            <View className="mt-4 flex-row items-center gap-2">
                <FontAwesome name="lock" size={16} color="gray" />
                <Text className="ml-2 text-gray-500">
                    For security reasons, you’ll need to log in again with your
                    new password.
                </Text>
            </View>
        </SafeAreaView>
    );
}
