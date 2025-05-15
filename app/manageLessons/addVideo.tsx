import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function AddVideo() {
    const { courseId, moduleId } = useLocalSearchParams<{
        courseId: string;
        moduleId: string;
    }>();

    const [title, setTitle] = useState('');
    const [videoUrl, setVideoUrl] = useState('');
    const [position, setPosition] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const apiUrl = (Constants.expoConfig as any).extra?.BACKEND_API;

    const handleSubmit = async () => {
        if (!title || !videoUrl || !position) {
            Alert.alert('Error', 'Please fill all fields');
            return;
        }

        setIsLoading(true);
        try {
            const userLocation = await AsyncStorage.getItem('userLocation');
            // console.log(userLocation);
            // console.log(moduleId);
            // console.log(title);
            // console.log(videoUrl);
            // console.log(position);
            const response = await fetch(`${apiUrl}/videos`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    module_id: parseInt(moduleId),
                    title: title,
                    video_url: videoUrl,
                    position: parseInt(position),
                    location: userLocation,
                }),
            });

            if (response.ok) {
                Alert.alert('Success', 'Video added successfully');
                router.back();
            } else {
                Alert.alert('Error', 'Failed to add video');
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to add video');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ScrollView className="flex-1 bg-gray-50 p-6">
            <View className="mb-8">
                <Text className="text-2xl font-bold text-gray-900">
                    Add New Video
                </Text>
                <Text className="mt-1 text-gray-500">
                    Fill in the details for your video lesson
                </Text>
            </View>

            <View className="space-y-5">
                {/* Title Input */}
                <View>
                    <Text className="mb-1 text-sm font-medium text-gray-700">
                        Video Title
                    </Text>
                    <TextInput
                        className="rounded-lg border border-gray-200 bg-white p-4"
                        placeholder="Enter video title"
                        value={title}
                        onChangeText={setTitle}
                    />
                </View>

                {/* Video URL Input */}
                <View>
                    <Text className="mb-1 text-sm font-medium text-gray-700">
                        Video URL
                    </Text>
                    <TextInput
                        className="rounded-lg border border-gray-200 bg-white p-4"
                        placeholder="Paste video URL here"
                        value={videoUrl}
                        onChangeText={setVideoUrl}
                    />
                </View>

                {/* Position Input */}
                <View>
                    <Text className="mb-1 text-sm font-medium text-gray-700">
                        Position in Module
                    </Text>
                    <TextInput
                        className="rounded-lg border border-gray-200 bg-white p-4"
                        placeholder="Enter position number"
                        keyboardType="numeric"
                        value={position}
                        onChangeText={setPosition}
                    />
                    <Text className="mt-1 text-xs text-gray-500">
                        Lower numbers appear first
                    </Text>
                </View>

                {/* Submit Button */}
                <TouchableOpacity
                    className="mt-6 items-center rounded-lg bg-indigo-600 p-4"
                    onPress={handleSubmit}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text className="font-medium text-white">
                            Add Video
                        </Text>
                    )}
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}
