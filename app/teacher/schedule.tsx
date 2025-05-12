import React, { useState } from 'react';
import {
    SafeAreaView,
    Text,
    TextInput,
    Button,
    View,
    StyleSheet,
} from 'react-native';

const Schedule = () => {
    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [duration, setDuration] = useState('');
    const [link, setLink] = useState('');

    const handleSchedule = () => {
        // Handle the schedule submission logic here
        console.log({
            title,
            date,
            time,
            duration,
            link,
        });
    };

    return (
        <SafeAreaView className="flex-1 bg-white p-4">
            <Text className="mb-4 text-2xl font-bold">Add Schedule</Text>
            <View className="mb-4">
                <Text className="text-lg">Title</Text>
                <TextInput
                    className="rounded border border-gray-300 p-2"
                    placeholder="Enter class title"
                    value={title}
                    onChangeText={setTitle}
                />
            </View>
            <View className="mb-4">
                <Text className="text-lg">Date</Text>
                <TextInput
                    className="rounded border border-gray-300 p-2"
                    placeholder="YYYY-MM-DD"
                    value={date}
                    onChangeText={setDate}
                />
            </View>
            <View className="mb-4">
                <Text className="text-lg">Time</Text>
                <TextInput
                    className="rounded border border-gray-300 p-2"
                    placeholder="HH:MM"
                    value={time}
                    onChangeText={setTime}
                />
            </View>
            <View className="mb-4">
                <Text className="text-lg">Duration (minutes)</Text>
                <TextInput
                    className="rounded border border-gray-300 p-2"
                    placeholder="Enter duration"
                    value={duration}
                    onChangeText={setDuration}
                />
            </View>
            <View className="mb-4">
                <Text className="text-lg">Link</Text>
                <TextInput
                    className="rounded border border-gray-300 p-2"
                    placeholder="Enter class link"
                    value={link}
                    onChangeText={setLink}
                />
            </View>
            <Button title="Add Schedule" onPress={handleSchedule} />
        </SafeAreaView>
    );
};

export default Schedule;
