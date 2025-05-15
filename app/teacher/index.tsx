import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Image,
    FlatList,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
    FontAwesome,
    MaterialIcons,
    Feather,
    Ionicons,
    AntDesign,
} from '@expo/vector-icons';
import BottomNavBarTeacher from '../components/BottomNavBarTeacher';
import { router } from 'expo-router';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { convertImageUrl } from '../components/convertImageUrl';
import axios from 'axios';

function TeacherHome() {
    // // Sample data - in a real app, this would come from your database/API
    // const courses = [
    //     { id: 1, title: 'Advanced React Native', students: 42, modules: 6 },
    //     { id: 2, title: 'UI/UX Design Fundamentals', students: 28, modules: 5 },
    //     { id: 3, title: 'JavaScript Masterclass', students: 56, modules: 8 },
    // ];

    const [upcomingClasses, setUpcomingClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [courses, setCourses] = useState<any[]>([]); // Removed Course type since it's not defined
    const [refreshing, setRefreshing] = useState(false);
    const apiUrl = (Constants.expoConfig as any).extra.BACKEND_API;
    const baseUrl = (Constants.expoConfig as any).extra.API_BASE_URL;
    const [teacher, setTeacher] = useState<any>(null);

    useEffect(() => {
        const fetchUpcomingClasses = async () => {
            try {
                const userIdValue = await AsyncStorage.getItem('userId');
                const locationValue =
                    await AsyncStorage.getItem('userLocation');
                const response = await fetch(
                    `${apiUrl}/scheduled-classes/${userIdValue}/?location=${locationValue}`
                );
                if (!response.ok)
                    throw new Error('Failed to fetch upcoming classes');
                const data = await response.json();
                setUpcomingClasses(data.scheduled_classes);
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err.message
                        : ('An error occurred' as any)
                );
            } finally {
                setLoading(false);
            }
        };
        fetchUpcomingClasses();
        fetchCourses();
        fetchTeacherProfile();
    }, []);

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
        }
    };

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

    const recentStudents = [
        { id: 1, name: 'Alice Johnson', course: 'JavaScript Masterclass' },
        { id: 2, name: 'Bob Smith', course: 'UI/UX Design Fundamentals' },
        { id: 3, name: 'Charlie Brown', course: 'Advanced React Native' },
    ];

    const stats = {
        totalStudents: 126,
        totalCourses: 3,
        totalEarnings: 2450.5,
        rating: 4.8,
    };

    const handleCourseList = async () => {
        router.push('/teacher/courseList');
    };

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <ScrollView className="mb-24 px-4 pt-4">
                {/* Header with welcome and notifications */}
                <View className="mb-6 flex-row items-center justify-between">
                    <View>
                        <Text className="text-lg text-gray-600">
                            Welcome back,
                        </Text>
                        <Text className="text-2xl font-bold">
                            Professor {teacher?.name}
                        </Text>
                    </View>
                    <TouchableOpacity className="rounded-full bg-white p-3 shadow-sm">
                        <Ionicons
                            name="notifications-outline"
                            size={24}
                            color="#6b7280"
                        />
                    </TouchableOpacity>
                </View>

                {/* Quick Stats Cards */}
                <View className="mb-6 flex-row flex-wrap justify-between">
                    <View className="mb-4 w-[48%] rounded-xl bg-white p-4 shadow-sm">
                        <Text className="text-sm text-gray-500">
                            Total Students
                        </Text>
                        <Text className="text-2xl font-bold text-purple-600">
                            {stats.totalStudents}
                        </Text>
                    </View>
                    <View className="mb-4 w-[48%] rounded-xl bg-white p-4 shadow-sm">
                        <Text className="text-sm text-gray-500">
                            Total Courses
                        </Text>
                        <Text className="text-2xl font-bold text-blue-600">
                            {stats.totalCourses}
                        </Text>
                    </View>
                    <View className="w-[48%] rounded-xl bg-white p-4 shadow-sm">
                        <Text className="text-sm text-gray-500">
                            Total Earnings
                        </Text>
                        <Text className="text-2xl font-bold text-green-600">
                            ${stats.totalEarnings.toFixed(2)}
                        </Text>
                    </View>
                    <View className="w-[48%] rounded-xl bg-white p-4 shadow-sm">
                        <Text className="text-sm text-gray-500">
                            Your Rating
                        </Text>
                        <View className="flex-row items-center">
                            <Text className="text-2xl font-bold text-yellow-600">
                                {stats.rating}
                            </Text>
                            <AntDesign
                                name="star"
                                size={20}
                                color="#d97706"
                                className="ml-1"
                            />
                        </View>
                    </View>
                </View>

                {/* Your Courses Section */}
                <View className="mb-6">
                    <View className="mb-3 flex-row items-center justify-between">
                        <Text className="text-xl font-bold">Your Courses</Text>
                        <TouchableOpacity
                            onPress={() => router.push('/teacher/courseList')}
                        >
                            <Text className="text-purple-600">See All</Text>
                        </TouchableOpacity>
                    </View>

                    <FlatList
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        data={courses.slice(0, 3)}
                        keyExtractor={item => item.id.toString()}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                onPress={() =>
                                    router.push({
                                        pathname: '/course/[id]',
                                        params: { id: item.id },
                                    })
                                }
                                className="mr-4 w-64 rounded-xl bg-white p-4 shadow-sm"
                            >
                                <View className="mb-3 flex h-32 items-center justify-center rounded-lg bg-purple-100">
                                    {/* <Ionicons
                                        name="book-outline"
                                        size={48}
                                        color="#9333ea"
                                    /> */}
                                    <Image
                                        source={{
                                            uri: convertImageUrl(
                                                item.thumbnail,
                                                baseUrl
                                            ),
                                        }}
                                        className="h-full w-full"
                                    />
                                </View>
                                <Text className="mb-1 text-lg font-bold">
                                    {item.title}
                                </Text>
                                <View className="flex-row justify-between">
                                    <Text className="text-gray-500">
                                        {item.students} students
                                    </Text>
                                    <Text className="text-gray-500">
                                        {item.modules} modules
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        )}
                    />
                </View>

                {/* Upcoming Live Classes */}
                <View className="mb-6">
                    <View className="mb-3 flex-row items-center justify-between">
                        <Text className="text-xl font-bold">
                            Upcoming Classes
                        </Text>
                        <TouchableOpacity
                            onPress={() => router.push('/teacher/schedule')}
                        >
                            <Text className="text-purple-600">See All</Text>
                        </TouchableOpacity>
                    </View>

                    <View className="rounded-xl bg-white p-4 shadow-sm">
                        {loading ? (
                            <Text>Loading...</Text>
                        ) : error ? (
                            <Text className="text-red-500">{error}</Text>
                        ) : upcomingClasses.length === 0 ? (
                            <Text className="text-gray-500">
                                No upcoming classes
                            </Text>
                        ) : (
                            upcomingClasses
                                .slice(0, 3)
                                .map((classItem: any) => (
                                    <TouchableOpacity
                                        key={classItem.id}
                                        className="mb-3 border-b border-gray-100 pb-3 last:mb-0 last:border-0 last:pb-0"
                                    >
                                        <View className="mb-2 flex-row items-start py-2">
                                            <View className="mr-3 rounded-lg bg-purple-100 p-2">
                                                <Ionicons
                                                    name="videocam-outline"
                                                    size={20}
                                                    color="#9333ea"
                                                />
                                            </View>
                                            <View className="flex-1">
                                                <View className="">
                                                    <Text className="text-xs font-medium uppercase tracking-wider text-indigo-600">
                                                        {classItem.course_title}{' '}
                                                        •{' '}
                                                        {classItem.module_title}
                                                    </Text>
                                                </View>
                                                <Text className="font-bold">
                                                    {classItem.title}
                                                </Text>
                                                <View className="mt-1 flex-row items-center">
                                                    <Ionicons
                                                        name="time-outline"
                                                        size={14}
                                                        color="#6b7280"
                                                    />
                                                    <Text className="ml-1 text-sm text-gray-500">
                                                        {new Date(
                                                            classItem.schedule
                                                        ).toLocaleString()}
                                                    </Text>
                                                </View>
                                            </View>
                                            <TouchableOpacity className="p-2">
                                                <Ionicons
                                                    name="ellipsis-vertical"
                                                    size={16}
                                                    color="#6b7280"
                                                />
                                            </TouchableOpacity>
                                        </View>
                                    </TouchableOpacity>
                                ))
                        )}
                    </View>
                </View>

                {/* Recent Students
                <View className="mb-6">
                    <View className="mb-3 flex-row items-center justify-between">
                        <Text className="text-xl font-bold">
                            Recent Students
                        </Text>
                        <TouchableOpacity>
                            <Text className="text-purple-600">See All</Text>
                        </TouchableOpacity>
                    </View>

                    <View className="rounded-xl bg-white p-4 shadow-sm">
                        {recentStudents.map(student => (
                            <TouchableOpacity
                                key={student.id}
                                className="mb-3 flex-row items-center border-b border-gray-100 pb-3 last:mb-0 last:border-0 last:pb-0"
                            >
                                <View className="mr-3 h-10 w-10 overflow-hidden rounded-full bg-gray-200">
                                    <Image
                                        source={{
                                            uri:
                                                'https://randomuser.me/api/portraits/men/' +
                                                student.id +
                                                '.jpg',
                                        }}
                                        className="h-full w-full"
                                    />
                                </View>
                                <View className="flex-1">
                                    <Text className="font-bold">
                                        {student.name}
                                    </Text>
                                    <Text className="text-sm text-gray-500">
                                        {student.course}
                                    </Text>
                                </View>
                                <TouchableOpacity className="p-2">
                                    <Ionicons
                                        name="chatbox-ellipses-outline"
                                        size={20}
                                        color="#9333ea"
                                    />
                                </TouchableOpacity>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View> */}

                {/* Quick Actions */}
                <View className="mb-6">
                    <Text className="mb-3 text-xl font-bold">
                        Quick Actions
                    </Text>
                    <View className="flex-row flex-wrap justify-between">
                        <TouchableOpacity
                            className="mb-4 w-[48%] flex-row items-center rounded-xl bg-white p-4 shadow-sm"
                            onPress={handleCourseList}
                        >
                            <View className="mr-3 rounded-lg bg-purple-100 p-2">
                                <MaterialIcons
                                    name="add-circle-outline"
                                    size={20}
                                    color="#9333ea"
                                />
                            </View>
                            <Text className="font-medium">Course List</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => router.push('/teacher/schedule')}
                            className="mb-4 w-[48%] flex-row items-center rounded-xl bg-white p-4 shadow-sm"
                        >
                            <View className="mr-3 rounded-lg bg-blue-100 p-2">
                                <Ionicons
                                    name="videocam-outline"
                                    size={20}
                                    color="#2563eb"
                                />
                            </View>
                            <Text className="font-medium">Schedule Class</Text>
                        </TouchableOpacity>
                        <TouchableOpacity className="w-[48%] flex-row items-center rounded-xl bg-white p-4 shadow-sm">
                            <View className="mr-3 rounded-lg bg-green-100 p-2">
                                <Ionicons
                                    name="analytics-outline"
                                    size={20}
                                    color="#059669"
                                />
                            </View>
                            <Text className="font-medium">View Analytics</Text>
                        </TouchableOpacity>
                        <TouchableOpacity className="w-[48%] flex-row items-center rounded-xl bg-white p-4 shadow-sm">
                            <View className="mr-3 rounded-lg bg-yellow-100 p-2">
                                <Ionicons
                                    name="document-text-outline"
                                    size={20}
                                    color="#d97706"
                                />
                            </View>
                            <Text className="font-medium">View Reports</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>

            <BottomNavBarTeacher />
        </SafeAreaView>
    );
}

export default TeacherHome;
