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
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import axios from 'axios';
import ProfilePictureUploader from '../components/ProfilePictureUploader';

function teacherProfilesetup() {
    const router = useRouter();

    const [skills, setSkills] = useState(['']);
    const [interests, setInterests] = useState(['']);
    const [socialLinks, setSocialLinks] = useState(['']);
    const [educationList, setEducationList] = useState([
        { degree: '', institution: '', year: '', description: '' },
    ]);
    const [student, setStudent] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const [profilePicture, setProfilePicture] = useState('');
    const [profilePictureUrl, setProfilePictureUrl] = useState<string | null>(
        null
    );
    const [mobile, setMobile] = useState('');
    const [bio, setBio] = useState('');

    const apiUrl = (Constants.expoConfig as any).extra.BACKEND_API;

    useEffect(() => {
        const fetchStudent = async () => {
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
                    // Set states using map
                    // console.log('Student bio:', response.data.data.student_profile.bio);
                    // console.log('Student Mobile:', response.data.data.student_profile.mobile);
                    // console.log('Student Profile:', response.data.data.student_profile.profile_picture);
                    setStudent(response.data.data);

                    setSkills(
                        response.data.data.skills.map(
                            (skill: { skill_name: any }) => skill.skill_name
                        )
                    );

                    setInterests(
                        response.data.data.interests.map(
                            (interest: { interest_name: any }) =>
                                interest.interest_name
                        )
                    );

                    setSocialLinks(
                        response.data.data.social_links.map(
                            (link: { social_link: any }) => link.social_link
                        )
                    );

                    setEducationList(
                        response.data.data.educations.map(
                            (edu: {
                                degree: any;
                                institution: any;
                                year: any;
                                description: any;
                            }) => ({
                                degree: edu.degree || '',
                                institution: edu.institution || '',
                                year: edu.year + '' || '',
                                description: edu.description || '',
                            })
                        )
                    );

                    setProfilePicture(
                        response.data.data.teacher_profile?.profile_picture ||
                            ''
                    );
                    setMobile(response.data.data.teacher_profile?.mobile || '');
                    setBio(response.data.data.teacher_profile?.bio || '');
                } else {
                    Alert.alert(
                        'Error',
                        response.data.message || 'Failed to fetch profile.'
                    );
                }
            } catch (error) {
                console.error('Profile fetch error:', error);
                Alert.alert(
                    'Error',
                    'An error occurred while fetching the profile.'
                );
            } finally {
                setLoading(false);
            }
        };

        fetchStudent();
    }, []);

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
        // console.log('Profile Picture:', profilePictureUrl);
        // console.log('Mobile:', mobile);
        // console.log('Bio:', bio);

        if (!profilePicture) {
            alert('Profile picture URL is required.');
            return;
        }

        if (!mobile.trim()) {
            alert('Mobile number is required.');
            return;
        }
        if (!bio.trim()) {
            alert('Bio is required.');
            return;
        }
        if (mobile.length < 11) {
            alert('Mobile number must be 11 digits.');
            return;
        }
        if (!/^\d+$/.test(mobile)) {
            alert('Mobile number must be numeric.');
            return;
        }
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
            profile_picture: profilePicture,
            mobile,
            bio,
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
            const response = await fetch(`${apiUrl}/teacher/profile/update`, {
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

    const handleImageSelected = (imageUri: string) => {
        setProfilePicture(imageUri); // Update the state with the selected image URI
    };

    const handleUploadSuccess = (url: string) => {
        setProfilePictureUrl(url); // Update the state with the uploaded image URL
    };
    const handleUploadError = (error: any) => {
        console.error('Upload error:', error);
        Alert.alert('Error', 'Failed to upload image.');
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            {/* Title */}
            <Text className="bg-purple-700 py-6 text-center text-2xl font-bold text-white">
                Setup your profile
            </Text>
            <ScrollView className="mt-2 px-4 py-2">
                {/* Profile Picture */}

                <ProfilePictureUploader
                    key={Date.now()}
                    onImageSelected={handleImageSelected}
                    onUploadSuccess={handleUploadSuccess}
                    onUploadError={handleUploadError}
                    initialImageUrl={profilePicture}
                />

                {/* {profilePictureUrl && (
                    <Text>{profilePictureUrl}</Text>
                )} */}

                {/* Mobile Number */}
                <Text className="mb-1 text-xl font-semibold">Mobile</Text>
                <TextInput
                    className="mb-4 rounded bg-gray-200 px-3 py-2"
                    placeholder="e.g. 017xxxxxxxx"
                    keyboardType="phone-pad"
                    value={mobile}
                    onChangeText={setMobile}
                />

                {/* Bio */}
                <Text className="mb-1 text-xl font-semibold">Bio</Text>
                <TextInput
                    className="mb-4 h-24 rounded bg-gray-200 px-3 py-2"
                    multiline
                    placeholder="Tell us about yourself..."
                    value={bio}
                    onChangeText={setBio}
                />
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

export default teacherProfilesetup;
