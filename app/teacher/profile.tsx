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
import BottomNavigationBar from '../components/BottomNavigationBar';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Constants from 'expo-constants';
import BottomNavBarTeacher from '../components/BottomNavBarTeacher';

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
                    Alert.alert('Error', 'Missing user ID.');
                    setLoading(false);
                    return;
                }

                const response = await axios.get(
                    `${apiUrl}/teacher/profile/${userId}`,
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
        router.push('/teacher/teacherProfilesetup');
    };

    if (loading) {
        return (
            <SafeAreaView className="flex-1 items-center justify-center">
                <ActivityIndicator size="large" color="#6D28D9" />
            </SafeAreaView>
        );
    }

    if (!teacher) {
        return (
            <SafeAreaView className="flex-1 items-center justify-center">
                <Text className="font-semibold text-red-600">
                    teacher not found.
                </Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-white">
            <ScrollView className="p-4">
                {/* Profile Image and Basic Info */}
                <View className="mb-4 items-center rounded-lg bg-gray-100 p-4">
                    <Image
                        source={{
                            uri:
                                teacher.teacher_profile?.profile_picture ||
                                'https://raw.githubusercontent.com/Asif3359/Asif3359/refs/heads/main/img/10786.jpg',
                        }}
                        className="h-24 w-24 rounded-full border-2 border-gray-300 bg-gray-500"
                        alt="Profile Picture"
                    />
                    <Text className="mt-2 text-xl font-bold text-gray-800">
                        {teacher.name}
                    </Text>
                    <Text className="text-gray-500">{teacher.email}</Text>
                    <Text className="text-gray-500">
                        {teacher.teacher_profile?.mobile}
                    </Text>
                </View>

                {/* Bio */}
                {teacher.teacher_profile?.bio && (
                    <Text className="mb-4 rounded-lg bg-gray-100 p-4 text-gray-600">
                        {teacher.teacher_profile.bio}
                    </Text>
                )}

                {/* Education */}
                {teacher.educations?.length > 0 && (
                    <View className="mb-4">
                        <Text className="mb-1 text-lg font-semibold text-gray-800">
                            Education
                        </Text>
                        {teacher.educations.map((edu: any, index: number) => (
                            <View
                                key={index}
                                className="mb-2 rounded-md bg-gray-100 p-3"
                            >
                                <Text className="font-semibold text-gray-700">
                                    {edu.degree}
                                </Text>
                                <Text className="text-sm text-gray-500">
                                    {edu.institution}
                                </Text>
                                <Text className="text-xs text-gray-400">
                                    Year: {edu.year}
                                </Text>
                            </View>
                        ))}
                    </View>
                )}

                {/* Skills */}
                {teacher.skills?.length > 0 && (
                    <View className="mb-4">
                        <Text className="mb-1 text-lg font-semibold text-gray-800">
                            Skills
                        </Text>
                        <View className="flex-row flex-wrap gap-2 rounded-lg bg-gray-100 p-3">
                            {teacher.skills.map((skill: any, index: number) => (
                                <Text
                                    key={index}
                                    className="rounded-full bg-purple-200 px-3 py-1 text-sm text-purple-800"
                                >
                                    {skill.skill_name}
                                </Text>
                            ))}
                        </View>
                    </View>
                )}

                {/* Interests */}
                {teacher.interests?.length > 0 && (
                    <View className="mb-4">
                        <Text className="mb-1 text-lg font-semibold text-gray-800">
                            Interests
                        </Text>
                        <View className="flex-row flex-wrap gap-2 rounded-lg bg-gray-100 p-3">
                            {teacher.interests.map(
                                (interest: any, index: number) => (
                                    <Text
                                        key={index}
                                        className="rounded-full bg-green-200 px-3 py-1 text-sm text-green-800"
                                    >
                                        {interest.interest_name}
                                    </Text>
                                )
                            )}
                        </View>
                    </View>
                )}

                {/* Social Links */}
                {teacher.social_links?.length > 0 && (
                    <View className="mb-4">
                        <Text className="mb-1 text-lg font-semibold text-gray-800">
                            Social Links
                        </Text>
                        {teacher.social_links.map(
                            (link: any, index: number) => (
                                <TouchableOpacity
                                    key={index}
                                    onPress={() =>
                                        Linking.openURL(link.social_link)
                                    }
                                    className="mb-1 rounded-lg bg-gray-100 p-3"
                                >
                                    <Text className="text-blue-600 underline">
                                        {link.social_link}
                                    </Text>
                                </TouchableOpacity>
                            )
                        )}
                    </View>
                )}
                <TouchableOpacity
                    className="mt-6 items-center rounded-lg bg-blue-500 py-3"
                    onPress={handleSetupProfile}
                >
                    <Text className="font-semibold text-white">
                        Setup Profile
                    </Text>
                </TouchableOpacity>
                {/* Logout Button */}
                <TouchableOpacity
                    className="mt-6 items-center rounded-lg bg-red-500 py-3"
                    onPress={handleLogout}
                >
                    <Text className="font-semibold text-white">Logout</Text>
                </TouchableOpacity>
            </ScrollView>

            <BottomNavBarTeacher />
        </SafeAreaView>
    );
}
