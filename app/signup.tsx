import { useState } from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    Image,
    ActivityIndicator,
    SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import SocialButton from '@/src/components/utils/auth/SocialButton';
import AuthButton from '@/src/components/utils/auth/AuthButton';
import AuthInputField from '@/src/components/utils/auth/AuthInputField';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

export default function SignUpScreen() {
    const router = useRouter();
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const apiUrl = (Constants.expoConfig as any).extra.BACKEND_API;

    const handleSignUp = async () => {
        setError('');
        setLoading(true);

        if (email && password && fullName) {
            try {
                const response = await fetch(`${apiUrl}/register`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                    },
                    body: JSON.stringify({
                        name: fullName.trim(),
                        email: email.trim(),
                        password: password,
                        role: 'student', // If your backend accepts this, or remove if unnecessary
                        Location: 'Khulna',
                    }),
                });

                const data = await response.json();

                if (response.ok) {
                    // Save token and user data
                    await AsyncStorage.setItem('userToken', data.token);
                    await AsyncStorage.setItem(
                        'userId',
                        data.user.user_id.toString()
                    );
                    await AsyncStorage.setItem('userName', data.user.name);
                    await AsyncStorage.setItem('userEmail', data.user.email);
                    await AsyncStorage.setItem('userLoggedIn', 'true');
                    await AsyncStorage.setItem('isFirstTime', 'false');
                    await AsyncStorage.setItem('role', data.user.role);

                    router.push('/verification?source=signup');
                } else {
                    setError(data.message || 'Signup failed');
                }
            } catch (error) {
                console.error('Signup Error:', error);
                setError('Something went wrong. Please try again later.');
            } finally {
                setLoading(false);
            }
        } else {
            setError('Please fill out all fields');
            setLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 items-center justify-center bg-white px-6">
            <Image
                source={require('../assets/images/icon.png')}
                className="mb-4 h-24 w-24"
            />
            <Text className="text-2xl font-bold text-gray-800">
                Create your account
            </Text>
            <Text className="mt-1 text-gray-500">Join our community today</Text>

            <AuthInputField
                label="Full Name"
                placeholder="Enter your full name"
                value={fullName}
                onChangeText={setFullName}
            />
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

            {error ? <Text className="mt-2 text-red-500">{error}</Text> : null}
            {loading ? (
                <ActivityIndicator
                    className="mt-4"
                    size="large"
                    color="#1e40af"
                />
            ) : (
                <AuthButton title="Sign Up" onPress={handleSignUp} />
            )}

            <View className="my-4 w-full flex-row items-center">
                <View className="h-[1px] flex-1 bg-gray-300" />
                <Text className="px-2 text-gray-500">Or continue with</Text>
                <View className="h-[1px] flex-1 bg-gray-300" />
            </View>

            <View className="flex-row gap-4 space-x-4">
                <SocialButton
                    title="Apple"
                    iconName="apple"
                    color="black"
                    onPress={() => {}}
                />
                <SocialButton
                    title="Google"
                    iconName="google"
                    color="red"
                    onPress={() => {}}
                />
                <SocialButton
                    title="Facebook"
                    iconName="facebook"
                    color="blue"
                    onPress={() => {}}
                />
            </View>

            <View className="mt-6 flex-row">
                <Text>Already have an account?</Text>
                <TouchableOpacity onPress={() => router.push('/login')}>
                    <Text className="text-blue-600"> Log In</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
