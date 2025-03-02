import { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import AuthButton from '@/src/components/utils/auth/AuthButton';

export default function HomeScreen() {
    const router = useRouter();
    const [userExists, setUserExists] = useState<boolean | null>(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            const checkUser = true; // Check if the user exists
            setUserExists(checkUser);
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (userExists === false) {
            router.push('/login');
        }
    }, [userExists, router]);

    if (userExists === null) {
        return (
            <View className="flex-1 items-center justify-center bg-white">
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        ); // Show loading spinner while checking the user existence
    } else if (userExists === true) {
        return (
            <View className="flex-1 items-center justify-center bg-white">
                <Text className="text-2xl font-bold">Welcome to Home Page</Text>
                <AuthButton
                    title="Go to Login"
                    onPress={() => router.push('/login')}
                />
                <AuthButton
                    title="Logout"
                    onPress={() => router.push('/login')}
                />
                <AuthButton
                    title="Go To onboarding"
                    onPress={() => router.push('/onboarding')}
                />
            </View>
        );
    }
}
