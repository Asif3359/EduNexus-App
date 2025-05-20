import {
    Text,
    View,
    Image,
    ScrollView,
    ActivityIndicator,
    TouchableOpacity,
    Alert,
    SafeAreaView,
    Linking,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Constants from 'expo-constants';
import BottomNavigationBar from '../components/BottomNavigationBar';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
    const [teacher, setTeacher] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const apiUrl = (Constants.expoConfig as any).extra.BACKEND_API;

    useEffect(() => {
        const fetchTeacherProfile = async () => {
            try {
                const userId = await AsyncStorage.getItem('userId');
                const userLocation = await AsyncStorage.getItem('userLocation');
                if (!userId) {
                    router.push('/login');
                    setLoading(false);
                    return;
                }

                const response = await axios.get(
                    `${apiUrl}/student/profile/${userId}`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            Accept: 'application/json',
                            Location: userLocation,
                        },
                    }
                );

                if (response.data.success) {
                    setTeacher(response.data.data);
                } else {
                    Alert.alert(
                        'Error',
                        response.data.message || 'Failed to fetch profile.'
                    );
                }
            } catch (error) {
                console.error('Profile fetch error:', error);
                Alert.alert(
                    'Error',
                    'An error occurred while fetching the profile.'
                );
            } finally {
                setLoading(false);
            }
        };

        fetchTeacherProfile();
    }, []);

    const handleLogout = async () => {
        Alert.alert('Confirm Logout', 'Are you sure you want to logout?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Logout',
                style: 'destructive',
                onPress: async () => {
                    try {
                        await AsyncStorage.clear();
                        await AsyncStorage.setItem('isFirstTime', 'false');
                        router.replace('/login');
                    } catch (error) {
                        Alert.alert(
                            'Logout Failed',
                            'Failed to logout properly.'
                        );
                    }
                },
            },
        ]);
    };

    const handleSetupProfile = () => {
        router.push('/user/studentProfilesetup');
    };

    const handleGoToHome = () => {
        router.push('/user');
    };

    const handleGoToCourses = () => {
        router.push('/user/cource');
    };

    const handleGoToSchedule = () => {
        router.push('/user/schedule');
    };

    const handleGoToMyCourses = () => {
        router.push('/user/myCourses');
    };

    const handleGoToAnalytics = () => {
        router.push('/user/analytics');
    };
    const handleApplyForTeacher = async () => {
        router.push('/payment/paymentScreen');
    };

    if (loading) {
        return (
            <SafeAreaView className="flex-1 items-center justify-center bg-white">
                <ActivityIndicator size="large" color="#6D28D9" />
            </SafeAreaView>
        );
    }

    if (!teacher) {
        return (
            <SafeAreaView className="flex-1 items-center justify-center bg-white">
                <Text className="text-lg font-semibold text-red-600">
                    Teacher not found
                </Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-white">
            <ScrollView
                className="px-4 py-4"
                contentContainerStyle={{ paddingBottom: 80 }}
            >
                {/* Profile Header */}
                <View className="mb-6 items-center">
                    <Image
                        source={{
                            uri:
                                teacher.student_profile?.profile_picture ||
                                'https://raw.githubusercontent.com/Asif3359/Asif3359/refs/heads/main/img/10786.jpg',
                        }}
                        className="h-32 w-32 rounded-full border-4 border-gray-100"
                    />
                    <Text className="mt-4 text-2xl font-bold text-gray-800">
                        {teacher.name}
                    </Text>
                    <Text className="mt-1 text-base text-gray-500">
                        {teacher.email}
                    </Text>
                    <Text className="mt-1 text-base text-gray-500">
                        {teacher.student_profile?.mobile || 'No mobile number'}
                    </Text>
                </View>

                {/* Bio Section */}
                <View className="mb-6 rounded-xl p-4">
                    <Text className="text-start italic text-gray-600">
                        "{teacher.student_profile?.bio || 'No bio provided'}"
                    </Text>
                </View>

                {/* Action Buttons */}
                <View className="space-y-2">
                    <TouchableOpacity
                        className="mb-3 flex-row items-center justify-between rounded-lg border border-gray-200 bg-white p-4"
                        onPress={() => router.push('/user/profileDetails')}
                    >
                        <Text className="text-base font-medium text-gray-800">
                            See profile details
                        </Text>
                        <Ionicons
                            name="chevron-forward"
                            size={20}
                            color="#9ca3af"
                        />
                    </TouchableOpacity>

                    <TouchableOpacity
                        className="mb-3 flex-row items-center justify-between rounded-lg border border-gray-200 bg-white p-4"
                        onPress={handleSetupProfile}
                    >
                        <Text className="text-base font-medium text-gray-800">
                            Set up profile
                        </Text>
                        <Ionicons
                            name="chevron-forward"
                            size={20}
                            color="#9ca3af"
                        />
                    </TouchableOpacity>

                    <TouchableOpacity
                        className="mb-3 flex-row items-center justify-between rounded-lg border border-gray-200 bg-white p-4"
                        onPress={handleGoToHome}
                    >
                        <Text className="text-base font-medium text-gray-800">
                            Go to home
                        </Text>
                        <Ionicons
                            name="chevron-forward"
                            size={20}
                            color="#9ca3af"
                        />
                    </TouchableOpacity>

                    <TouchableOpacity
                        className="mb-3 flex-row items-center justify-between rounded-lg border border-gray-200 bg-white p-4"
                        onPress={handleGoToCourses}
                    >
                        <Text className="text-base font-medium text-gray-800">
                            Go to course
                        </Text>
                        <Ionicons
                            name="chevron-forward"
                            size={20}
                            color="#9ca3af"
                        />
                    </TouchableOpacity>

                    <TouchableOpacity
                        className="mb-3 flex-row items-center justify-between rounded-lg border border-gray-200 bg-white p-4"
                        onPress={handleGoToSchedule}
                    >
                        <Text className="text-base font-medium text-gray-800">
                            Go to schedule
                        </Text>
                        <Ionicons
                            name="chevron-forward"
                            size={20}
                            color="#9ca3af"
                        />
                    </TouchableOpacity>

                    <TouchableOpacity
                        className="mb-3 flex-row items-center justify-between rounded-lg border border-gray-200 bg-white p-4"
                        onPress={handleGoToMyCourses}
                    >
                        <Text className="text-base font-medium text-gray-800">
                            My Courses
                        </Text>
                        <Ionicons
                            name="chevron-forward"
                            size={20}
                            color="#9ca3af"
                        />
                    </TouchableOpacity>

                    <TouchableOpacity
                        className="mb-3 flex-row items-center justify-between rounded-lg border border-gray-200 bg-white p-4"
                        onPress={handleApplyForTeacher}
                    >
                        <Text className="text-base font-medium text-green-600">
                            Apply for teacher
                        </Text>
                        <Ionicons
                            name="chevron-forward"
                            size={20}
                            color="#9ca3af"
                        />
                    </TouchableOpacity>

                    <TouchableOpacity
                        className="mb-3 flex-row items-center justify-between rounded-lg border border-red-200 bg-white p-4"
                        onPress={handleLogout}
                    >
                        <Text className="text-base font-medium text-red-600">
                            Logout
                        </Text>
                        <Ionicons
                            name="log-out-outline"
                            size={20}
                            color="#dc2626"
                        />
                    </TouchableOpacity>
                </View>
            </ScrollView>

            <BottomNavigationBar />
        </SafeAreaView>
    );
}
