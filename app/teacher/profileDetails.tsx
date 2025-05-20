import React, { useEffect, useState } from 'react';
import {
    SafeAreaView,
    Text,
    View,
    Image,
    ScrollView,
    ActivityIndicator,
    TouchableOpacity,
    Linking,
    Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Constants from 'expo-constants';
import { Ionicons } from '@expo/vector-icons';

function ProfileDetails() {
    const [teacher, setTeacher] = useState<any>(null);
    const [loading, setLoading] = useState(true);
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
                    Teacher profile not found
                </Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-white">
            <ScrollView
                className="px-4 py-4"
                contentContainerStyle={{ paddingBottom: 40 }}
            >
                {/* Profile Header */}
                <View className="mb-6 items-center">
                    <Image
                        source={{
                            uri: teacher.teacher_profile?.profile_picture,
                        }}
                        className="h-32 w-32 rounded-full border-4 border-purple-100"
                    />
                    <Text className="mt-4 text-2xl font-bold text-gray-800">
                        {teacher.name}
                    </Text>
                    <Text className="mt-1 text-base text-gray-500">
                        {teacher.email}
                    </Text>
                    <Text className="mt-1 text-base text-gray-500">
                        {teacher.teacher_profile?.mobile}
                    </Text>
                    <Text className="mt-1 text-base text-gray-500">
                        {teacher.Location}
                    </Text>
                </View>

                {/* Bio Section */}
                <View className="mb-6 rounded-xl bg-gray-50 p-4">
                    <Text className="text-center italic text-gray-600">
                        "{teacher.teacher_profile?.bio}"
                    </Text>
                </View>

                {/* Education Section */}
                <View className="mb-6">
                    <Text className="mb-3 text-xl font-bold text-gray-800">
                        Education
                    </Text>
                    {teacher.educations?.map((edu: any, index: number) => (
                        <View
                            key={index}
                            className="mb-4 rounded-xl bg-gray-50 p-4"
                        >
                            <Text className="text-lg font-semibold text-gray-800">
                                {edu.degree}
                            </Text>
                            <Text className="text-gray-600">
                                {edu.institution}
                            </Text>
                            <Text className="mt-1 text-sm text-gray-500">
                                Year: {edu.year}
                            </Text>
                            <Text className="mt-2 text-gray-700">
                                {edu.description}
                            </Text>
                        </View>
                    ))}
                </View>

                {/* Skills Section */}
                <View className="mb-6">
                    <Text className="mb-3 text-xl font-bold text-gray-800">
                        Skills
                    </Text>
                    <View className="flex-row flex-wrap gap-2">
                        {teacher.skills?.map((skill: any, index: number) => (
                            <View
                                key={index}
                                className="rounded-full bg-purple-100 px-3 py-1"
                            >
                                <Text className="text-purple-800">
                                    {skill.skill_name}
                                </Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Interests Section */}
                <View className="mb-6">
                    <Text className="mb-3 text-xl font-bold text-gray-800">
                        Interests
                    </Text>
                    <View className="flex-row flex-wrap gap-2">
                        {teacher.interests?.map(
                            (interest: any, index: number) => (
                                <View
                                    key={index}
                                    className="rounded-full bg-green-100 px-3 py-1"
                                >
                                    <Text className="text-green-800">
                                        {interest.interest_name}
                                    </Text>
                                </View>
                            )
                        )}
                    </View>
                </View>

                {/* Social Links Section */}
                <View className="mb-6">
                    <Text className="mb-3 text-xl font-bold text-gray-800">
                        Social Links
                    </Text>
                    {teacher.social_links?.map((link: any, index: number) => (
                        <TouchableOpacity
                            key={index}
                            className="mb-2 rounded-lg bg-blue-50 p-3"
                            onPress={() => Linking.openURL(link.social_link)}
                        >
                            <Text className="text-blue-600 underline">
                                {link.social_link}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

export default ProfileDetails;
