// app/manage-lessons/[moduleId].tsx
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
    '/manageLessons/addVideo': {
        courseId: string;
        moduleId: string;
    };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface Video {
    id: number;
    title: string;
    video_url: string;
    position: number;
}

interface LiveClass {
    id: number;
    title: string;
    schedule: string;
    link: string;
    duration: number;
}

export default function ManageLessons() {
    const { courseId, moduleId } = useLocalSearchParams<{
        courseId: string;
        moduleId: string;
    }>();
    const navigation = useNavigation<NavigationProp>();
    const [videos, setVideos] = useState<Video[]>([]);
    const [liveClasses, setLiveClasses] = useState<LiveClass[]>([]);
    const [loading, setLoading] = useState(false);
    const apiUrl = (Constants.expoConfig as any).extra.BACKEND_API;

    useEffect(() => {
        navigation.setOptions({
            title: 'Manage Content',
            headerRight: () => (
                <View className="mr-4 flex-row gap-4 space-x-4">
                    <TouchableOpacity
                        onPress={() =>
                            router.push({
                                pathname: '/manageLessons/addVideo',
                                params: { courseId, moduleId },
                            })
                        }
                        className="rounded-full bg-indigo-100 p-2"
                    >
                        <Ionicons name="videocam" size={20} color="#6366f1" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() =>
                            router.push({
                                pathname: '/manageLessons/addLiveClass',
                                params: { courseId, moduleId },
                            })
                        }
                        className="rounded-full bg-indigo-100 p-2"
                    >
                        <Ionicons name="calendar" size={20} color="#6366f1" />
                    </TouchableOpacity>
                </View>
            ),
        });
        // fetchContent();
    }, []);

    const fetchContent = async () => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            const response = await fetch(
                `${apiUrl}/api/modules/${moduleId}/content`
            );
            const data = await response.json();
            setVideos(data.videos);
            setLiveClasses(data.live_classes);
        } catch (error) {
            console.error('Error fetching content:', error);
            Alert.alert('Error', 'Failed to load content');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View className="flex-1 items-center justify-center bg-gray-50">
                <ActivityIndicator size="large" color="#6366f1" />
            </View>
        );
    }

    return (
        <ScrollView className="flex-1 bg-gray-50 p-4">
            {/* Header */}
            <View className="mb-8">
                <Text className="text-2xl font-bold text-gray-900">
                    Module Content
                </Text>
                <Text className="mt-1 text-gray-500">
                    Manage videos and live classes for this module
                </Text>
            </View>

            {/* Videos Section */}
            <View className="mb-8">
                <View className="mb-4 flex-row items-center justify-between">
                    <Text className="text-xl font-bold text-gray-900">
                        Videos
                    </Text>
                    <TouchableOpacity
                        onPress={() =>
                            router.push({
                                pathname: '/manageLessons/addVideo',
                                params: { courseId, moduleId },
                            })
                        }
                        className="flex-row items-center rounded-lg bg-indigo-600 px-3 py-2"
                    >
                        <Ionicons name="add" size={16} color="white" />
                        <Text className="ml-1 font-medium text-white">
                            Add Video
                        </Text>
                    </TouchableOpacity>
                </View>

                {videos.length > 0 ? (
                    videos.map(video => (
                        <View
                            key={video.id}
                            className="mb-4 rounded-xl border border-gray-100 bg-white p-5 shadow-sm"
                        >
                            <View className="flex-row items-start justify-between">
                                <View className="flex-1">
                                    <View className="mb-2 flex-row items-center">
                                        <Ionicons
                                            name="play-circle"
                                            size={20}
                                            color="#6366f1"
                                        />
                                        <Text className="ml-2 text-lg font-semibold text-gray-800">
                                            {video.title}
                                        </Text>
                                    </View>
                                    <View className="self-start rounded-md bg-indigo-50 px-2 py-1">
                                        <Text className="text-xs font-medium text-indigo-700">
                                            Position: {video.position}
                                        </Text>
                                    </View>
                                </View>
                                <View className="flex-row space-x-3">
                                    <TouchableOpacity className="rounded-full bg-gray-100 p-2">
                                        <Ionicons
                                            name="create-outline"
                                            size={18}
                                            color="#6366f1"
                                        />
                                    </TouchableOpacity>
                                    <TouchableOpacity className="rounded-full bg-red-50 p-2">
                                        <Ionicons
                                            name="trash-outline"
                                            size={18}
                                            color="#ef4444"
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    ))
                ) : (
                    <View className="items-center justify-center rounded-xl border border-dashed border-gray-200 bg-white p-8">
                        <Ionicons
                            name="videocam-off"
                            size={32}
                            color="#9ca3af"
                        />
                        <Text className="mt-2 text-center text-gray-500">
                            No videos added yet
                        </Text>
                        <TouchableOpacity
                            className="mt-4 flex-row items-center rounded-lg bg-indigo-600 px-4 py-2"
                            onPress={() =>
                                router.push({
                                    pathname: '/manageLessons/addVideo',
                                    params: { courseId, moduleId },
                                })
                            }
                        >
                            <Ionicons name="add" size={16} color="white" />
                            <Text className="ml-1 font-medium text-white">
                                Add First Video
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>

            {/* Live Classes Section */}
            <View className="mb-8">
                <View className="mb-4 flex-row items-center justify-between">
                    <Text className="text-xl font-bold text-gray-900">
                        Live Classes
                    </Text>
                    <TouchableOpacity
                        onPress={() =>
                            router.push({
                                pathname: '/manageLessons/addLiveClass',
                                params: { courseId, moduleId },
                            })
                        }
                        className="flex-row items-center rounded-lg bg-indigo-600 px-3 py-2"
                    >
                        <Ionicons name="add" size={16} color="white" />
                        <Text className="ml-1 font-medium text-white">
                            Schedule Class
                        </Text>
                    </TouchableOpacity>
                </View>

                {liveClasses.length > 0 ? (
                    liveClasses.map(liveClass => (
                        <View
                            key={liveClass.id}
                            className="mb-4 rounded-xl border border-gray-100 bg-white p-5 shadow-sm"
                        >
                            <View className="flex-row items-start justify-between">
                                <View className="flex-1">
                                    <View className="mb-2 flex-row items-center">
                                        <Ionicons
                                            name="calendar"
                                            size={20}
                                            color="#ec4899"
                                        />
                                        <Text className="ml-2 text-lg font-semibold text-gray-800">
                                            {liveClass.title}
                                        </Text>
                                    </View>
                                    <View className="space-y-2">
                                        <View className="flex-row items-center">
                                            <Ionicons
                                                name="time-outline"
                                                size={16}
                                                color="#6b7280"
                                            />
                                            <Text className="ml-2 text-sm text-gray-600">
                                                {new Date(
                                                    liveClass.schedule
                                                ).toLocaleString()}
                                            </Text>
                                        </View>
                                        <View className="flex-row items-center">
                                            <Ionicons
                                                name="hourglass-outline"
                                                size={16}
                                                color="#6b7280"
                                            />
                                            <Text className="ml-2 text-sm text-gray-600">
                                                Duration: {liveClass.duration}{' '}
                                                minutes
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                                <View className="flex-row space-x-3">
                                    <TouchableOpacity className="rounded-full bg-gray-100 p-2">
                                        <Ionicons
                                            name="create-outline"
                                            size={18}
                                            color="#6366f1"
                                        />
                                    </TouchableOpacity>
                                    <TouchableOpacity className="rounded-full bg-red-50 p-2">
                                        <Ionicons
                                            name="trash-outline"
                                            size={18}
                                            color="#ef4444"
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    ))
                ) : (
                    <View className="items-center justify-center rounded-xl border border-dashed border-gray-200 bg-white p-8">
                        <Ionicons
                            name="calendar-outline"
                            size={32}
                            color="#9ca3af"
                        />
                        <Text className="mt-2 text-center text-gray-500">
                            No live classes scheduled
                        </Text>
                        <TouchableOpacity
                            className="mt-4 flex-row items-center rounded-lg bg-indigo-600 px-4 py-2"
                            onPress={() =>
                                router.push({
                                    pathname: '/manageLessons/addLiveClass',
                                    params: { courseId, moduleId },
                                })
                            }
                        >
                            <Ionicons name="add" size={16} color="white" />
                            <Text className="ml-1 font-medium text-white">
                                Schedule First Class
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </ScrollView>
    );
}
