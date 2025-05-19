import React from 'react';
import { View, Text, SafeAreaView, TouchableOpacity } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import WebView from 'react-native-webview';

export default function LiveClassScreen() {
    const { link, title, schedule } = useLocalSearchParams<{
        link: string;
        title: string;
        schedule: string;
    }>();

    const router = useRouter();

    return (
        <SafeAreaView className="flex-1 bg-white">
            {/* Header with Back Button */}

            <Stack.Screen
                options={{
                    title: title,
                    headerShown: true,
                }}
            />

            {/* WebView Container */}
            <WebView
                source={{ uri: link }}
                style={{ flex: 1, width: '100%', height: '100%' }}
                allowsFullscreenVideo
                javaScriptEnabled
                allowsInlineMediaPlayback
                allowsPictureInPicture
            />

            {/* Class Info Section */}
            <View className="flex-1 px-5 pt-4">
                <View className="mb-4">
                    <Text className="text-xl font-bold text-gray-900">
                        {title}
                    </Text>
                </View>

                {/* Schedule Card */}
                <View className="mb-6 rounded-xl bg-red-50 p-4 shadow-sm">
                    <View className="flex-row items-start">
                        <View className="mr-3 rounded-full bg-red-100 p-2">
                            <MaterialIcons
                                name="schedule"
                                size={20}
                                color="#dc2626"
                            />
                        </View>
                        <View className="flex-1">
                            <Text className="text-xs font-medium uppercase tracking-wider text-red-500">
                                Scheduled Time
                            </Text>
                            <Text className="mt-1 text-lg font-semibold text-gray-900">
                                {schedule}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Action Buttons */}
                <View className="flex-row justify-between gap-3 space-x-3">
                    <TouchableOpacity
                        className="flex-1 flex-row items-center justify-center space-x-2 rounded-xl bg-indigo-50 px-4 py-3"
                        activeOpacity={0.8}
                    >
                        <Feather
                            name="message-square"
                            size={18}
                            color="#4f46e5"
                        />
                        <Text className="font-medium text-indigo-700">
                            Chat
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        className="flex-1 flex-row items-center justify-center space-x-2 rounded-xl bg-purple-50 px-4 py-3"
                        activeOpacity={0.8}
                    >
                        <Feather name="users" size={18} color="#7e22ce" />
                        <Text className="font-medium text-purple-700">
                            Participants
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        className="flex-1 flex-row items-center justify-center space-x-2 rounded-xl bg-emerald-50 px-4 py-3"
                        activeOpacity={0.8}
                    >
                        <Feather name="download" size={18} color="#059669" />
                        <Text className="font-medium text-emerald-700">
                            Materials
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Additional Info Section */}
                <View className="mt-8 rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                    <View className="mb-4 flex-row items-center justify-between">
                        <Text className="font-bold text-gray-900">
                            Class Details
                        </Text>
                        <Feather name="info" size={18} color="#6b7280" />
                    </View>

                    <View className="space-y-3">
                        <View className="flex-row items-center space-x-3">
                            <Feather name="wifi" size={18} color="#6b7280" />
                            <Text className="text-gray-600">
                                Stable internet connection recommended
                            </Text>
                        </View>
                        <View className="flex-row items-center space-x-3">
                            <Feather
                                name="headphones"
                                size={18}
                                color="#6b7280"
                            />
                            <Text className="text-gray-600">
                                Use headphones for better audio
                            </Text>
                        </View>
                        <View className="flex-row items-center space-x-3">
                            <Feather name="clock" size={18} color="#6b7280" />
                            <Text className="text-gray-600">
                                Join 5 minutes before start time
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
}
