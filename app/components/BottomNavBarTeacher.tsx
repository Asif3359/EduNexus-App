import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { FontAwesome, MaterialIcons, Feather } from '@expo/vector-icons';

function BottomNavBarTeacher() {
    const router = useRouter();
    const pathname = usePathname();

    const handlePress = (route: string) => {
        router.push(route as any);
    };

    return (
        <View className="absolute bottom-0 left-0 right-0 flex-row items-center justify-around rounded-t-3xl bg-gray-100 py-6">
            <TouchableOpacity onPress={() => handlePress('/teacher')}>
                <FontAwesome
                    name="home"
                    size={28}
                    color={pathname === '/teacher' ? '#9333ea' : '#000'}
                />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handlePress('/teacher/cource')}>
                <MaterialIcons
                    name="menu-book"
                    size={28}
                    color={pathname === '/cource' ? '#9333ea' : '#000'}
                />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handlePress('/teacher/history')}>
                <Feather
                    name="clock"
                    size={28}
                    color={pathname === '/history' ? '#9333ea' : '#000'}
                />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handlePress('/teacher/profile')}>
                <Feather
                    name="user"
                    size={28}
                    color={pathname === '/profile' ? '#9333ea' : '#000'}
                />
            </TouchableOpacity>
        </View>
    );
}

export default BottomNavBarTeacher;
