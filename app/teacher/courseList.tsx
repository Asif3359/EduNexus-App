import React, { useEffect, useState } from 'react';
import {
    SafeAreaView,
    ScrollView,
    View,
    Text,
    TouchableOpacity,
    Image,
    ActivityIndicator,
    RefreshControl,
    Alert,
} from 'react-native';
import Constants from 'expo-constants';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { convertImageUrl } from '../components/convertImageUrl';
import {
    Ionicons,
    MaterialIcons,
    FontAwesome,
    MaterialCommunityIcons,
} from '@expo/vector-icons';

interface Course {
    id: number;
    title: string;
    description: string;
    price: number;
    thumbnail: string | null;
    created_at: string;
    teacher: {
        name: string;
        email: string;
    };
}

function CourseList() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const apiUrl = (Constants.expoConfig as any).extra.BACKEND_API;
    const baseUrl = (Constants.expoConfig as any).extra.API_BASE_URL;

    const fetchCourses = async () => {
        try {
            const userLocation =
                (await AsyncStorage.getItem('userLocation')) || 'Khulna';

            const response = await fetch(
                `${apiUrl}/courses?location=${encodeURIComponent(userLocation)}`
            );
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch courses');
            }

            setCourses(data.courses);
        } catch (error) {
            console.error('Error fetching courses:', error);
            Alert.alert('Error', 'Failed to load courses. Please try again.');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const handleRefresh = () => {
        setRefreshing(true);
        fetchCourses();
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    if (loading) {
        return (
            <SafeAreaView className="flex-1 items-center justify-center bg-gray-50">
                <ActivityIndicator size="large" color="#6366f1" />
                <Text className="mt-4 font-medium text-indigo-600">
                    Loading courses...
                </Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            {/* Header */}
            <View className="rounded-b-3xl bg-indigo-600 px-6 py-6 shadow-lg">
                <View className="flex-row items-center justify-between">
                    <View>
                        <Text className="text-2xl font-bold text-white">
                            Course Catalog
                        </Text>
                        <Text className="mt-1 text-indigo-100">
                            Discover your next learning journey
                        </Text>
                    </View>
                    <TouchableOpacity onPress={handleRefresh} className="p-2">
                        <Ionicons name="refresh" size={24} color="white" />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView
                className="flex-1 px-5 pt-6"
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                        colors={['#6366f1']}
                    />
                }
            >
                {courses.length > 0 ? (
                    <View className="space-y-5 pb-6">
                        {courses.map(course => (
                            <TouchableOpacity
                                key={course.id}
                                className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm shadow-indigo-100"
                                activeOpacity={0.9}
                                onPress={() =>
                                    router.push(`/course/${course.id}`)
                                }
                            >
                                <View className="h-36 flex-row">
                                    <Image
                                        source={{
                                            uri:
                                                convertImageUrl(
                                                    course.thumbnail,
                                                    baseUrl
                                                ) ||
                                                'https://images.unsplash.com/photo-1541178735493-479c1a27ed24?q=80&w=1471&auto=format&fit=crop',
                                        }}
                                        className="h-full w-1/3"
                                        resizeMode="cover"
                                    />
                                    <View className="flex-1 p-4">
                                        <Text
                                            className="text-lg font-bold text-gray-800"
                                            numberOfLines={1}
                                        >
                                            {course.title}
                                        </Text>

                                        <View className="mt-1 flex-row items-center">
                                            <MaterialIcons
                                                name="person-outline"
                                                size={14}
                                                color="#6b7280"
                                            />
                                            <Text className="ml-1 text-xs text-gray-500">
                                                {course.teacher?.name ||
                                                    'Unknown Teacher'}
                                            </Text>
                                        </View>

                                        <Text
                                            className="mt-2 text-sm text-gray-500"
                                            numberOfLines={2}
                                        >
                                            {course.description}
                                        </Text>

                                        <View className="mt-4 flex-row items-center justify-between">
                                            <View className="flex-row items-center">
                                                <FontAwesome
                                                    name="dollar"
                                                    size={14}
                                                    color="#10b981"
                                                />
                                                <Text className="ml-1 text-base font-bold text-emerald-600">
                                                    {course.price}
                                                </Text>
                                            </View>

                                            <View className="flex-row items-center">
                                                <MaterialCommunityIcons
                                                    name="clock-outline"
                                                    size={14}
                                                    color="#9ca3af"
                                                />
                                                <Text className="ml-1 text-xs text-gray-400">
                                                    {new Date(
                                                        course.created_at
                                                    ).toLocaleDateString()}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                ) : (
                    <View className="items-center py-16">
                        <Ionicons
                            name="book-outline"
                            size={48}
                            color="#d1d5db"
                        />
                        <Text className="mt-4 text-lg text-gray-400">
                            No courses available
                        </Text>
                        <TouchableOpacity
                            className="mt-4 rounded-full bg-indigo-100 px-6 py-2"
                            onPress={handleRefresh}
                        >
                            <Text className="font-medium text-indigo-600">
                                Refresh
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}
            </ScrollView>

            {/* Floating Action Button */}
            <TouchableOpacity
                className="absolute bottom-6 right-6 flex-row items-center justify-center rounded-full bg-indigo-600 p-5 shadow-xl shadow-indigo-400/30"
                onPress={() => router.push('/teacher/createCourse')}
                activeOpacity={0.8}
            >
                <Ionicons name="add" size={28} color="white" />
            </TouchableOpacity>
        </SafeAreaView>
    );
}

export default CourseList;
