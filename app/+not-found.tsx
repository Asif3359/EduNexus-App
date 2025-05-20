import { Link, Stack } from 'expo-router';
import React from 'react';
import { View, Image, Text } from 'react-native';

export default function NotFoundScreen() {
    return (
        <>
            <Stack.Screen
                options={{
                    title: 'Oops!',
                    headerTitleStyle: { color: '#6D28D9' },
                    headerTintColor: '#6D28D9',
                }}
            />
            <View className="flex-1 items-center justify-center bg-white p-8">
                <Image
                    source={{
                        uri: 'https://cdn-icons-png.flaticon.com/512/755/755014.png',
                    }}
                    className="mb-8 h-48 w-48"
                    resizeMode="contain"
                />
                <Text className="mb-2 text-3xl font-bold text-gray-800">
                    404 - Not Found
                </Text>
                <Text className="mb-8 text-center text-lg text-gray-600">
                    The page you're looking for doesn't exist or has been moved.
                </Text>
                <Link
                    href="/"
                    className="rounded-lg bg-purple-600 px-6 py-3 shadow-md"
                >
                    <Text className="text-lg font-medium text-white">
                        Go to Home Screen
                    </Text>
                </Link>
            </View>
        </>
    );
}
