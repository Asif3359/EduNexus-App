import React, { useState, useEffect } from 'react';
import {
    Text,
    View,
    TextInput,
    TouchableOpacity,
    FlatList,
    Image,
} from 'react-native';
import coursesData from '@/assets/data/courseDetails.json';
import { FontAwesome, Feather, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import WebView from 'react-native-webview';
import BottomNavigationBar from '../components/BottomNavigationBar';

export default function CourseScreen() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [filteredCourses, setFilteredCourses] = useState(coursesData);
    const [categories, setCategories] = useState<string[]>(['All']);
    const router = useRouter();

    useEffect(() => {
        extractCategories();
        filterCourses();
    }, [searchQuery, selectedCategory]);

    const extractCategories = () => {
        const uniqueCategories = Array.from(
            new Set(coursesData.map(course => course.category))
        );
        setCategories(['All', ...uniqueCategories]);
    };

    const filterCourses = () => {
        let filtered = coursesData;

        if (selectedCategory !== 'All') {
            filtered = filtered.filter(
                course => course.category === selectedCategory
            );
        }

        if (searchQuery) {
            filtered = filtered.filter(course =>
                course.title.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        setFilteredCourses(filtered);
    };

    const handleAuthorPress = (email: string) => {
        router.push({
            pathname: '/teacher/InstructorProfile',
            params: { email },
        });
    };

    const renderCourse = ({ item }: any) => (
        <View className="mb-6 rounded-2xl border border-purple-100 bg-white p-4 shadow-xl">
            {/* WebView instead of image */}
            <View className="mb-3 overflow-hidden rounded-xl">
                <WebView
                    source={{ uri: item.modules[0].videos[0].url }}
                    style={{ height: 200, width: '100%' }}
                    allowsInlineMediaPlayback={true}
                    mediaPlaybackRequiresUserAction={false}
                    allowsFullscreenVideo={true}
                    javaScriptEnabled={true}
                />
            </View>

            {/* Course Title */}
            <TouchableOpacity
                onPress={() =>
                    router.push({
                        pathname: '/user/courseDetails',
                        params: { id: item.id },
                    })
                }
            >
                <Text className="mb-1 text-xl font-bold text-gray-900">
                    {item.title}
                </Text>
            </TouchableOpacity>

            {/* Instructor */}
            <TouchableOpacity onPress={() => handleAuthorPress(item.email)}>
                <Text className="mb-2 text-sm text-purple-700">
                    {item.instructor}
                </Text>
            </TouchableOpacity>

            {/* Duration */}
            <View className="mb-2 flex-row items-center">
                <Feather name="clock" size={14} color="#6b7280" />
                <Text className="ml-1 text-sm text-gray-600">
                    {item.duration}
                </Text>
            </View>

            {/* Rating and Price */}
            <View className="mb-4 flex-row items-center justify-between">
                <View className="flex-row items-center space-x-1">
                    <FontAwesome name="star" size={14} color="#facc15" />
                    <Text className="text-sm text-gray-800">{item.rating}</Text>
                </View>

                <View className="flex-row items-center space-x-1">
                    <MaterialIcons
                        name="attach-money"
                        size={16}
                        color="#9333ea"
                    />
                    <Text className="text-sm font-semibold text-purple-700">
                        {item.price.toFixed(2)}
                    </Text>
                </View>
            </View>

            {/* Buy Now Button */}
            <TouchableOpacity
                onPress={() =>
                    router.push({
                        pathname: '/PaymentScreen',
                        params: {
                            courseId: item.id,
                            courseTitle: item.title,
                            courseImage: item.image,
                            coursePrice: item.price,
                        },
                    })
                }
                className="rounded-xl bg-purple-600 py-3 hover:bg-purple-700 active:bg-purple-800"
            >
                <Text className="text-center text-base font-semibold text-white">
                    Buy Now
                </Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View className="flex-1 bg-gray-50 px-4 pt-6">
            <Text className="mb-1 text-3xl font-bold text-gray-900">
                Courses
            </Text>
            <Text className="mb-4 text-base text-gray-500">
                Browse your learning path
            </Text>

            <View className="mb-4 flex-row items-center rounded-full bg-white px-4 py-2 shadow-sm">
                <Feather name="search" size={18} color="#9ca3af" />
                <TextInput
                    placeholder="Search courses..."
                    className="ml-2 flex-1 text-base text-gray-800"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>

            <View className="mb-4 flex-row flex-wrap justify-start">
                {categories.map(category => (
                    <TouchableOpacity
                        key={category}
                        onPress={() => setSelectedCategory(category)}
                        className={`mb-2 mr-2 rounded-full border px-4 py-1.5 ${
                            selectedCategory === category
                                ? 'border-purple-600 bg-purple-600'
                                : 'border-gray-300 bg-white'
                        }`}
                    >
                        <Text
                            className={`text-sm font-medium ${
                                selectedCategory === category
                                    ? 'text-white'
                                    : 'text-gray-800'
                            }`}
                        >
                            {category}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <FlatList
                data={filteredCourses}
                keyExtractor={item => item.id}
                renderItem={renderCourse}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}
            />
            <BottomNavigationBar />
        </View>
    );
}
