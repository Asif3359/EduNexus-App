import React, { useState } from 'react';
import {
    SafeAreaView,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Alert,
    Image,
    Modal,
    Pressable,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

interface ImageInfo {
    uri: string;
    width?: number;
    height?: number;
    type?: string;
}

const categories = [
    'Development',
    'Business',
    'Finance & Accounting',
    'IT & Software',
    'Office Productivity',
    'Personal Development',
    'Design',
    'Marketing',
    'Lifestyle',
    'Photography & Video',
    'Health & Fitness',
    'Music',
    'Teaching & Academics',
];

function CreateCourse() {
    const [title, setTitle] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [price, setPrice] = useState<string>('');
    const [category, setCategory] = useState<string>('');
    const [showCategoryModal, setShowCategoryModal] = useState<boolean>(false);
    const [thumbnail, setThumbnail] = useState<ImageInfo | null>(null);
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const apiUrl = (Constants.expoConfig as any).extra.BACKEND_API;

    const pickImage = async () => {
        const { status } =
            await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert(
                'Permission required',
                'We need gallery access to upload thumbnails'
            );
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.8,
        });

        if (!result.canceled && result.assets.length > 0) {
            setThumbnail(result.assets[0]);
        }
    };

    const handleSubmit = async () => {
        if (
            !title.trim() ||
            !description.trim() ||
            !price.trim() ||
            !category.trim()
        ) {
            Alert.alert('Error', 'Please fill in all required fields');
            return;
        }

        setIsUploading(true);

        try {
            const userId = await AsyncStorage.getItem('userId');
            const userEmail = await AsyncStorage.getItem('userEmail');
            const userName = await AsyncStorage.getItem('userName');
            const userLocation = await AsyncStorage.getItem('userLocation');

            if (!userId || !userEmail || !userName || !userLocation) {
                throw new Error('User information not found');
            }

            const formData = new FormData();
            formData.append('user_id', userId);
            formData.append('userName', userName);
            formData.append('userEmail', userEmail);
            formData.append('Location', userLocation || '');
            formData.append('title', title);
            formData.append('description', description);
            formData.append('price', parseFloat(price).toString());
            formData.append('category', category);

            if (thumbnail) {
                const localUri = thumbnail.uri;
                const filename =
                    localUri.split('/').pop() || `thumbnail_${Date.now()}.jpg`;
                const match = /\.(\w+)$/.exec(filename);
                const type = match ? `image/${match[1]}` : 'image/jpeg';

                formData.append('thumbnail', {
                    uri: localUri,
                    name: filename,
                    type,
                } as any);
            }

            const response = await fetch(`${apiUrl}/teacher/create-course`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'multipart/form-data',
                },
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to create course');
            }

            Alert.alert('Success', 'Course created successfully!');
            router.push('/teacher/courseList');
        } catch (error) {
            Alert.alert(
                'Error',
                error instanceof Error
                    ? error.message
                    : 'Failed to create course'
            );
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <ScrollView className="p-4">
                <Text className="mb-6 mt-4 text-center text-3xl font-bold text-indigo-700">
                    Create New Course
                </Text>

                <View className="mb-6 rounded-lg bg-white p-4 shadow">
                    <Text className="mb-2 text-lg font-semibold text-gray-800">
                        Course Details
                    </Text>

                    {/* Thumbnail Upload */}
                    <View className="mb-4">
                        <Text className="mb-1 text-sm font-medium text-gray-700">
                            Thumbnail
                        </Text>
                        <TouchableOpacity
                            className="items-center rounded border border-gray-300 p-2"
                            onPress={pickImage}
                        >
                            {thumbnail ? (
                                <Image
                                    source={{ uri: thumbnail.uri }}
                                    className="mb-2 h-40 w-full rounded"
                                    resizeMode="cover"
                                />
                            ) : (
                                <Text className="text-gray-500">
                                    Select an image
                                </Text>
                            )}
                        </TouchableOpacity>
                    </View>

                    {/* Title */}
                    <View className="mb-4">
                        <Text className="mb-1 text-sm font-medium text-gray-700">
                            Title*
                        </Text>
                        <TextInput
                            className="rounded border border-gray-300 p-2"
                            placeholder="Course Title"
                            value={title}
                            onChangeText={setTitle}
                        />
                    </View>

                    {/* Description */}
                    <View className="mb-4">
                        <Text className="mb-1 text-sm font-medium text-gray-700">
                            Description*
                        </Text>
                        <TextInput
                            className="textAlignVertical='top' h-24 rounded border border-gray-300 p-2"
                            placeholder="Course Description"
                            multiline
                            value={description}
                            onChangeText={setDescription}
                        />
                    </View>

                    {/* Category */}
                    <View className="mb-4">
                        <Text className="mb-1 text-sm font-medium text-gray-700">
                            Category*
                        </Text>
                        <TouchableOpacity
                            className="rounded border border-gray-300 p-2"
                            onPress={() => setShowCategoryModal(true)}
                        >
                            <Text
                                className={
                                    category ? 'text-black' : 'text-gray-500'
                                }
                            >
                                {category || 'Select a category'}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Price */}
                    <View className="mb-4">
                        <Text className="mb-1 text-sm font-medium text-gray-700">
                            Price (USD)*
                        </Text>
                        <TextInput
                            className="rounded border border-gray-300 p-2"
                            placeholder="0.00"
                            keyboardType="numeric"
                            value={price}
                            onChangeText={setPrice}
                        />
                    </View>
                </View>

                {/* Submit Button */}
                <TouchableOpacity
                    className="mb-8 rounded-lg bg-indigo-600 p-3"
                    onPress={handleSubmit}
                    disabled={isUploading}
                >
                    <Text className="text-center font-semibold text-white">
                        {isUploading ? 'Uploading...' : 'Create Course'}
                    </Text>
                </TouchableOpacity>

                {/* Category Selection Modal */}
                <Modal
                    visible={showCategoryModal}
                    animationType="slide"
                    transparent={true}
                    onRequestClose={() => setShowCategoryModal(false)}
                >
                    <View className="flex-1 justify-end bg-black/50">
                        <View className="rounded-t-2xl bg-white p-4">
                            <Text className="mb-4 text-lg font-bold">
                                Select Category
                            </Text>
                            <ScrollView className="max-h-80">
                                {categories.map(cat => (
                                    <Pressable
                                        key={cat}
                                        className={`p-3 ${category === cat ? 'bg-indigo-100' : ''}`}
                                        onPress={() => {
                                            setCategory(cat);
                                            setShowCategoryModal(false);
                                        }}
                                    >
                                        <Text className="text-base">{cat}</Text>
                                    </Pressable>
                                ))}
                            </ScrollView>
                            <TouchableOpacity
                                className="mt-4 rounded-lg border border-gray-300 p-3"
                                onPress={() => setShowCategoryModal(false)}
                            >
                                <Text className="text-center">Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </ScrollView>
        </SafeAreaView>
    );
}

export default CreateCourse;
