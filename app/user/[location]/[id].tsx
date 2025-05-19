/* eslint-disable prettier/prettier */
import React, { useState, useEffect, Key } from 'react';
import {
    View,
    Text,
    Image,
    ScrollView,
    SafeAreaView,
    ActivityIndicator,
    TouchableOpacity,
} from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Feather, FontAwesome, MaterialIcons } from '@expo/vector-icons';
import Collapsible from 'react-native-collapsible';
import Icon from 'react-native-vector-icons/FontAwesome';
import { fetchCourseDetails } from '../../lib/api';
import { convertImageUrl } from '@/app/components/convertImageUrl';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetch } from 'cross-fetch';
import { api } from '../../services/api';

interface CourseDetails {
    id: string;
    title: string;
    description: string;
    price: number;
    instructor: string;
    teacher_id: string;
    thumbnail: string;
    location: string;
    duration: string;
    rating: number;
    enrollments: number;
    email: string;
    modules: {
        id: string | number | (string | number)[] | null | undefined;
        title: string;
        videos: Video[];
        liveClasses: {
            title: string;
            link: string;
            duration: number;
            schedule: string;
        }[];
    }[];
}

interface Video {
    id: number;
    title: string;
    video_url: string;
    position: number;
    created_at: string;
    updated_at: string;
    module_id: number;
}
export default function CourseDetailsScreen() {
    const { location, id, teacherEmail } = useLocalSearchParams<{
        location: string;
        id: string;
        teacherEmail: string;
    }>();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeSections, setActiveSections] = useState<number[]>([]);
    const [course, setCourse] = useState<CourseDetails | null>(null);
    const router = useRouter();
    const baseUrl = (Constants.expoConfig as any).extra.API_BASE_URL;
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [enrollmentLoading, setEnrollmentLoading] = useState(true);

    useEffect(() => {
        const loadCourse = async () => {
            try {
                if (!location || !id)
                    throw new Error('Invalid course reference');

                setLoading(true);
                const data = await fetchCourseDetails(
                    location,
                    id,
                    teacherEmail
                );
                setCourse(data as unknown as CourseDetails);
                console.log(data);
            } catch (err) {
                setError(
                    err instanceof Error ? err.message : 'Failed to load course'
                );
            } finally {
                setLoading(false);
            }
        };

        loadCourse();
    }, [location, id]);

    useEffect(() => {
        const checkEnrollment = async () => {
            try {
                setEnrollmentLoading(true);
                const userId = await AsyncStorage.getItem('userId');
                if (!userId || !course) {
                    setEnrollmentLoading(false);
                    return;
                }

                const response = await api.checkEnrollment(
                    course.id,
                    userId,
                    location,
                    teacherEmail
                );
                console.log(response.is_enrolled);
                setIsEnrolled(response.is_enrolled);
            } catch (error) {
                console.error('Failed to check enrollment:', error);
                // Don't update isEnrolled on error, keep previous state
            } finally {
                setEnrollmentLoading(false);
            }
        };

        checkEnrollment();
    }, [course, location]);

    const toggleSection = (index: number) => {
        setActiveSections(prev =>
            prev.includes(index)
                ? prev.filter(i => i !== index)
                : [...prev, index]
        );
    };

    const checkIfUserHasPaid = (courseId: string) => {
        if (enrollmentLoading) return false; // Don't show enrolled state while loading
        return isEnrolled;
    };

    if (loading) {
        return (
            <SafeAreaView className="flex-1 bg-white">
                <View className="flex-1 items-center justify-center">
                    <ActivityIndicator size="large" color="#9333ea" />
                    <Text className="mt-4 text-gray-700">
                        Loading course details...
                    </Text>
                </View>
            </SafeAreaView>
        );
    }

    if (error || !course) {
        return (
            <SafeAreaView className="flex-1 bg-white">
                <View className="flex-1 items-center justify-center p-4">
                    <Text className="text-lg text-red-500">
                        {error || 'Course not found'}
                    </Text>
                    <TouchableOpacity
                        className="mt-4 rounded-lg bg-purple-600 px-6 py-2"
                        onPress={() => router.back()}
                    >
                        <Text className="text-white">Go Back</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-white">
            <ScrollView className="flex-1">
                <Stack.Screen
                    options={{
                        title: course?.title || 'Course Details', // Fallback if course not loaded
                        headerStyle: {
                            backgroundColor: '#f9fafb', // Light gray background
                        },
                        headerTintColor: '#9333ea', // Purple text color
                        headerTitleStyle: {
                            fontWeight: 'bold',
                        },
                    }}
                />
                {/* Course Thumbnail */}
                {course.thumbnail && (
                    <Image
                        source={{
                            uri: convertImageUrl(course.thumbnail, baseUrl),
                        }}
                        className="h-64 w-full"
                        resizeMode="cover"
                    />
                )}

                <View className="px-5 py-6">
                    {/* Course Header */}
                    <Text className="text-3xl font-bold text-gray-900">
                        {course.title}
                    </Text>
                    <Text className="mt-2 text-base text-gray-700">
                        {course.description}
                    </Text>

                    {/* Instructor Info */}
                    <View className="mt-6 rounded-lg bg-gray-50 p-4">
                        <Text className="text-xl font-bold text-purple-700">
                            {course.instructor}
                        </Text>
                        <View className="mt-2 flex-row items-center justify-between">
                            <Text className="text-sm text-gray-600">
                                Email: {course.email}
                            </Text>
                            <Text className="text-sm text-gray-600">
                                Location: {course.location}
                            </Text>
                        </View>
                    </View>

                    {/* Course Stats */}
                    <View className="mt-6 rounded-lg border border-gray-200 bg-white p-5">
                        <View className="flex-row items-center justify-between">
                            <View className="flex-row items-center space-x-2">
                                <Feather
                                    name="clock"
                                    size={18}
                                    color="#6b7280"
                                />
                                <Text className="text-gray-700">
                                    {course.duration}
                                </Text>
                            </View>

                            <View className="flex-row items-center space-x-2">
                                <FontAwesome
                                    name="star"
                                    size={18}
                                    color="#facc15"
                                />
                                <Text className="text-gray-700">
                                    {course.rating} ({course.enrollments}{' '}
                                    students)
                                </Text>
                            </View>

                            <View className="flex-row items-center space-x-1">
                                <MaterialIcons
                                    name="attach-money"
                                    size={20}
                                    color="#9333ea"
                                />
                                <Text className="font-bold text-purple-700">
                                    {course.price
                                        ? `$${Number(course.price).toFixed(2)}`
                                        : 'Free'}
                                </Text>
                            </View>
                        </View>

                        {/* Enroll Button */}
                        <TouchableOpacity
                            className={`mt-4 rounded-lg py-3 ${checkIfUserHasPaid(course.id) ? 'bg-green-600' : 'bg-purple-600'}`}
                            disabled={checkIfUserHasPaid(course.id)}
                            onPress={() =>
                                router.push({
                                    pathname: '/payment/enrolpayment',
                                    params: {
                                        teacherId: course.teacher_id,
                                        courseId: course.id,
                                        courseTitle: course.title,
                                        coursePrice: course.price.toString(),
                                        courseLocation: course.location,
                                    },
                                })
                            }
                        >
                            <Text className="text-center font-semibold text-white">
                                {checkIfUserHasPaid(course.id)
                                    ? 'Enrolled'
                                    : course.price
                                      ? 'Enroll Now'
                                      : 'Enroll for Free'}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Course Modules */}
                    <Text className="mb-4 mt-8 text-2xl font-bold text-purple-800">
                        Course Modules
                    </Text>
                    {course.modules.map((module, index: number) => {
                        const isActive = activeSections.includes(index);
                        return (
                            <View
                                key={
                                    module.id
                                        ? module.id.toString()
                                        : `module-fallback-${index}`
                                }
                                className="mb-4 overflow-hidden rounded-lg border border-gray-200"
                            >
                                <TouchableOpacity
                                    onPress={() => toggleSection(index)}
                                    className={`flex-row items-center justify-between p-4 ${isActive ? 'bg-purple-100' : 'bg-white'}`}
                                >
                                    <Text className="text-lg font-semibold text-gray-800">
                                        {module.title}
                                    </Text>
                                    <Icon
                                        name={
                                            isActive
                                                ? 'chevron-up'
                                                : 'chevron-down'
                                        }
                                        size={18}
                                        color="#6b7280"
                                    />
                                </TouchableOpacity>

                                <Collapsible collapsed={!isActive}>
                                    <View className="bg-gray-50 p-4">
                                        {/* Videos Section */}
                                        {module.videos.length > 0 && (
                                            <View className="mb-4">
                                                <Text className="mb-2 text-sm font-semibold text-gray-700">
                                                    Videos
                                                </Text>
                                                {module.videos.map(video => (
                                                    <TouchableOpacity
                                                        key={
                                                            video.id ||
                                                            video.title
                                                        }
                                                        // key={video.id ? `${module.id}-${video.id}` : `${module.id}-video-fallback`}
                                                        className="mb-3 flex-row items-center rounded-lg bg-white p-3 shadow-sm"
                                                        onPress={() => {
                                                            if (
                                                                checkIfUserHasPaid(
                                                                    course.id
                                                                )
                                                            ) {
                                                                router.push({
                                                                    pathname:
                                                                        '/user/CourseVideosScreen',
                                                                    params: {
                                                                        courseId:
                                                                            course.id,
                                                                        videoId:
                                                                            video.id,
                                                                        videoUrl:
                                                                            video.video_url,
                                                                        videoTitle:
                                                                            video.title,
                                                                        moduleName:
                                                                            module.title,
                                                                        moduleId:
                                                                            module.id,
                                                                        location:
                                                                            course.location.toLowerCase(),
                                                                    },
                                                                });
                                                            } else {
                                                                router.push({
                                                                    pathname:
                                                                        '/paymentScreen',
                                                                    params: {
                                                                        courseId:
                                                                            course.id,
                                                                        courseTitle:
                                                                            course.title,
                                                                        coursePrice:
                                                                            course.price.toString(),
                                                                    },
                                                                });
                                                            }
                                                        }}
                                                    >
                                                        <Feather
                                                            name="play-circle"
                                                            size={20}
                                                            color="#7c3aed"
                                                        />
                                                        <View className="ml-3 flex-1">
                                                            <Text className="font-medium text-gray-800">
                                                                {video.title}
                                                            </Text>
                                                            <Text className="text-sm text-gray-500">
                                                                {video.position}
                                                                m
                                                            </Text>
                                                        </View>
                                                    </TouchableOpacity>
                                                ))}
                                            </View>
                                        )}

                                        {/* Live Classes Section */}
                                        {module.liveClasses.length > 0 && (
                                            <View>
                                                <Text className="mb-2 text-sm font-semibold text-gray-700">
                                                    Live Classes
                                                </Text>
                                                {module.liveClasses.map(
                                                    (
                                                        liveClass,
                                                        liveClassIndex
                                                    ) => (
                                                        <TouchableOpacity
                                                            key={
                                                                liveClass.title ||
                                                                liveClass.schedule
                                                            }
                                                            className="mb-3 flex-row items-center rounded-lg bg-white p-3 shadow-sm"
                                                            onPress={() => {
                                                                if (
                                                                    checkIfUserHasPaid(
                                                                        course.id
                                                                    )
                                                                ) {
                                                                    router.push(
                                                                        {
                                                                            pathname:
                                                                                '/user/LiveClassScreen',
                                                                            params: {
                                                                                link: liveClass.link,
                                                                                title: liveClass.title,
                                                                                schedule:
                                                                                    liveClass.schedule,
                                                                            },
                                                                        }
                                                                    );
                                                                } else {
                                                                    router.push(
                                                                        {
                                                                            pathname:
                                                                                '/paymentScreen',
                                                                            params: {
                                                                                courseId:
                                                                                    course.id,
                                                                                courseTitle:
                                                                                    course.title,
                                                                                coursePrice:
                                                                                    course.price.toString(),
                                                                            },
                                                                        }
                                                                    );
                                                                }
                                                            }}
                                                        >
                                                            <MaterialIcons
                                                                name="live-tv"
                                                                size={20}
                                                                color="#ef4444"
                                                            />
                                                            <View className="ml-3 flex-1">
                                                                <Text className="font-medium text-gray-800">
                                                                    {
                                                                        liveClass.title
                                                                    }
                                                                </Text>
                                                                <View className="flex-row items-center space-x-2">
                                                                    <Text className="text-sm text-gray-500">
                                                                        {
                                                                            liveClass.duration
                                                                        }
                                                                        m
                                                                    </Text>
                                                                    <Text className="text-sm text-red-500">
                                                                        {
                                                                            liveClass.schedule
                                                                        }
                                                                    </Text>
                                                                </View>
                                                            </View>
                                                        </TouchableOpacity>
                                                    )
                                                )}
                                            </View>
                                        )}
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
