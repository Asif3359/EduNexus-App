/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import {
    Text,
    View,
    TextInput,
    TouchableOpacity,
    FlatList,
    Image,
    SafeAreaView,
    ActivityIndicator,
    ScrollView,
} from 'react-native';
import { FontAwesome, Feather, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import WebView from 'react-native-webview';
import BottomNavigationBar from '../components/BottomNavigationBar';
import { convertImageUrl } from '../components/convertImageUrl';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

export default function CourseScreen() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [courses, setCourses] = useState<any[]>([]);
    const [filteredCourses, setFilteredCourses] = useState<any[]>([]);
    const [categories, setCategories] = useState<string[]>(['All']);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const [userLocation, setUserLocation] = useState<string | null>(null);
    const apiUrl = (Constants.expoConfig as any).extra.BACKEND_API;
    const baseuri = (Constants.expoConfig as any).extra.API_BASE_URL;

    const getUserLocation = async () => {
        const userLocation = await AsyncStorage.getItem('userLocation');
        if (userLocation) {
            setUserLocation(userLocation);
        }
    };

    useEffect(() => {
        fetchAllData();
        getUserLocation();
    }, []);

    useEffect(() => {
        filterCourses();
    }, [searchQuery, selectedCategory, courses]);

    const fetchAllData = async () => {
        try {
            setLoading(true);
            setError(null);

            const [coursesRes, categoriesRes] = await Promise.all([
                fetch(`${apiUrl}/courses/all`),
                fetch(`${apiUrl}/courses/categories`),
            ]);

            if (!coursesRes.ok || !categoriesRes.ok) {
                throw new Error('Failed to fetch data');
            }

            const [coursesData, categoriesData] = await Promise.all([
                coursesRes.json(),
                categoriesRes.json(),
            ]);

            // Debug logs to verify data structure
            console.log(
                'Courses data teacher email:',
                coursesData[0].teacherEmail
            );
            console.log('Categories data:', categoriesData);

            setCourses(coursesData);

            // Process categories to ensure they're clean strings
            const cleanedCategories = categoriesData
                .map((cat: any) => (cat ? cat.toString().trim() : ''))
                .filter((cat: string) => cat !== '');

            setCategories(['All', ...cleanedCategories]);
        } catch (err: unknown) {
            console.error('Error fetching data:', err);
            setError(
                err instanceof Error ? err.message : 'An unknown error occurred'
            );
        } finally {
            setLoading(false);
        }
    };

    const filterCourses = () => {
        console.log('Filtering courses...');
        console.log('Selected category:', selectedCategory);

        let filtered = [...courses];
        console.log('Filtered courses:', filtered);

        // Filter by category if not 'All'
        if (selectedCategory !== 'All') {
            filtered = filtered.filter(course => {
                const courseCategory = course.category
                    ? course.category.toString().trim().toLowerCase()
                    : '';
                const selectedCat = selectedCategory.trim().toLowerCase();
                return courseCategory === selectedCat;
            });
        }

        // Filter by search query if provided
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(course => {
                const title = course.title ? course.title.toLowerCase() : '';
                const instructor = course.instructor
                    ? course.instructor.toLowerCase()
                    : '';
                const description = course.description
                    ? course.description.toLowerCase()
                    : '';

                return (
                    title.includes(query) ||
                    instructor.includes(query) ||
                    description.includes(query)
                );
            });
        }

        console.log('Filtered courses:', filtered);
        setFilteredCourses(filtered);
    };

    const handleAuthorPress = (email: string) => {
        router.push({
            pathname: '/teacher/InstructorProfile',
            params: { email },
        });
    };

    const renderCourse = ({ item }: any) => (
        <View className="mb-6 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            {/* Thumbnail Image */}
            {item.thumbnail ? (
                <Image
                    source={{ uri: item.thumbnail }}
                    className="mb-3 h-40 w-full rounded-xl"
                    resizeMode="cover"
                />
            ) : (
                <View className="mb-3 h-40 w-full items-center justify-center rounded-xl bg-gray-100">
                    <Text className="text-gray-500">
                        No thumbnail available
                    </Text>
                </View>
            )}

            {/* Course Title */}
            <TouchableOpacity
                onPress={() =>
                    router.push({
                        pathname: '/user/[location]/[id]',
                        params: {
                            location: userLocation || '',
                            id: item.id,
                            teacherEmail: item.teacherEmail,
                        },
                    })
                }
            >
                <Text
                    className="mb-1 text-lg font-bold text-gray-900"
                    numberOfLines={2}
                >
                    {item.title}
                </Text>
            </TouchableOpacity>

            {/* Instructor and Location */}
            <View className="mb-2 flex-row items-center justify-between">
                <TouchableOpacity onPress={() => handleAuthorPress(item.email)}>
                    <Text className="text-sm text-purple-600" numberOfLines={1}>
                        {item.instructor}
                    </Text>
                </TouchableOpacity>
                <Text className="text-xs text-gray-500">{item.location}</Text>
            </View>

            {/* Category */}
            <View className="mb-2 flex-row items-center">
                <Feather name="tag" size={14} color="#6b7280" />
                <Text className="ml-1 text-sm text-gray-600">
                    {item.category}
                </Text>
            </View>

            {/* Rating and Price */}
            <View className="flex-row items-center justify-between">
                <View className="flex-row items-center space-x-1">
                    <FontAwesome name="star" size={14} color="#f59e0b" />
                    <Text className="text-sm text-gray-800">
                        {item.rating || 'N/A'}
                    </Text>
                </View>

                <View className="flex-row items-center space-x-1">
                    <MaterialIcons
                        name="attach-money"
                        size={16}
                        color="#9333ea"
                    />
                    <Text className="text-sm font-semibold text-purple-700">
                        ${Number(item.price || 0).toFixed(2)}
                    </Text>
                </View>
            </View>

            {/* Buy Now Button */}
            <TouchableOpacity
                className="mt-4 rounded-lg bg-purple-600 py-2.5"
                onPress={() =>
                    router.push({
                        pathname: '/user/[location]/[id]',
                        params: {
                            location: userLocation || '',
                            id: item.id,
                            teacherEmail: item.teacherEmail,
                        },
                    })
                }
            >
                <Text className="text-center text-sm font-semibold text-white">
                    Buy Now
                </Text>
            </TouchableOpacity>
        </View>
    );

    if (loading) {
        return (
            <SafeAreaView className="flex-1 items-center justify-center bg-gray-50">
                <ActivityIndicator size="large" color="#9333ea" />
                <Text className="mt-4 text-gray-700">Loading courses...</Text>
            </SafeAreaView>
        );
    }

    if (error) {
        return (
            <SafeAreaView className="flex-1 items-center justify-center bg-gray-50">
                <Text className="text-red-500">{error}</Text>
                <TouchableOpacity
                    className="mt-4 rounded-lg bg-purple-600 px-6 py-2.5"
                    onPress={fetchAllData}
                >
                    <Text className="text-white">Retry</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <View className="px-4 pt-4">
                <Text className="text-2xl font-bold text-gray-900">
                    Courses
                </Text>
                <Text className="mb-4 text-sm text-gray-500">
                    Browse your learning path
                </Text>

                {/* Search Bar */}
                <View className="mb-4 flex-row items-center rounded-full bg-white px-4 py-2 shadow-sm">
                    <Feather name="search" size={16} color="#9ca3af" />
                    <TextInput
                        placeholder="Search courses..."
                        className="ml-2 flex-1 text-sm text-gray-800"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        placeholderTextColor="#9ca3af"
                    />
                </View>

                {/* Categories */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    className="mb-4"
                    contentContainerStyle={{ paddingRight: 16 }}
                >
                    {categories.map(category => (
                        <TouchableOpacity
                            key={category}
                            className={`mr-2 rounded-full border px-4 py-1.5 ${
                                selectedCategory === category
                                    ? 'border-purple-600 bg-purple-600'
                                    : 'border-gray-300 bg-white'
                            }`}
                            onPress={() => setSelectedCategory(category)}
                        >
                            <Text
                                className={`text-xs font-medium ${
                                    selectedCategory === category
                                        ? 'text-white'
                                        : 'text-gray-800'
                                }`}
                            >
                                {category}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* Course List */}
            {filteredCourses.length === 0 ? (
                <View className="flex-1 items-center justify-center px-4">
                    <Text className="text-gray-500">No courses found</Text>
                    <TouchableOpacity
                        className="mt-2 rounded-lg bg-purple-100 px-4 py-2"
                        onPress={() => {
                            setSearchQuery('');
                            setSelectedCategory('All');
                        }}
                    >
                        <Text className="text-sm text-purple-700">
                            Reset filters
                        </Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <FlatList
                    data={filteredCourses}
                    keyExtractor={item => item.id.toString()}
                    renderItem={renderCourse}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{
                        paddingHorizontal: 16,
                        paddingBottom: 100,
                    }}
                />
            )}

            <BottomNavigationBar />
        </SafeAreaView>
    );
}
