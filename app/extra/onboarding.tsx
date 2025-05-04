import { Stack } from 'expo-router';
import { SafeAreaView, View } from 'react-native';
import '../../global.css';

export default function onboardingLayout() {
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Stack>
                <Stack.Screen
                    name="index"
                    options={{
                        title: 'Student Home',
                        headerShown: false,
                        animation: 'none',
                    }}
                />
                <Stack.Screen
                    name="course"
                    options={{
                        title: 'course ',
                        headerShown: false,
                        animation: 'none',
                    }}
                />
            </Stack>
        </SafeAreaView>
    );
}
