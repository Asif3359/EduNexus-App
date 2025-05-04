import {
    Text,
    View,
    Image,
    ScrollView,
    ActivityIndicator,
    TouchableOpacity,
    Alert,
    SafeAreaView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import studentsData from '@/assets/data/students.json';
import BottomNavigationBar from '../components/BottomNavigationBar';
import { useRouter } from 'expo-router'; // for navigation
import { useEffect, useState } from 'react';
import axios, { AxiosError } from 'axios';
import Constants from 'expo-constants';

export default function ProfileScreen() {
    const [student, setStudent] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const apiUrl = (Constants.expoConfig as any).extra.BACKEND_API;

    useEffect(() => {
        const fetchStudent = async () => {
            const email = await AsyncStorage.getItem('userEmail');
            const token = await AsyncStorage.getItem('userToken');
            // console.log('Token from AsyncStorage:', token);
            if (email) {
                const matchedStudent = studentsData.find(
                    s => s.email === email
                );
                setStudent(matchedStudent);
            }
            setLoading(false);
        };
        fetchStudent();
    }, []);

    const handleLogout = async () => {
        Alert.alert('Confirm Logout', 'Are you sure you want to logout?', [
            {
                text: 'Cancel',
                style: 'cancel',
            },
            {
                text: 'Logout',
                style: 'destructive',
                onPress: async () => {
                    try {
                        const token = await AsyncStorage.getItem('userToken');

                        if (!token) {
                            console.warn('No token found.');
                            return;
                        }

                        await AsyncStorage.clear();
                        await AsyncStorage.setItem('isFirstTime', 'false');
                        console.log('Logout successful');
                        router.replace('/login');
                    } catch (error: unknown) {
                        let errorMessage = 'Logout failed';
                        console.log('Logout error:', error);

                        if (axios.isAxiosError(error)) {
                            errorMessage =
                                error.response?.data?.message || error.message;
                        } else if (error instanceof Error) {
                            errorMessage = error.message;
                        }

                        console.error('Logout failed:', errorMessage);
                        Alert.alert('Logout Failed', errorMessage);
                    }
                },
            },
        ]);
    };

    if (loading) {
        return (
            <SafeAreaView className="flex-1 items-center justify-center">
                <ActivityIndicator size="large" color="#6D28D9" />
            </SafeAreaView>
        );
    }

    if (!student) {
        return (
            <SafeAreaView className="flex-1 items-center justify-center">
                <Text className="font-semibold text-red-600">
                    Student not found.
                </Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-white">
            <ScrollView className="p-4">
                <View className="mb-4 items-center">
                    <Image
                        source={{ uri: student.image }}
                        className="h-24 w-24 rounded-full"
                    />
                    <Text className="mt-2 text-xl font-bold text-gray-800">
                        {student.name}
                    </Text>
                    <Text className="text-gray-500">{student.email}</Text>
                    <Text className="text-gray-500">{student.mobile}</Text>
                </View>

                <Text className="mb-2 text-gray-600">{student.bio}</Text>
                <Text className="mb-1 text-sm text-gray-700">
                    Institution: {student.institution}
                </Text>
                <Text className="mb-4 text-sm text-gray-700">
                    Department: {student.department}, Semester:{' '}
                    {student.semester}
                </Text>

                <Text className="mb-2 text-lg font-semibold text-gray-800">
                    Enrolled Courses
                </Text>
                {student.enrolledCourses.map((course: any) => (
                    <View
                        key={course.courseId}
                        className="mb-2 rounded-lg bg-gray-100 p-3"
                    >
                        <Text className="font-semibold text-gray-800">
                            {course.title}
                        </Text>
                        <Text className="text-sm text-gray-500">
                            Progress: {course.progress}%
                        </Text>
                        <Text className="text-xs text-gray-400">
                            Enrolled on: {course.enrolledDate}
                        </Text>
                    </View>
                ))}

                {/* Logout Button */}
                <TouchableOpacity
                    className="mt-6 items-center rounded-lg bg-red-500 py-3"
                    onPress={handleLogout}
                >
                    <Text className="font-semibold text-white">Logout</Text>
                </TouchableOpacity>
            </ScrollView>

            <BottomNavigationBar />
        </SafeAreaView>
    );
}
