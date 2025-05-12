// app/manage-lessons/[moduleId].tsx
import { useLocalSearchParams, useNavigation } from 'expo-router';
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

interface Lesson {
    id: number;
    title: string;
    description: string;
    content: string;
    video_url: string | null;
    position: number;
}

export default function ManageLessons() {
    const { courseId, moduleId } = useLocalSearchParams<{
        courseId: string;
        moduleId: string;
    }>();
    const navigation = useNavigation();
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [loading, setLoading] = useState(true);
    const apiUrl = (Constants.expoConfig as any).extra.BACKEND_API;

    useEffect(() => {
        // navigation.setOptions({
        //     title: 'Manage Lessons',
        //     headerRight: () => (
        //         // <TouchableOpacity
        //         //     className="mr-4"
        //         //     onPress={() => navigation.navigate('add-lesson', {
        //         //         courseId,
        //         //         moduleId
        //         //     })}
        //         // >
        //         //     <Ionicons name="add" size={24} color="#6366f1" />
        //         // </TouchableOpacity>
        //     )
        // });
        // fetchLessons();
    }, []);

    const fetchLessons = async () => {
        try {
            const response = await fetch(
                `${apiUrl}/modules/${moduleId}/lessons?location=Khulna`
            );
            const data = await response.json();
            if (data.success) {
                setLessons(data.lessons);
            }
        } catch (error) {
            console.error('Error fetching lessons:', error);
            Alert.alert('Error', 'Failed to load lessons');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View className="flex-1 items-center justify-center">
                <ActivityIndicator size="large" color="#6366f1" />
            </View>
        );
    }

    return (
        <ScrollView className="flex-1 bg-gray-50 p-4">
            {lessons.length > 0 ? (
                lessons.map(lesson => (
                    <View
                        key={lesson.id}
                        className="mb-3 rounded-lg bg-white p-4 shadow-sm"
                    >
                        <Text className="text-lg font-bold">
                            {lesson.title}
                        </Text>
                        <Text className="mt-1 text-gray-600">
                            {lesson.description}
                        </Text>
                        {/* Add edit/delete buttons here */}
                    </View>
                ))
            ) : (
                <View className="flex-1 items-center justify-center py-10">
                    <Text className="text-gray-500">No lessons added yet</Text>
                </View>
            )}
        </ScrollView>
    );
}
