import { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    SafeAreaView,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AuthButton from '@/src/components/utils/auth/AuthButton';

export default function VerificationScreen() {
    const router = useRouter();
    const [verificationCode, setVerificationCode] = useState([
        '',
        '',
        '',
        '',
        '',
        '',
    ]);
    const [timeLeft, setTimeLeft] = useState(60);
    const [isResendDisabled, setIsResendDisabled] = useState(true);
    const inputRefs = useRef<(TextInput | null)[]>([]);

    const { source, email } = useLocalSearchParams(); // Get the query param

    useEffect(() => {
        console.log('Navigated from:', source); // Prints the source page, e.g., 'forgotPassword'
        console.log('Email:', email); // Prints the source page, e.g., 'forgotPassword'
    }, [source]);

    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            setIsResendDisabled(false);
        }
    }, [timeLeft]);

    useEffect(() => {
        const enteredCode = verificationCode.join('');
        const correctCode = '123456';

        if (enteredCode.length === 6) {
            if (enteredCode === correctCode) {
                if (source === 'forgotPassword') {
                    router.push('/resetpassword'); // Redirect to the reset password page
                } else {
                    router.push('/singUpsuccess'); // Redirect to the home page
                }
            } else {
                alert('Invalid verification code. Please try again.');
            }
        }
    }, [verificationCode]);

    const handleResendCode = () => {
        setTimeLeft(60);
        setIsResendDisabled(true);
        setVerificationCode(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
        alert('Verification code has been resent.');
    };

    const handleInputChange = (value: string, index: number) => {
        if (!/^\d?$/.test(value)) return; // Only allow digits

        const newCode = [...verificationCode];
        newCode[index] = value;
        setVerificationCode(newCode);

        if (value && index < newCode.length - 1) {
            inputRefs.current[index + 1]?.focus(); // Move cursor to next input
        }
    };

    const handleKeyPress = (e: any, index: number) => {
        if (
            e.nativeEvent.key === 'Backspace' &&
            !verificationCode[index] &&
            index > 0
        ) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white px-6 py-4">
            <Text className="mt-2 text-2xl font-bold text-gray-900">
                Enter Verification Code
            </Text>
            <Text className="mt-4 text-gray-500">
                We sent a verification code to{' '}
            </Text>
            <Text className="font-bold text-gray-500">{email}</Text>

            <View className="mt-4 w-full flex-col items-center">
                <View className="mt-6 flex-row gap-4 space-x-2">
                    {verificationCode.map((digit, index) => (
                        <TextInput
                            key={index}
                            ref={ref => (inputRefs.current[index] = ref)}
                            className="h-12 w-12 rounded-lg border-2 border-gray-300 text-center text-lg font-bold"
                            keyboardType="numeric"
                            maxLength={1}
                            value={digit}
                            onChangeText={text =>
                                handleInputChange(text, index)
                            }
                            onKeyPress={e => handleKeyPress(e, index)}
                        />
                    ))}
                </View>
            </View>

            <View className="mt-4 w-full flex-col items-center">
                <Text className="mt-4 text-gray-500">
                    Resend code in 00:{timeLeft.toString().padStart(2, '0')}
                </Text>
                {/* <TouchableOpacity
                    className={`w-[240px] rounded-full py-3 mt-6 ${isResendDisabled ? 'bg-blue-300' : 'bg-blue-600'}`}
                    disabled={isResendDisabled}
                    onPress={handleResendCode}
                >
                    <Text className="text-white text-center text-lg font-semibold">Resend Code</Text>
                </TouchableOpacity> */}

                <AuthButton
                    onPress={handleResendCode}
                    isResendDisabled={isResendDisabled}
                    title="Resend Code"
                />
            </View>
        </SafeAreaView>
    );
}
