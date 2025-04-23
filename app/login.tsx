import React, { useState } from 'react';
import { Text, View, Image, TouchableOpacity } from 'react-native'; // Import CheckBox
import axios from 'axios';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

import AuthInputField from '@/src/components/utils/auth/AuthInputField';
import AuthButton from '@/src/components/utils/auth/AuthButton';
import SocialButton from '@/src/components/utils/auth/SocialButton';

export default function LoginScreen() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [remember, setRemember] = useState(true); // State for Remember me

    const handleLogin = async () => {
        setError('');

        if (email && password) {
            try {
                const response = await axios.post(
                    'http://10.0.2.2:8000/api/login',
                    {
                        email: email,
                        password: password,
                        remember: remember, // Send remember me state
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            Accept: 'application/json',
                        },
                    }
                );

                const data = response.data;

                if (response.status === 200 && data.token) {
                    console.log('Login successful:', data);

                    // Save token and user data in AsyncStorage
                    await AsyncStorage.setItem('userToken', data.token);
                    await AsyncStorage.setItem(
                        'userId',
                        data.user.id.toString()
                    );
                    await AsyncStorage.setItem('userName', data.user.name);
                    await AsyncStorage.setItem('userEmail', data.user.email);
                    await AsyncStorage.setItem('isFirstTime', 'false');
                    await AsyncStorage.setItem('userLoggedIn', 'true');

                    router.push('/'); // Redirect to home/dashboard
                } else {
                    setError(data.message || 'Login failed');
                }
            } catch (err) {
                console.error('Login Error:', err);
                setError('Invalid credentials or server error');
            }
        } else {
            setError('Please fill out all fields');
        }
    };

    return (
        <View className="flex-1 items-center justify-center bg-white px-6">
            {/* Logo */}
            <Image
                source={require('../assets/images/icon.png')}
                className="mb-4 h-24 w-24"
            />

            {/* Welcome Message */}
            <Text className="text-2xl font-bold text-gray-800">
                Welcome Back
            </Text>
            <Text className="mt-1 text-gray-500">Sign in to continue</Text>

            <AuthInputField
                label="Email"
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
            />

            <AuthInputField
                label="Password"
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword}
                isPassword={true}
                secureTextEntry={true}
            />

            {/* Remember me checkbox
            <View className="flex-row items-center mt-4">
                <CheckBox
                    value={remember}
                    onValueChange={setRemember} // Toggle remember state
                />
                <Text className="text-gray-600 ml-2">Remember me</Text>
            </View> */}

            {error ? <Text className="mt-2 text-red-500">{error}</Text> : null}

            <AuthButton title="Sign In" onPress={handleLogin} />

            {/* Divider */}
            <View className="my-4 w-full flex-row items-center">
                <View className="h-[1px] flex-1 bg-gray-300"></View>
                <Text className="px-2 text-gray-500">Or continue with</Text>
                <View className="h-[1px] flex-1 bg-gray-300"></View>
            </View>

            {/* Social Media Buttons */}
            <View className="flex-row gap-4 space-x-4">
                <SocialButton
                    title="Apple"
                    iconName="apple"
                    color="black"
                    onPress={() => console.log('Apple Login')}
                />
                <SocialButton
                    title="Google"
                    iconName="google"
                    color="red"
                    onPress={() => console.log('Google Login')}
                />
                <SocialButton
                    title="Facebook"
                    iconName="facebook"
                    color="blue"
                    onPress={() => console.log('Facebook Login')}
                />
            </View>

            {/* Sign Up and Forgot Password */}
            <View className="mt-6 w-full flex-col items-center">
                <View className="flex-row">
                    <Text>Don't have an account?</Text>
                    <TouchableOpacity onPress={() => router.push('/signup')}>
                        <Text className="text-blue-600"> Sign Up</Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity
                    onPress={() => router.push('/forgotPassword')}
                    className="mt-2"
                >
                    <Text className="text-blue-600">Forgot Password?</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
