import React, { useState, useEffect } from 'react';
import {
    View,
    TouchableOpacity,
    Image,
    Text,
    ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { randomUUID } from 'expo-crypto';

interface ProfilePictureUploaderProps {
    onImageSelected: (imageUri: string) => void;
    onUploadSuccess?: (publicUrl: string) => void;
    onUploadError?: (error: any) => void;
    initialImageUrl?: string | null;
}

export default function ProfilePictureUploader({
    onImageSelected,
    onUploadSuccess,
    onUploadError,
    initialImageUrl,
}: ProfilePictureUploaderProps) {
    const [image, setImage] = useState<string | null>(initialImageUrl ?? null);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (initialImageUrl) {
            // console.log('Initial image URL:', initialImageUrl);
            setImage(initialImageUrl);
        }
    }, [initialImageUrl]);

    const pickImage = async () => {
        try {
            const permissionResult =
                await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (!permissionResult.granted) {
                alert('Permission to access camera roll is required!');
                return;
            }

            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 1,
            });

            if (!result.canceled) {
                const selectedImageUri = result.assets[0].uri;
                setImage(selectedImageUri);
                await uploadToCloudinary(selectedImageUri);
            }
        } catch (error) {
            console.error('Image picker error:', error);
            onUploadError?.(error);
        }
    };

    const uploadToCloudinary = async (imageUri: string) => {
        setUploading(true);
        try {
            const fileExt = imageUri.split('.').pop()?.toLowerCase() || 'jpg';
            const mimeType = `image/${fileExt === 'png' ? 'png' : 'jpeg'}`;

            const uploadPreset = 'my_edunexus';
            const cloudName = 'dkuroieus';
            const folder = 'edunexus';

            const formData = new FormData();
            formData.append('file', {
                uri: imageUri,
                name: `profile_${randomUUID()}.${fileExt}`,
                type: mimeType,
            } as any);

            formData.append('upload_preset', uploadPreset);
            formData.append('folder', folder);
            formData.append('cloud_name', cloudName);

            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
                {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Accept: 'application/json',
                    },
                }
            );

            const data = await response.json();
            console.log('Upload response:', data);

            if (!response.ok) {
                throw new Error(data.error?.message || 'Upload failed');
            }

            if (data.secure_url) {
                setImage(data.secure_url); // update UI with uploaded image
                onUploadSuccess?.(data.secure_url);
                onImageSelected?.(data.secure_url);
                // console.log('Image uploaded successfully:', data.secure_url);
            } else {
                throw new Error('Upload succeeded but no URL returned');
            }
        } catch (error) {
            console.error('Upload error:', error);
            onUploadError?.(
                error instanceof Error ? error : new Error('Upload failed')
            );
        } finally {
            setUploading(false);
        }
    };

    return (
        <View className="items-center p-4">
            <View className="mb-4 h-40 w-40 items-center justify-center overflow-hidden rounded-full bg-gray-200">
                {uploading ? (
                    <ActivityIndicator size="large" color="#0000ff" />
                ) : (
                    <Image
                        className="h-full w-full rounded-full" // Use the selected image or a default one
                        source={
                            image
                                ? { uri: image }
                                : require('../../assets/images/user.png')
                        }
                        alt="Profile Picture"
                    />
                )}
            </View>

            <TouchableOpacity
                onPress={pickImage}
                className="rounded-lg bg-blue-500 px-4 py-2"
                disabled={uploading}
            >
                <Text className="text-center text-white">
                    {uploading ? 'Uploading...' : 'Choose Profile Picture'}
                </Text>
            </TouchableOpacity>
        </View>
    );
}
