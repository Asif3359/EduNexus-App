import React, { useEffect } from 'react';
import {
    View,
    Text,
    ActivityIndicator,
    Image,
    SafeAreaView,
} from 'react-native';
// import Svg, { Path } from "react-native-svg";
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SuccessScreen() {
    const router = useRouter();

    useEffect(() => {
        const timer = setTimeout(async () => {
            const userRole = await AsyncStorage.getItem('role');
            console.log('User role:', userRole);
            if (userRole === 'admin') {
                router.push('/');
            } else if (userRole === 'student') {
                router.push('/user/studentProfilesetup');
            } else if (userRole === 'teacher') {
                router.push('/teacher/teacherProfilesetup');
            }
        }, 3000); // Show for 3 seconds

        return () => clearTimeout(timer);
    }, []);

    return (
        <SafeAreaView className="flex-1 items-center justify-center bg-white px-6">
            {/* Top Illustration */}
            <Image
                source={require('../assets/images/PalmRecognition.png')} // Make sure you have the correct image path
                className="h-60 w-60"
                resizeMode="contain"
            />

            {/* Success Message */}
            <Text className="mt-6 text-2xl font-bold text-gray-900">
                Congratulations
            </Text>
            <Text className="mt-2 px-4 text-center leading-relaxed text-gray-500">
                Your Account is Ready to Use. You will be redirected to the
                dashboard in a few seconds.
            </Text>

            {/* Loading Indicator */}
            <ActivityIndicator size="large" color="#4A90E2" className="mt-6" />
        </SafeAreaView>
    );
}
