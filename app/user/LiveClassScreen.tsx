import React from 'react';
import { View, Text, SafeAreaView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import WebView from 'react-native-webview';

export default function LiveClassScreen() {
    const { link, title, schedule } = useLocalSearchParams<{
        link: string;
        title: string;
        schedule: string;
    }>();

    const router = useRouter();

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            {/* WebView Container */}
            <View className="flex-1 bg-black">
                <WebView
                    source={{ uri: link }}
                    style={{ flex: 1 }}
                    allowsFullscreenVideo
                    javaScriptEnabled
                    allowsInlineMediaPlayback
                    allowsPictureInPicture
                />
            </View>
            <View className="flex-1 px-4">
                <View className="px-3 py-2">
                    <Text
                        className="text-lg font-bold text-gray-800"
                        numberOfLines={1}
                    >
                        {title}
                    </Text>
                </View>
                {/* Schedule Footer */}
                <View className="border-t border-gray-200 bg-white p-5 shadow-md">
                    <View className="flex-row items-center space-x-3 rounded-lg bg-red-50 p-3">
                        <View className="rounded-full bg-red-100 p-2">
                            <MaterialIcons
                                name="schedule"
                                size={18}
                                color="#dc2626"
                            />
                        </View>
                        <View>
                            <Text className="text-xs font-medium text-gray-500">
                                Scheduled Time
                            </Text>
                            <Text className="text-sm font-semibold text-gray-800">
                                {schedule}
                            </Text>
                        </View>
                    </View>

                    {/* Additional Controls */}
                    <View className="mt-4 flex-row justify-between">
                        <TouchableOpacity className="flex-row items-center space-x-2 rounded-full bg-gray-100 px-4 py-2">
                            <MaterialIcons
                                name="chat"
                                size={18}
                                color="#4b5563"
                            />
                            <Text className="text-sm font-medium text-gray-700">
                                Chat
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity className="flex-row items-center space-x-2 rounded-full bg-gray-100 px-4 py-2">
                            <MaterialIcons
                                name="people"
                                size={18}
                                color="#4b5563"
                            />
                            <Text className="text-sm font-medium text-gray-700">
                                Participants
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity className="flex-row items-center space-x-2 rounded-full bg-gray-100 px-4 py-2">
                            <MaterialIcons
                                name="file-download"
                                size={18}
                                color="#4b5563"
                            />
                            <Text className="text-sm font-medium text-gray-700">
                                Materials
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
}
