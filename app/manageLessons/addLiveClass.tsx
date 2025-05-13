import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Alert,
    ActivityIndicator,
    Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

const apiUrl = (Constants.expoConfig as any).extra?.BACKEND_API;

export default function AddLiveClass() {
    const { courseId, moduleId } = useLocalSearchParams<{
        courseId: string;
        moduleId: string;
    }>();

    const [title, setTitle] = useState('');
    const [link, setLink] = useState('');
    const [duration, setDuration] = useState('');
    const [schedule, setSchedule] = useState(new Date());
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleConfirm = (date: Date) => {
        setSchedule(date);
        hideDatePicker();
    };

    const handleSubmit = async () => {
        if (!title || !link || !duration) {
            Alert.alert('Error', 'Please fill all fields');
            return;
        }

        setIsLoading(true);
        try {
            const token = await AsyncStorage.getItem('userToken');
            const response = await fetch(`${apiUrl}/api/live-classes`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    module_id: moduleId,
                    title,
                    link,
                    duration: parseInt(duration),
                    schedule: schedule.toISOString(),
                }),
            });

            if (!response.ok) throw new Error('Failed to schedule live class');

            Alert.alert('Success', 'Live class scheduled successfully');
            router.back();
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to schedule live class');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ScrollView className="flex-1 bg-gray-50 p-6">
            <View className="mb-8">
                <Text className="text-2xl font-bold text-gray-900">
                    Schedule Live Class
                </Text>
                <Text className="mt-1 text-gray-500">
                    Set up your live session details
                </Text>
            </View>

            <View className="space-y-5">
                {/* Title Input */}
                <View>
                    <Text className="mb-1 text-sm font-medium text-gray-700">
                        Class Title
                    </Text>
                    <TextInput
                        className="rounded-lg border border-gray-200 bg-white p-4"
                        placeholder="Enter class title"
                        value={title}
                        onChangeText={setTitle}
                    />
                </View>

                {/* Meeting Link Input */}
                <View>
                    <Text className="mb-1 text-sm font-medium text-gray-700">
                        Meeting Link
                    </Text>
                    <TextInput
                        className="rounded-lg border border-gray-200 bg-white p-4"
                        placeholder="Paste meeting URL (Zoom, Google Meet, etc.)"
                        value={link}
                        onChangeText={setLink}
                    />
                </View>

                {/* Schedule Date/Time */}
                <View>
                    <Text className="mb-1 text-sm font-medium text-gray-700">
                        Schedule
                    </Text>
                    <TouchableOpacity
                        className="flex-row items-center justify-between rounded-lg border border-gray-200 bg-white p-4"
                        onPress={showDatePicker}
                    >
                        <Text className="text-gray-800">
                            {schedule.toLocaleString()}
                        </Text>
                        <Ionicons name="calendar" size={20} color="#6366f1" />
                    </TouchableOpacity>

                    {/* DateTime Picker Modal */}
                    <DateTimePickerModal
                        isVisible={isDatePickerVisible}
                        mode="datetime"
                        date={schedule}
                        onConfirm={handleConfirm}
                        onCancel={hideDatePicker}
                        minimumDate={new Date()}
                    />
                </View>

                {/* Duration Input */}
                <View>
                    <Text className="mb-1 text-sm font-medium text-gray-700">
                        Duration (minutes)
                    </Text>
                    <TextInput
                        className="rounded-lg border border-gray-200 bg-white p-4"
                        placeholder="Enter duration in minutes"
                        keyboardType="numeric"
                        value={duration}
                        onChangeText={text =>
                            setDuration(text.replace(/[^0-9]/g, ''))
                        }
                    />
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
                            Schedule Live Class
                        </Text>
                    )}
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}
