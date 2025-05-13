import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

export default function ProfileSetupScreen() {
    const router = useRouter();

    const [skills, setSkills] = useState(['']);
    const [interests, setInterests] = useState(['']);
    const [socialLinks, setSocialLinks] = useState(['']);
    const [educationList, setEducationList] = useState([
        { degree: '', institution: '', year: '', description: '' },
    ]);

    const apiUrl = (Constants.expoConfig as any).extra.BACKEND_API;

    const handleSkillChange = (text: string, index: number) => {
        const updated = [...skills];
        updated[index] = text;
        setSkills(updated);
    };

    const handleInterestChange = (text: string, index: number) => {
        const updated = [...interests];
        updated[index] = text;
        setInterests(updated);
    };

    const handleLinkChange = (text: string, index: number) => {
        const updated = [...socialLinks];
        updated[index] = text;
        setSocialLinks(updated);
    };
    type EducationKey = 'degree' | 'institution' | 'year' | 'description';

    const handleEducationChange = (
        index: number,
        key: EducationKey,
        value: string
    ) => {
        const updated = [...educationList];
        updated[index][key] = value;
        setEducationList(updated);
    };

    // Handle form submission
    const handleSubmit = async () => {
        // Validate first skill, interest, link, and education fields
        if (!skills[0].trim()) {
            alert('Skill is required.');
            return;
        }

        if (!interests[0].trim()) {
            alert('Interest is required.');
            return;
        }

        if (!socialLinks[0].trim()) {
            alert('Social link is required.');
            return;
        }

        const firstEdu = educationList[0];
        if (
            !firstEdu.degree.trim() ||
            !firstEdu.institution.trim() ||
            !firstEdu.year.trim() ||
            !firstEdu.description.trim()
        ) {
            alert('All fields in the first education section are required.');
            return;
        }

        const user_id = await AsyncStorage.getItem('userId');
        const userName = await AsyncStorage.getItem('userName');
        const userEmail = await AsyncStorage.getItem('userEmail');
        const userRole = await AsyncStorage.getItem('role');
        const userLocation = await AsyncStorage.getItem('userLocation');
        console.log('User ID:', user_id);
        console.log('User Name:', userName);
        console.log('User Email:', userEmail);
        console.log('User Role:', userRole);
        console.log('User Location:', userLocation);
        // Gather profile data
        const profileData = {
            user_id,
            userName,
            userEmail,
            userRole,
            skills,
            interests,
            socialLinks,
            education: educationList,
            Location: userLocation,
        };

        // console.log('Submitted Data:', profileData);

        const token = await AsyncStorage.getItem('userToken');
        console.log('Token:', token);

        try {
            const response = await fetch(`${apiUrl}/save-profile`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(profileData),
            });

            const data = await response.json(); // <-- this is REQUIRED

            console.log('Response:', data); // <-- this is what you should see in the browser
            // console

            if (response.ok) {
                // Reset form
                setSkills(['']);
                setInterests(['']);
                setSocialLinks(['']);
                setEducationList([
                    {
                        degree: '',
                        institution: '',
                        year: '',
                        description: '',
                    },
                ]);

                // Navigate based on role
                const userRole = await AsyncStorage.getItem('role');
                if (userRole === 'student') {
                    router.replace('/user');
                }
                if (userRole === 'teacher') {
                    router.replace('/teacher');
                }
                console.log('Success:', data.message); // 👈 Print success message
            } else {
                console.error(
                    'Error:',
                    data.message || 'Failed to save profile.'
                );
            }
        } catch (error) {
            console.error('Error saving profile:', error); // if there's a network error
        }
    };

    return (
        <SafeAreaView className="mb-20 flex-1 bg-white">
            {/* Title */}
            <Text className="bg-purple-700 py-6 text-center text-2xl font-bold text-white">
                Setup your profile
            </Text>
            <ScrollView className="mt-2 px-4 py-2">
                {/* Skills */}
                <Text className="mb-1 text-xl font-semibold">Skills</Text>
                {skills.map((skill, index) => (
                    <TextInput
                        key={index}
                        className="mb-2 rounded bg-gray-200 px-3 py-2"
                        placeholder="e.g, HTML"
                        value={skill}
                        onChangeText={text => handleSkillChange(text, index)}
                    />
                ))}
                <TouchableOpacity
                    onPress={() => setSkills([...skills, ''])}
                    className="mb-4 rounded-xl bg-purple-600 py-2 hover:bg-purple-700 active:bg-purple-800"
                >
                    <Text className="text-center font-medium text-white">
                        Add more skill
                    </Text>
                </TouchableOpacity>

                {/* Interests */}
                <Text className="mb-1 text-xl font-semibold">Interest</Text>
                {interests.map((interest, index) => (
                    <TextInput
                        key={index}
                        className="mb-2 rounded bg-gray-200 px-3 py-2"
                        placeholder="e.g, AI, ML"
                        value={interest}
                        onChangeText={text => handleInterestChange(text, index)}
                    />
                ))}
                <TouchableOpacity
                    onPress={() => setInterests([...interests, ''])}
                    className="mb-4 rounded-xl bg-purple-600 py-2 hover:bg-purple-700 active:bg-purple-800"
                >
                    <Text className="text-center font-medium text-white">
                        Add more interest
                    </Text>
                </TouchableOpacity>

                {/* Social Links */}
                <Text className="mb-1 text-xl font-semibold">Social Links</Text>
                {socialLinks.map((link, index) => (
                    <TextInput
                        key={index}
                        className="mb-2 rounded bg-gray-200 px-3 py-2"
                        placeholder="http://linkedin.com/in/yourname"
                        value={link}
                        onChangeText={text => handleLinkChange(text, index)}
                    />
                ))}
                <TouchableOpacity
                    onPress={() => setSocialLinks([...socialLinks, ''])}
                    className="mb-4 rounded-xl bg-purple-600 py-2 hover:bg-purple-700 active:bg-purple-800"
                >
                    <Text className="text-center font-medium text-white">
                        Add more link
                    </Text>
                </TouchableOpacity>

                {/* Education */}
                <Text className="mb-1 mt-4 text-xl font-semibold">
                    University
                </Text>
                {educationList.map((edu, index) => (
                    <View key={index} className="mb-4">
                        <Text className="mb-1 mt-2 text-sm font-semibold">
                            Degree
                        </Text>
                        <TextInput
                            className="mb-2 rounded bg-gray-200 px-3 py-2"
                            placeholder="BSC, in CSE"
                            value={edu.degree}
                            onChangeText={text =>
                                handleEducationChange(index, 'degree', text)
                            }
                        />
                        <Text className="mb-1 text-sm font-semibold">
                            Institution
                        </Text>
                        <TextInput
                            className="mb-2 rounded bg-gray-200 px-3 py-2"
                            placeholder="BUBT"
                            value={edu.institution}
                            onChangeText={text =>
                                handleEducationChange(
                                    index,
                                    'institution',
                                    text
                                )
                            }
                        />
                        <Text className="mb-1 text-sm font-semibold">
                            Passing Year
                        </Text>
                        <TextInput
                            className="mb-2 rounded bg-gray-200 px-3 py-2"
                            placeholder="1/5/2024"
                            value={edu.year}
                            onChangeText={text =>
                                handleEducationChange(index, 'year', text)
                            }
                        />
                        <Text className="mb-1 text-sm font-semibold">
                            Description
                        </Text>
                        <TextInput
                            className="text-top h-20 rounded bg-gray-200 px-3 py-2"
                            placeholder="Describe your education background"
                            value={edu.description}
                            onChangeText={text =>
                                handleEducationChange(
                                    index,
                                    'description',
                                    text
                                )
                            }
                            multiline
                        />
                    </View>
                ))}
                <TouchableOpacity
                    onPress={() =>
                        setEducationList([
                            ...educationList,
                            {
                                degree: '',
                                institution: '',
                                year: '',
                                description: '',
                            },
                        ])
                    }
                    className="mb-6 rounded-xl bg-purple-600 py-2 hover:bg-purple-700 active:bg-purple-800"
                >
                    <Text className="text-center font-medium text-white">
                        Add more education
                    </Text>
                </TouchableOpacity>

                {/* Submit */}
                <TouchableOpacity
                    onPress={handleSubmit}
                    className="mb-10 rounded bg-green-600 py-3"
                >
                    <Text className="text-center font-semibold text-white">
                        Submit Profile
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}
