import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
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
            <TouchableOpacity
                onPress={() => handlePress('/teacher/createCourse')}
            >
                <MaterialIcons
                    name="add-circle-outline"
                    size={28}
                    color={
                        pathname === '/teacher/createCourse'
                            ? '#9333ea'
                            : '#000'
                    }
                />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handlePress('/teacher/schedule')}>
                <MaterialIcons
                    name="event"
                    size={28}
                    color={pathname === '/schedule' ? '#9333ea' : '#000'}
                />
            </TouchableOpacity>
            {/* <TouchableOpacity onPress={() => handlePress('/teacher/history')}>
                <MaterialIcons
                    name="history"
                    size={28}
                    color={pathname === '/teacher/history' ? '#9333ea' : '#000'}
                />
            </TouchableOpacity> */}
            <TouchableOpacity onPress={() => handlePress('/teacher/profile')}>
                <Feather
                    name="user"
                    size={28}
                    color={pathname === '/teacher/profile' ? '#9333ea' : '#000'}
                />
            </TouchableOpacity>
        </View>
    );
}

export default BottomNavBarTeacher;
