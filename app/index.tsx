import { useEffect, useState } from 'react';
import {
    View,
    Text,
    ActivityIndicator,
    ScrollView,
    TouchableOpacity,
    Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WebView } from 'react-native-webview';
import courseData from '@/assets/data/courseDetails.json';
import BottomNavigationBar from './components/BottomNavigationBar';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
    const router = useRouter();
    const [isFirstTime, setIsFirstTime] = useState<boolean | null>(null);
    const [userExists, setUserExists] = useState<boolean | null>(null);
    const [userInterests, setUserInterests] = useState<string[]>([]);

    useEffect(() => {
        const checkAppState = async () => {
            try {
                const firstTime = await AsyncStorage.getItem('isFirstTime');
                if (firstTime === null) {
                    await AsyncStorage.setItem('isFirstTime', 'false');
                    setIsFirstTime(true);
                } else {
                    setIsFirstTime(false);
                    const userLoggedIn =
                        await AsyncStorage.getItem('userToken');
                    setUserExists(!!userLoggedIn);

                    const savedInterests =
                        await AsyncStorage.getItem('userInterests');
                    if (savedInterests) {
                        setUserInterests(JSON.parse(savedInterests));
                    }
                }
            } catch (error) {
                console.error('Error loading app state:', error);
                setIsFirstTime(false);
                setUserExists(false);
            }
        };

        checkAppState();
    }, []);

    useEffect(() => {
        const checkUserRoleAndRedirect = async () => {
            if (userExists === true) {
                const userRole = await AsyncStorage.getItem('role');
                console.log('User role:', userRole);
                if (userRole === 'admin') {
                    router.replace('/');
                } else if (userRole === 'student') {
                    router.replace('/user');
                } else if (userRole === 'teacher') {
                    router.replace('/teacher');
                }
            } else if (isFirstTime === true) {
                router.replace('/onboarding');
            } else if (userExists === false) {
                router.replace('/login');
            }
        };

        checkUserRoleAndRedirect();
    }, [isFirstTime, router, userExists]);

    // Default user interest from course data
    const defaultUserInterests = {
        categories: ['Development'],
        instructors: ['John Doe'],
    };

    // Filter suggested courses based on interest
    const suggestedCourses = courseData.filter(
        course =>
            defaultUserInterests.categories.includes(course.category) ||
            defaultUserInterests.instructors.includes(course.instructor)
    );

    // Suggested courses based on interests
    // const suggestedCourses = courseData.filter(course =>
    //     userInterests.includes(course.category)
    // );

    // Top courses based on rating
    const topRatedCourses = [...courseData]
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 5);

    const topSelingCourse = [...courseData]
        .sort((a, b) => b.sellCount - a.sellCount)
        .slice(0, 5);

    return (
        <SafeAreaView className="flex-1 bg-white">
            <ScrollView className="mb-20 flex-1 px-4 pt-4">
                <Text className="text-lg text-gray-500">Hi, There as</Text>
                <Text className="mt-1 text-sm text-gray-400">
                    What would you like to learn today? Search below.
                </Text>

                {/* Banner */}
                <View className="mt-4 flex-row items-center justify-center rounded-2xl bg-purple-100 p-4">
                    <Text className="flex-1 text-lg font-semibold text-purple-700">
                        Hello there! Welcome to our learning platform. Explore
                        and learn at your own pace.
                    </Text>
                    <Image
                        source={require('@/assets/images/webIllustration.png')}
                        className="mt-2 h-32 w-full flex-1"
                        resizeMode="contain"
                    />
                </View>

                {/* Categories */}
                {/* <View className="mt-6">
                    <Text className="mb-2 text-base font-semibold">Categories</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {homeData.categories.map((category, idx) => (
                            <TouchableOpacity
                                key={idx}
                                className="mr-2 rounded-full bg-gray-200 px-4 py-2"
                            >
                                <Text className="text-sm text-gray-700">{category}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View> */}

                {/* Suggestions */}
                <View className="mt-6">
                    <Text className="mb-2 text-lg font-semibold">
                        Suggestions for You
                    </Text>
                    {suggestedCourses.length === 0 ? (
                        <Text className="text-sm italic text-gray-400">
                            No suggestions available. Please update your
                            interests.
                        </Text>
                    ) : (
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                        >
                            {suggestedCourses.map((course, idx) => {
                                const introVideoUrl =
                                    course.modules?.[0]?.videos?.[0]?.url || '';

                                return (
                                    <View
                                        key={idx}
                                        className="mr-4 w-80 rounded-2xl border border-gray-200 bg-white p-2 shadow-lg"
                                    >
                                        <WebView
                                            source={{ uri: introVideoUrl }}
                                            style={{
                                                height: 180,
                                                borderRadius: 12,
                                            }}
                                            allowsInlineMediaPlayback={true}
                                            mediaPlaybackRequiresUserAction={
                                                false
                                            }
                                            allowsFullscreenVideo={true}
                                            javaScriptEnabled={true}
                                        />
                                        <TouchableOpacity
                                            onPress={() =>
                                                router.push({
                                                    pathname:
                                                        '/user/courseDetails',
                                                    params: { id: course.id },
                                                })
                                            }
                                        >
                                            <Text className="mt-3 px-2 text-base font-semibold">
                                                {course.title}
                                            </Text>
                                            <Text className="px-2 text-sm text-gray-500">
                                                By {course.instructor}
                                            </Text>
                                            <View className="flex-row items-center justify-between px-2">
                                                <Text className="mt-1 text-sm text-yellow-500">
                                                    ⭐ {course.rating}
                                                </Text>
                                                <Text className="mt-1 text-base font-bold text-blue-600">
                                                    ${course.price}
                                                </Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                );
                            })}
                        </ScrollView>
                    )}
                </View>

                {/* Top Courses */}
                <View className="mt-6">
                    <Text className="mb-2 text-lg font-semibold">
                        Top Rated
                    </Text>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                    >
                        {topRatedCourses.map((course, idx) => {
                            const introVideoUrl =
                                course.modules?.[0]?.videos?.[0]?.url || '';

                            return (
                                <View
                                    key={idx}
                                    className="mr-4 w-80 rounded-2xl border border-gray-200 bg-white p-2 shadow-lg"
                                >
                                    <WebView
                                        source={{ uri: introVideoUrl }}
                                        style={{
                                            height: 180,
                                            borderRadius: 12,
                                        }}
                                        allowsInlineMediaPlayback={true}
                                        mediaPlaybackRequiresUserAction={false}
                                        allowsFullscreenVideo={true}
                                        javaScriptEnabled={true}
                                    />
                                    <TouchableOpacity
                                        onPress={() =>
                                            router.push({
                                                pathname: '/user/courseDetails',
                                                params: { id: course.id },
                                            })
                                        }
                                    >
                                        <Text className="mt-3 px-2 text-base font-semibold">
                                            {course.title}
                                        </Text>
                                        <Text className="px-2 text-sm text-gray-500">
                                            By {course.instructor}
                                        </Text>
                                        <View className="flex-row items-center justify-between px-2">
                                            <Text className="mt-1 text-sm text-yellow-500">
                                                ⭐ {course.rating}
                                            </Text>
                                            <Text className="mt-1 text-base font-bold text-blue-600">
                                                ${course.price}
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            );
                        })}
                    </ScrollView>
                </View>

                {/* Top seling Courses */}
                <View className="mb-10 mt-6">
                    <Text className="mb-2 text-lg font-semibold">
                        Top selling
                    </Text>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                    >
                        {topSelingCourse.map((course, idx) => {
                            const introVideoUrl =
                                course.modules?.[0]?.videos?.[0]?.url || '';

                            return (
                                <View
                                    key={idx}
                                    className="mr-4 w-80 rounded-2xl border border-gray-200 bg-white p-2 shadow-lg"
                                >
                                    <WebView
                                        source={{ uri: introVideoUrl }}
                                        style={{
                                            height: 180,
                                            borderRadius: 12,
                                        }}
                                        allowsInlineMediaPlayback={true}
                                        mediaPlaybackRequiresUserAction={false}
                                        allowsFullscreenVideo={true}
                                        javaScriptEnabled={true}
                                    />
                                    <TouchableOpacity
                                        onPress={() =>
                                            router.push({
                                                pathname: '/user/courseDetails',
                                                params: { id: course.id },
                                            })
                                        }
                                    >
                                        <Text className="mt-3 px-2 text-base font-semibold">
                                            {course.title}
                                        </Text>
                                        <Text className="px-2 text-sm text-gray-500">
                                            By {course.instructor}
                                        </Text>
                                        <View className="flex-row items-center justify-between px-2">
                                            <Text className="mt-1 text-sm text-yellow-500">
                                                ⭐ {course.rating}
                                            </Text>
                                            <Text className="mt-1 text-base font-bold text-blue-600">
                                                ${course.price}
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            );
                        })}
                    </ScrollView>
                </View>
            </ScrollView>
            <BottomNavigationBar />
        </SafeAreaView>
    );
}
