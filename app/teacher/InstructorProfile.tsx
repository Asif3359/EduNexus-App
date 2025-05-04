import React, { useLayoutEffect } from 'react';
import { Text, View, Image, ScrollView, SafeAreaView } from 'react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import authorsData from '@/assets/data/authors.json';
import coursesData from '@/assets/data/courseDetails.json';

export default function InstructorProfile() {
    const { email } = useLocalSearchParams<{ email: string }>();
    const navigation = useNavigation();

    const author = authorsData.find(author => author.email === email);
    const authorCourses = coursesData.filter(course => course.email === email);

    // Dynamically set the screen title
    useLayoutEffect(() => {
        if (author) {
            navigation.setOptions({ title: `${author.name}'s Profile` });
        }
    }, [navigation, author]);

    if (!author) {
        return (
            <View className="p-4">
                <Text className="font-semibold text-red-600">
                    Author not found.
                </Text>
            </View>
        );
    }

    return (
        <SafeAreaView>
            <ScrollView className="flex-1 bg-white p-4">
                <View className="mb-6 items-center">
                    <Image
                        source={{ uri: author.image }}
                        className="mb-2 h-24 w-24 rounded-full"
                    />
                    <Text className="text-xl font-bold text-gray-800">
                        {author.name}
                    </Text>
                    <Text className="text-gray-600">{author.email}</Text>
                    <Text className="text-gray-600">{author.mobile}</Text>
                </View>

                <Text className="mb-4 text-base text-gray-700">
                    {author.bio}
                </Text>

                <Text className="mb-2 text-lg font-semibold text-gray-800">
                    Courses by {author.name}
                </Text>
                {authorCourses.map(course => (
                    <View
                        key={course.id}
                        className="mb-3 rounded-lg bg-gray-100 p-3"
                    >
                        <Text className="text-md font-semibold text-gray-800">
                            {course.title}
                        </Text>
                        <Text className="text-sm text-gray-500">
                            {course.duration}
                        </Text>
                        <Text className="text-sm font-semibold text-purple-600">
                            ${course.price}
                        </Text>
                    </View>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
}
