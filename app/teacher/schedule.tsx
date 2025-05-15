import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import React, { useEffect, useState } from 'react';
import {
    SafeAreaView,
    ScrollView,
    Text,
    View,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const Schedule = () => {
    const [scheduledClasses, setScheduledClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const apiUrl = (Constants.expoConfig as any).extra.BACKEND_API;
    const navigation = useNavigation();

    useEffect(() => {
        const fetchScheduledClasses = async () => {
            try {
                const userIdValue = await AsyncStorage.getItem('userId');
                const locationValue =
                    await AsyncStorage.getItem('userLocation');

                const response = await fetch(
                    `${apiUrl}/scheduled-classes/${userIdValue}/?location=${locationValue}`
                );

                if (!response.ok) {
                    throw new Error('Failed to fetch scheduled classes');
                }

                const data = await response.json();
                // console.log('data :', data.scheduled_classes);
                setScheduledClasses(data.scheduled_classes);
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err.message
                        : ('Unknown error' as any)
                );
                console.error('Error fetching classes:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchScheduledClasses();
    }, []);

    const formatDate = (dateString: string | number | Date) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
        });
    };

    const formatTime = (dateString: string | number | Date) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        });
    };

    if (loading) {
        return (
            <SafeAreaView className="flex-1 items-center justify-center bg-gray-50">
                <ActivityIndicator size="large" color="#6366f1" />
            </SafeAreaView>
        );
    }

    if (error) {
        return (
            <SafeAreaView className="flex-1 items-center justify-center bg-gray-50 p-4">
                <View className="w-full max-w-md rounded-xl bg-white p-6 shadow-sm">
                    <Ionicons
                        name="warning"
                        size={48}
                        color="#ef4444"
                        className="mb-4 self-center"
                    />
                    <Text className="mb-2 text-center text-lg font-semibold">
                        Error Loading Classes
                    </Text>
                    <Text className="mb-6 text-center text-gray-600">
                        {error}
                    </Text>
                    <TouchableOpacity
                        className="rounded-lg bg-indigo-600 px-6 py-3"
                        onPress={() => navigation.goBack()}
                    >
                        <Text className="text-center font-medium text-white">
                            Go Back
                        </Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <View className="border-b border-gray-200 bg-white px-4 pb-4 pt-6">
                <Text className="text-2xl font-bold text-gray-900">
                    My Schedule
                </Text>
                <Text className="mt-1 text-gray-500">
                    {scheduledClasses.length} upcoming{' '}
                    {scheduledClasses.length === 1 ? 'class' : 'classes'}
                </Text>
            </View>

            {scheduledClasses.length === 0 ? (
                <View className="flex-1 items-center justify-center p-6">
                    <Ionicons
                        name="calendar-outline"
                        size={48}
                        color="#9ca3af"
                    />
                    <Text className="mt-4 text-center text-lg text-gray-500">
                        No upcoming classes scheduled
                    </Text>
                    <Text className="mt-2 text-center text-gray-400">
                        Your scheduled classes will appear here
                    </Text>
                </View>
            ) : (
                <ScrollView className="flex-1 bg-gray-50 px-4 pb-8 pt-4">
                    {scheduledClasses.map(
                        (classItem: {
                            course_title: string;
                            module_title: string;
                            title: string;
                            duration: string;
                            schedule: string;
                            link: string;
                            id: string;
                        }) => (
                            <View
                                key={classItem.id}
                                className="mb-5 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
                            >
                                {/* Header with course info */}
                                <View className="mb-4">
                                    <Text className="text-xs font-medium uppercase tracking-wider text-indigo-600">
                                        {classItem.course_title} •{' '}
                                        {classItem.module_title}
                                    </Text>
                                </View>

                                {/* Class title and duration */}
                                <View className="mb-5 flex-row items-start justify-between">
                                    <View className="flex-1 pr-4">
                                        <Text className="text-xl font-bold text-gray-900">
                                            {classItem.title}
                                        </Text>
                                        <View className="mt-2 flex-row items-center">
                                            <Ionicons
                                                name="time-outline"
                                                size={16}
                                                color="#6b7280"
                                            />
                                            <Text className="ml-2 text-sm text-gray-600">
                                                {classItem.duration} minutes
                                            </Text>
                                        </View>
                                    </View>
                                    <TouchableOpacity className="p-1">
                                        <Ionicons
                                            name="ellipsis-vertical"
                                            size={18}
                                            color="#9ca3af"
                                        />
                                    </TouchableOpacity>
                                </View>

                                {/* Date and time section */}
                                <View className="mb-5 rounded-xl bg-indigo-50 p-4">
                                    <View className="flex-row items-center">
                                        <Ionicons
                                            name="calendar"
                                            size={20}
                                            color="#6366f1"
                                            className="mr-3"
                                        />
                                        <View>
                                            <Text className="text-sm font-medium text-gray-700">
                                                Scheduled for
                                            </Text>
                                            <Text className="mt-1 text-lg font-semibold text-gray-900">
                                                {formatDate(classItem.schedule)}
                                            </Text>
                                            <Text className="text-indigo-600">
                                                {formatTime(classItem.schedule)}
                                            </Text>
                                        </View>
                                    </View>
                                </View>

                                {/* Meeting link section */}
                                <View className="mb-6">
                                    <Text className="mb-2 text-sm font-medium text-gray-700">
                                        Meeting Link
                                    </Text>
                                    <TouchableOpacity className="flex-row items-center rounded-lg border border-gray-200 bg-gray-50 p-3">
                                        <Ionicons
                                            name="link"
                                            size={18}
                                            color="#6366f1"
                                            className="mr-3"
                                        />
                                        <Text
                                            className="flex-1 text-indigo-600"
                                            numberOfLines={1}
                                            ellipsizeMode="tail"
                                        >
                                            {classItem.link}
                                        </Text>
                                        <Ionicons
                                            name="copy-outline"
                                            size={18}
                                            color="#9ca3af"
                                        />
                                    </TouchableOpacity>
                                </View>

                                {/* Action buttons */}
                                <View className="flex-row space-x-3">
                                    <TouchableOpacity
                                        className="flex-1 items-center rounded-xl bg-indigo-600 px-4 py-3"
                                        onPress={() => {
                                            /* Handle join class */
                                        }}
                                    >
                                        <Text className="font-semibold text-white">
                                            Join Now
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )
                    )}
                </ScrollView>
            )}
        </SafeAreaView>
    );
};

export default Schedule;
