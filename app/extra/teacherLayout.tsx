import { Stack } from 'expo-router';
import { SafeAreaView, View } from 'react-native';
import '../../global.css';

export default function teacherlayout() {
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Stack>
                <Stack.Screen
                    name="index"
                    options={{
                        title: 'Teacher Home',
                        headerShown: false,
                        animation: 'none',
                    }}
                />
            </Stack>
        </SafeAreaView>
    );
}
