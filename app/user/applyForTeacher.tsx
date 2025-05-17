/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import {
    SafeAreaView,
    Text,
    TextInput,
    View,
    TouchableOpacity,
    ScrollView,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { useStripe } from '@stripe/stripe-react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { MaterialIcons } from '@expo/vector-icons';

const TEACHER_SUBSCRIPTION_PRICE = 99.99; // Monthly subscription price

interface Experience {
    organization: string;
    role: string;
    duration: string;
    description: string;
}

function ApplyForTeacher() {
    const [experiences, setExperiences] = useState<Experience[]>([
        { organization: '', role: '', duration: '', description: '' },
    ]);

    const [loading, setLoading] = useState(false);

    const router = useRouter();
    const apiUrl = (Constants.expoConfig as any).extra.BACKEND_API;

    const handleExperienceChange = (
        index: number,
        field: keyof Experience,
        value: string
    ) => {
        const newExperiences = [...experiences];
        newExperiences[index] = {
            ...newExperiences[index],
            [field]: value,
        };
        setExperiences(newExperiences);
    };

    const addExperience = () => {
        setExperiences([
            ...experiences,
            { organization: '', role: '', duration: '', description: '' },
        ]);
    };

    const removeExperience = (index: number) => {
        if (experiences.length > 1) {
            const newExperiences = experiences.filter((_, i) => i !== index);
            setExperiences(newExperiences);
        }
    };

    const handleSubmit = async () => {
        const hasEmptyExperience = experiences.some(
            exp => !exp.organization || !exp.role || !exp.duration
        );
        if (hasEmptyExperience) {
            Alert.alert(
                'Error',
                'Please fill in all required experience fields'
            );
            return;
        }

        setLoading(true);
        try {
            const userId = await AsyncStorage.getItem('userId');
            const clientSecret = await AsyncStorage.getItem('clientSecret');

            const teacherResponse = await fetch(`${apiUrl}/apply-teacher`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId,
                    experiences,
                    location: 'Khulna',
                    paymentIntentId: clientSecret,
                }),
            });

            const data = await teacherResponse.json();

            if (!teacherResponse.ok) {
                throw new Error('Failed to submit teacher application');
            }

            await AsyncStorage.setItem('role', data.user.Location);

            Alert.alert(
                'Success',
                'Your teacher application has been submitted successfully!',
                [
                    {
                        text: 'OK',
                        onPress: () => router.replace('/teacher'),
                    },
                ]
            );
        } catch (error) {
            // console.log(error.message);
            Alert.alert(
                'Error r',
                error instanceof Error
                    ? error.message
                    : 'Something went wrong. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <ScrollView className="flex-1 p-5 pb-20">
                <View className="mb-6">
                    <Text className="mb-2 text-3xl font-bold text-gray-900">
                        Become a Teacher
                    </Text>
                </View>

                {/* Experience Section */}
                <View className="mb-8 rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                    <View className="mb-4 flex-row items-center">
                        <MaterialIcons name="work" size={24} color="#7c3aed" />
                        <Text className="ml-2 text-lg font-semibold text-gray-900">
                            Teaching Experience
                        </Text>
                    </View>

                    {experiences.map((exp, index) => (
                        <View
                            key={index}
                            className="mb-6 border-b border-gray-100 pb-6 last:mb-0 last:border-0 last:pb-0"
                        >
                            <View className="mb-3 flex-row items-center justify-between">
                                <Text className="font-medium text-gray-900">
                                    Experience #{index + 1}
                                </Text>
                                {experiences.length > 1 && (
                                    <TouchableOpacity
                                        onPress={() => removeExperience(index)}
                                        className="p-2"
                                    >
                                        <MaterialIcons
                                            name="delete"
                                            size={20}
                                            color="#ef4444"
                                        />
                                    </TouchableOpacity>
                                )}
                            </View>

                            <Text className="mb-1 text-sm font-medium text-gray-700">
                                Organization*
                            </Text>
                            <TextInput
                                className="mb-3 rounded-lg border border-gray-300 p-3"
                                placeholder="School or institution name"
                                value={exp.organization}
                                onChangeText={value =>
                                    handleExperienceChange(
                                        index,
                                        'organization',
                                        value
                                    )
                                }
                            />

                            <Text className="mb-1 text-sm font-medium text-gray-700">
                                Role*
                            </Text>
                            <TextInput
                                className="mb-3 rounded-lg border border-gray-300 p-3"
                                placeholder="Your teaching role"
                                value={exp.role}
                                onChangeText={value =>
                                    handleExperienceChange(index, 'role', value)
                                }
                            />

                            <Text className="mb-1 text-sm font-medium text-gray-700">
                                Duration*
                            </Text>
                            <TextInput
                                className="mb-3 rounded-lg border border-gray-300 p-3"
                                placeholder="e.g., 2 years"
                                value={exp.duration}
                                onChangeText={value =>
                                    handleExperienceChange(
                                        index,
                                        'duration',
                                        value
                                    )
                                }
                            />

                            <Text className="mb-1 text-sm font-medium text-gray-700">
                                Description
                            </Text>
                            <TextInput
                                className="h-20 rounded-lg border border-gray-300 p-3"
                                placeholder="Describe your teaching responsibilities"
                                multiline
                                value={exp.description}
                                onChangeText={value =>
                                    handleExperienceChange(
                                        index,
                                        'description',
                                        value
                                    )
                                }
                            />
                        </View>
                    ))}

                    <TouchableOpacity
                        onPress={addExperience}
                        className="mt-2 flex-row items-center justify-center rounded-lg bg-purple-50 py-3"
                    >
                        <MaterialIcons name="add" size={20} color="#7c3aed" />
                        <Text className="ml-2 font-medium text-purple-600">
                            Add Another Experience
                        </Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    className="mb-8 items-center justify-center rounded-lg bg-purple-600 py-4"
                    onPress={handleSubmit}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text className="text-base font-semibold text-white">
                            Submit Application
                        </Text>
                    )}
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

export default ApplyForTeacher;
