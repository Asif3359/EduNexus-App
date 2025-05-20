import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
    Alert,
    Image,
    ActivityIndicator,
    StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialIcons, Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import axios from 'axios';
import ProfilePictureUploader from '../components/ProfilePictureUploader';

function TeacherProfileScreen() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('setup'); // 'setup' or 'info'
    const [skills, setSkills] = useState(['']);
    const [interests, setInterests] = useState(['']);
    const [socialLinks, setSocialLinks] = useState(['']);
    const [educationList, setEducationList] = useState([
        { degree: '', institution: '', year: '', description: '' },
    ]);
    const [teacher, setTeacher] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [profilePicture, setProfilePicture] = useState('');
    const [mobile, setMobile] = useState('');
    const [bio, setBio] = useState('');
    const apiUrl = (Constants.expoConfig as any).extra.BACKEND_API;

    useEffect(() => {
        fetchTeacherProfile();
    }, []);

    const fetchTeacherProfile = async () => {
        try {
            const userId = await AsyncStorage.getItem('userId');
            const userLocation = await AsyncStorage.getItem('userLocation');
            if (!userId) {
                Alert.alert('Error', 'Missing user ID.');
                setLoading(false);
                return;
            }

            const response = await axios.get(
                `${apiUrl}/teacher/profile/${userId}`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                        Location: userLocation,
                    },
                }
            );

            if (response.data.success) {
                setTeacher(response.data.data);
                setSkills(
                    response.data.data.skills?.map(
                        (skill: { skill_name: any }) => skill.skill_name
                    ) || ['']
                );
                setInterests(
                    response.data.data.interests?.map(
                        (interest: { interest_name: any }) =>
                            interest.interest_name
                    ) || ['']
                );
                setSocialLinks(
                    response.data.data.social_links?.map(
                        (link: { social_link: any }) => link.social_link
                    ) || ['']
                );
                setEducationList(
                    response.data.data.educations?.length > 0
                        ? response.data.data.educations.map((edu: any) => ({
                              degree: edu.degree || '',
                              institution: edu.institution || '',
                              year: edu.year?.toString() || '',
                              description: edu.description || '',
                          }))
                        : [
                              {
                                  degree: '',
                                  institution: '',
                                  year: '',
                                  description: '',
                              },
                          ]
                );
                setProfilePicture(
                    response.data.data.teacher_profile?.profile_picture || ''
                );
                setMobile(response.data.data.teacher_profile?.mobile || '');
                setBio(response.data.data.teacher_profile?.bio || '');
            }
        } catch (error) {
            console.error('Profile fetch error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        await AsyncStorage.clear();
        router.replace('/login');
    };

    // ... [keep all your existing handler functions] ...

    const renderProfileInfo = () => (
        <View className="p-4">
            <View className="mb-6 items-center">
                {profilePicture ? (
                    <Image
                        source={{ uri: profilePicture }}
                        className="h-32 w-32 rounded-full"
                    />
                ) : (
                    <View className="h-32 w-32 items-center justify-center rounded-full bg-gray-200">
                        <Ionicons name="person" size={48} color="gray" />
                    </View>
                )}
                <Text className="mt-2 text-xl font-bold">
                    {teacher?.name || 'Teacher Name'}
                </Text>
                <Text className="text-gray-600">{teacher?.email || ''}</Text>
            </View>

            <View className="mb-6">
                <Text className="mb-2 text-lg font-bold">About</Text>
                <Text className="text-gray-700">
                    {bio || 'No bio provided'}
                </Text>
            </View>

            <View className="mb-6">
                <Text className="mb-2 text-lg font-bold">Contact</Text>
                <Text className="text-gray-700">
                    {mobile || 'No mobile provided'}
                </Text>
            </View>

            <View className="mb-6">
                <Text className="mb-2 text-lg font-bold">Skills</Text>
                <View className="flex-row flex-wrap">
                    {skills.filter(s => s.trim()).length > 0 ? (
                        skills
                            .filter(s => s.trim())
                            .map((skill, index) => (
                                <View
                                    key={index}
                                    className="mb-2 mr-2 rounded-full bg-purple-100 px-3 py-1"
                                >
                                    <Text className="text-purple-800">
                                        {skill}
                                    </Text>
                                </View>
                            ))
                    ) : (
                        <Text className="text-gray-500">No skills added</Text>
                    )}
                </View>
            </View>

            <View className="mb-6">
                <Text className="mb-2 text-lg font-bold">Education</Text>
                {educationList.filter(e => e.degree.trim()).length > 0 ? (
                    educationList
                        .filter(e => e.degree.trim())
                        .map((edu, index) => (
                            <View
                                key={index}
                                className="mb-4 border-b border-gray-100 pb-4"
                            >
                                <Text className="font-semibold">
                                    {edu.degree}
                                </Text>
                                <Text className="text-gray-600">
                                    {edu.institution}
                                </Text>
                                <Text className="text-sm text-gray-500">
                                    {edu.year}
                                </Text>
                                <Text className="mt-1 text-gray-700">
                                    {edu.description}
                                </Text>
                            </View>
                        ))
                ) : (
                    <Text className="text-gray-500">No education added</Text>
                )}
            </View>
        </View>
    );

    const renderSetupProfile = () => (
        <ScrollView className="px-4 py-2">
            {/* Profile Picture */}
            <View className="mb-6 items-center">
                <ProfilePictureUploader
                    onImageSelected={setProfilePicture}
                    initialImageUrl={profilePicture}
                />
            </View>

            {/* Mobile Number */}
            <View className="mb-4">
                <Text className="mb-1 text-sm font-medium text-gray-700">
                    Mobile
                </Text>
                <TextInput
                    className="rounded-lg border border-gray-300 px-4 py-3"
                    placeholder="e.g. 017xxxxxxxx"
                    keyboardType="phone-pad"
                    value={mobile}
                    onChangeText={setMobile}
                />
            </View>

            {/* Bio */}
            <View className="mb-4">
                <Text className="mb-1 text-sm font-medium text-gray-700">
                    Bio
                </Text>
                <TextInput
                    className="h-24 rounded-lg border border-gray-300 px-4 py-3"
                    multiline
                    placeholder="Tell us about yourself..."
                    value={bio}
                    onChangeText={setBio}
                />
            </View>

            {/* Skills */}
            <View className="mb-4">
                <Text className="mb-1 text-sm font-medium text-gray-700">
                    Skills
                </Text>
                {skills.map((skill, index) => (
                    <View key={index} className="mb-2">
                        <TextInput
                            className="rounded-lg border border-gray-300 px-4 py-2"
                            placeholder="e.g, HTML"
                            value={skill}
                            onChangeText={text =>
                                handleSkillChange(text, index)
                            }
                        />
                    </View>
                ))}
                <TouchableOpacity
                    onPress={() => setSkills([...skills, ''])}
                    className="flex-row items-center justify-center rounded-lg border border-purple-100 bg-purple-50 py-2"
                >
                    <Ionicons name="add" size={18} color="#9333ea" />
                    <Text className="ml-1 text-purple-700">Add Skill</Text>
                </TouchableOpacity>
            </View>

            {/* ... [similar styling for other sections] ... */}

            {/* Submit Button */}
            <TouchableOpacity
                onPress={handleSubmit}
                className="mb-10 mt-6 rounded-lg bg-purple-600 py-3"
            >
                <Text className="text-center font-semibold text-white">
                    Save Profile
                </Text>
            </TouchableOpacity>
        </ScrollView>
    );

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            {/* Header */}
            <View className="bg-white shadow-sm">
                <View className="flex-row items-center justify-between border-b border-gray-100 p-4">
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={24} color="#6b7280" />
                    </TouchableOpacity>
                    <Text className="text-xl font-bold">Teacher Profile</Text>
                    <View style={{ width: 24 }} /> {/* Spacer for alignment */}
                </View>

                {/* Profile Tabs */}
                <View className="flex-row border-b border-gray-100">
                    <TouchableOpacity
                        className={`flex-1 items-center py-3 ${activeTab === 'info' ? 'border-b-2 border-purple-600' : ''}`}
                        onPress={() => setActiveTab('info')}
                    >
                        <Text
                            className={`font-medium ${activeTab === 'info' ? 'text-purple-600' : 'text-gray-600'}`}
                        >
                            Profile Info
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        className={`flex-1 items-center py-3 ${activeTab === 'setup' ? 'border-b-2 border-purple-600' : ''}`}
                        onPress={() => setActiveTab('setup')}
                    >
                        <Text
                            className={`font-medium ${activeTab === 'setup' ? 'text-purple-600' : 'text-gray-600'}`}
                        >
                            Edit Profile
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Content */}
            {loading ? (
                <View className="flex-1 items-center justify-center">
                    <ActivityIndicator size="large" color="#9333ea" />
                </View>
            ) : activeTab === 'info' ? (
                renderProfileInfo()
            ) : (
                renderSetupProfile()
            )}

            {/* Bottom Menu */}
            <View className="border-t border-gray-200 bg-white p-4">
                <TouchableOpacity
                    className="flex-row items-center justify-between py-3"
                    onPress={() => router.push('/teacher/settings')}
                >
                    <Text className="text-gray-700">Settings</Text>
                    <Feather name="chevron-right" size={20} color="#9ca3af" />
                </TouchableOpacity>
                <TouchableOpacity
                    className="flex-row items-center justify-between py-3"
                    onPress={handleLogout}
                >
                    <Text className="text-red-600">Logout</Text>
                    <Feather name="chevron-right" size={20} color="#9ca3af" />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
        color: '#374151',
    },
    input: {
        borderWidth: 1,
        borderColor: '#d1d5db',
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
        backgroundColor: 'white',
    },
    tag: {
        backgroundColor: '#f3e8ff',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        marginRight: 8,
        marginBottom: 8,
    },
});

export default TeacherProfileScreen;
