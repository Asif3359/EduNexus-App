import React, { useState } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    Image,
    Dimensions,
    ScrollView,
    SafeAreaView,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import RootStackParamList from '../types/navigation';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import courseDetailsData from '@/assets/data/courseDetails.json';
import Collapsible from 'react-native-collapsible';
import { Feather, FontAwesome, MaterialIcons } from '@expo/vector-icons';

type CourseDetailsScreenNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    'CourseDetailsScreen'
>;

export default function CourseDetailsScreen() {
    const { id } = useLocalSearchParams();
    const course = courseDetailsData.find(c => c.id === id);
    const navigation = useNavigation<CourseDetailsScreenNavigationProp>();

    const [activeSections, setActiveSections] = useState<number[]>([]);
    const router = useRouter();

    const toggleSection = (index: number) => {
        setActiveSections(prev =>
            prev.includes(index)
                ? prev.filter(i => i !== index)
                : [...prev, index]
        );
    };

    const checkIfUserHasPaid = (courseId: string) => {
        const paidCourses = ['1', '2']; // mock data
        return paidCourses.includes(courseId);
    };

    if (!course) {
        return (
            <View className="flex-1 items-center justify-center bg-white">
                <Text className="text-lg text-gray-700">Course not found.</Text>
            </View>
        );
    }
    const handleAuthorPress = (email: string) => {
        router.push({
            pathname: '/teacher/InstructorProfile',
            params: { email },
        });
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <ScrollView className="flex-1 bg-white">
                <Image
                    source={{ uri: course.image }}
                    className="h-64 w-full"
                    resizeMode="cover"
                />

                <View className="mb-8 px-5 pb-10 pt-4">
                    {/* Title & Description */}
                    <Text className="mb-2 text-3xl font-bold text-gray-900">
                        {course.title}
                    </Text>
                    <Text className="mb-4 text-base leading-relaxed text-gray-700">
                        {course.description}
                    </Text>

                    {/* Instructor Info */}
                    <View className="mb-6 rounded-xl bg-gray-50 p-4 shadow-sm">
                        <TouchableOpacity
                            onPress={() => handleAuthorPress(course.email)}
                        >
                            <Text className="text-xl font-bold text-purple-700">
                                {course.instructor}
                            </Text>
                        </TouchableOpacity>
                        <Text className="mt-1 text-sm text-gray-600">
                            Email: {course.email}
                        </Text>
                    </View>
                    {/* Course Details */}
                    <View className="mb-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-lg">
                        <Text className="mb-2 text-lg font-bold text-gray-900">
                            Course Info
                        </Text>

                        {/* Duration */}
                        <View className="mb-3 flex-row items-center">
                            <Feather name="clock" size={16} color="#6b7280" />
                            <Text className="ml-2 text-base text-gray-700">
                                {course.duration} hours
                            </Text>
                        </View>

                        {/* Rating and Price */}
                        <View className="mb-3 flex-row items-center justify-between">
                            <View className="flex-row items-center space-x-1">
                                <FontAwesome
                                    name="star"
                                    size={16}
                                    color="#facc15"
                                />
                                <Text className="text-base font-medium text-gray-800">
                                    {course.rating}
                                </Text>
                            </View>

                            <View className="flex-row items-center space-x-1">
                                <MaterialIcons
                                    name="attach-money"
                                    size={20}
                                    color="#9333ea"
                                />
                                <Text className="text-lg font-bold text-purple-700">
                                    {course.price
                                        ? course.price.toFixed(2)
                                        : 'Free'}
                                </Text>
                            </View>
                        </View>

                        {/* Buy Button */}
                        {checkIfUserHasPaid(course.id) ? (
                            <TouchableOpacity
                                disabled
                                className="mt-4 rounded-xl bg-green-600 px-5 py-3 shadow-sm"
                            >
                                <Text className="text-center text-base font-semibold text-white">
                                    Enrolled
                                </Text>
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity
                                onPress={() =>
                                    navigation.navigate('paymentScreen', {
                                        courseId: course.id,
                                        courseTitle: course.title,
                                        courseImage: course.image,
                                        coursePrice: course.price,
                                    })
                                }
                                className="mt-4 rounded-xl bg-purple-600 px-5 py-3 shadow-sm"
                            >
                                <Text className="text-center text-base font-semibold text-white">
                                    {course.price
                                        ? 'Enroll'
                                        : 'Enroll for Free'}
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    {/* Modules */}
                    <Text className="mb-4 text-2xl font-bold text-purple-800">
                        📚 Course Modules
                    </Text>

                    {course.modules.map((item, index) => {
                        const isActive = activeSections.includes(index);
                        return (
                            <View
                                key={index}
                                className={`mb-4 rounded-2xl shadow ${
                                    isActive
                                        ? 'border border-purple-200 bg-purple-50'
                                        : 'border border-gray-200 bg-white'
                                }`}
                            >
                                <TouchableOpacity
                                    onPress={() => toggleSection(index)}
                                    className={`flex-row items-center justify-between rounded-t-2xl px-5 py-4 ${
                                        isActive
                                            ? 'bg-purple-200'
                                            : 'bg-purple-200'
                                    }`}
                                >
                                    <Text className="text-lg font-bold text-gray-800">
                                        {item.title}
                                    </Text>
                                    <Icon
                                        name={
                                            isActive
                                                ? 'chevron-up'
                                                : 'chevron-down'
                                        }
                                        size={20}
                                        color={isActive ? '#7c3aed' : '#6B7280'}
                                    />
                                </TouchableOpacity>

                                <Collapsible collapsed={!isActive}>
                                    <View className="space-y-3 rounded-b-2xl bg-purple-50 px-5 py-4">
                                        {item.videos.map((video, vidIdx) => (
                                            <TouchableOpacity
                                                key={`${index}-${vidIdx}`}
                                                onPress={() => {
                                                    const hasUserPaid =
                                                        checkIfUserHasPaid(
                                                            course.id
                                                        );
                                                    if (hasUserPaid) {
                                                        router.push({
                                                            pathname:
                                                                '/user/CourseVideosScreen',
                                                            params: {
                                                                courseId:
                                                                    course.id,
                                                                videoUrl:
                                                                    video.url,
                                                                videoTitle:
                                                                    video.title,
                                                                moduleName:
                                                                    item.title,
                                                            },
                                                        });
                                                    } else {
                                                        navigation.navigate(
                                                            'paymentScreen',
                                                            {
                                                                courseId:
                                                                    course.id,
                                                                courseTitle:
                                                                    course.title,
                                                                courseImage:
                                                                    course.image,
                                                                coursePrice:
                                                                    course.price,
                                                                videoTitle:
                                                                    video.title,
                                                            }
                                                        );
                                                    }
                                                }}
                                                className="mb-2 flex-row items-center space-x-3 rounded-xl border border-purple-200 bg-white p-3 shadow-sm"
                                            >
                                                <Feather
                                                    name="play-circle"
                                                    size={20}
                                                    color="#7c3aed"
                                                />
                                                <Text className="px-2 font-medium text-purple-700">
                                                    {video.title}
                                                </Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                </Collapsible>
                            </View>
                        );
                    })}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
