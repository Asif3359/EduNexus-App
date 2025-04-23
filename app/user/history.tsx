// HistoryScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import RootStackParamList from '../types/navigation'; // Make sure this is defined correctly
import BottomNavigationBar from '../components/BottomNavigationBar';
import { router } from 'expo-router';

type CourseDetailsScreenNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    'CourseDetailsScreen'
>;

export default function HistoryScreen() {
    const navigation = useNavigation<CourseDetailsScreenNavigationProp>();
    const [history, setHistory] = useState<
        {
            id: string;
            title: string;
            url: string;
            module: string;
            date: string;
        }[]
    >([]);

    useEffect(() => {
        const loadHistory = async () => {
            const stored = await AsyncStorage.getItem('videoHistory');
            if (stored) {
                setHistory(JSON.parse(stored));
            }
        };
        loadHistory();
    }, []);

    const clearHistory = async () => {
        Alert.alert(
            'Clear History',
            'Are you sure you want to delete your watch history?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Clear',
                    style: 'destructive',
                    onPress: async () => {
                        await AsyncStorage.removeItem('videoHistory');
                        setHistory([]);
                    },
                },
            ]
        );
    };

    return (
        <View className="flex-1 bg-white">
            <ScrollView className="flex-1 bg-white px-4 pt-6">
                <View className="mb-4 flex-row items-center justify-between">
                    <Text className="text-2xl font-bold text-purple-800">
                        Watch History
                    </Text>
                    {history.length > 0 && (
                        <TouchableOpacity
                            onPress={clearHistory}
                            className="flex-row items-center rounded-full bg-red-100 px-3 py-1"
                        >
                            <MaterialIcons
                                name="delete-outline"
                                size={20}
                                color="#dc2626"
                            />
                            <Text className="ml-1 font-medium text-red-600">
                                Clear
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>

                {history.length === 0 ? (
                    <Text className="text-gray-500">
                        No videos watched yet.
                    </Text>
                ) : (
                    history.map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            className="mb-3 flex-row items-center justify-between rounded-xl border border-purple-200 bg-purple-50 p-4"
                            onPress={() => {
                                router.push({
                                    pathname: '/user/CourseVideosScreen',
                                    params: {
                                        courseId: item.id,
                                        videoUrl: item.url,
                                        videoTitle: item.title,
                                        moduleName: item.module,
                                    },
                                });
                            }}
                        >
                            <View>
                                <Text className="text-lg font-semibold text-purple-900">
                                    {item.title}
                                </Text>
                                <Text className="text-sm text-gray-600">
                                    {item.module}
                                </Text>
                                <Text className="text-xs text-gray-400">
                                    {new Date(item.date).toLocaleString()}
                                </Text>
                            </View>
                            <Feather name="clock" size={20} color="#7c3aed" />
                        </TouchableOpacity>
                    ))
                )}
            </ScrollView>
            <BottomNavigationBar />
        </View>
    );
}
