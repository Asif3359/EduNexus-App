import React from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Image,
    FlatList,
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

function TeacherHome() {
    // Sample data - in a real app, this would come from your database/API
    const courses = [
        { id: 1, title: 'Advanced React Native', students: 42, modules: 6 },
        { id: 2, title: 'UI/UX Design Fundamentals', students: 28, modules: 5 },
        { id: 3, title: 'JavaScript Masterclass', students: 56, modules: 8 },
    ];

    const upcomingClasses = [
        {
            id: 1,
            title: 'State Management in React',
            time: 'Today, 3:00 PM',
            course: 'Advanced React Native',
        },
        {
            id: 2,
            title: 'Design Principles',
            time: 'Tomorrow, 10:00 AM',
            course: 'UI/UX Design Fundamentals',
        },
    ];

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
                            Professor Smith
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
                        <TouchableOpacity>
                            <Text className="text-purple-600">See All</Text>
                        </TouchableOpacity>
                    </View>

                    <FlatList
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        data={courses}
                        keyExtractor={item => item.id.toString()}
                        renderItem={({ item }) => (
                            <TouchableOpacity className="mr-4 w-64 rounded-xl bg-white p-4 shadow-sm">
                                <View className="mb-3 flex h-32 items-center justify-center rounded-lg bg-purple-100">
                                    <Ionicons
                                        name="book-outline"
                                        size={48}
                                        color="#9333ea"
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
                        <TouchableOpacity>
                            <Text className="text-purple-600">See All</Text>
                        </TouchableOpacity>
                    </View>

                    <View className="rounded-xl bg-white p-4 shadow-sm">
                        {upcomingClasses.map(classItem => (
                            <TouchableOpacity
                                key={classItem.id}
                                className="mb-3 border-b border-gray-100 pb-3 last:mb-0 last:border-0 last:pb-0"
                            >
                                <View className="flex-row items-start">
                                    <View className="mr-3 rounded-lg bg-purple-100 p-2">
                                        <Ionicons
                                            name="videocam-outline"
                                            size={20}
                                            color="#9333ea"
                                        />
                                    </View>
                                    <View className="flex-1">
                                        <Text className="font-bold">
                                            {classItem.title}
                                        </Text>
                                        <Text className="text-sm text-gray-500">
                                            {classItem.course}
                                        </Text>
                                        <View className="mt-1 flex-row items-center">
                                            <Ionicons
                                                name="time-outline"
                                                size={14}
                                                color="#6b7280"
                                            />
                                            <Text className="ml-1 text-sm text-gray-500">
                                                {classItem.time}
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
                        ))}
                    </View>
                </View>

                {/* Recent Students */}
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
                </View>

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
                        <TouchableOpacity className="mb-4 w-[48%] flex-row items-center rounded-xl bg-white p-4 shadow-sm">
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
