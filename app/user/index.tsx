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
import { SafeAreaView } from 'react-native-safe-area-context';
import BottomNavigationBar from '../components/BottomNavigationBar';
import Constants from 'expo-constants';

function UserHome() {
    const router = useRouter();
    const [suggestedCourses, setSuggestedCourses] = useState([]);
    const [topRatedCourses, setTopRatedCourses] = useState([]);
    const [topSellingCourses, setTopSellingCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userLocation, setUserLocation] = useState('');
    const apiUrl = (Constants.expoConfig as any).extra.BACKEND_API;

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const location = await AsyncStorage.getItem('userLocation');
                console.log('location :', location);
                setUserLocation(location || ''); // Handle null case by providing empty string default
                // Fetch all data in parallel
                const [suggestedRes, topRatedRes, topSellingRes] =
                    await Promise.all([
                        fetch(`${apiUrl}/courses/suggested`),
                        fetch(`${apiUrl}/courses/top-rated`),
                        fetch(`${apiUrl}/courses/top-selling`),
                    ]);

                if (!suggestedRes.ok || !topRatedRes.ok || !topSellingRes.ok) {
                    throw new Error('Failed to fetch data');
                }

                const [suggested, topRated, topSelling] = await Promise.all([
                    suggestedRes.json(),
                    topRatedRes.json(),
                    topSellingRes.json(),
                ]);

                console.log('suggested :', suggested);
                console.log('topRated :', topRated);
                console.log('topSelling :', topSelling);

                setSuggestedCourses(suggested);
                console.log('suggestedCourses :', suggestedCourses);
                setTopRatedCourses(topRated);
                console.log('topRatedCourses :', topRatedCourses);
                setTopSellingCourses(topSelling);
                console.log('topSellingCourses :', topSellingCourses);
            } catch (err: unknown) {
                console.error('Error fetching data:', err);
                setError(
                    err instanceof Error
                        ? err.message
                        : ('An unknown error occurred' as any)
                );
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <SafeAreaView className="flex-1 items-center justify-center bg-white">
                <ActivityIndicator size="large" color="#0000ff" />
            </SafeAreaView>
        );
    }

    if (error) {
        return (
            <SafeAreaView className="flex-1 items-center justify-center bg-white">
                <Text className="text-red-500">Error: {error}</Text>
                <TouchableOpacity
                    className="mt-4 rounded bg-blue-500 px-4 py-2"
                    onPress={() => window.location.reload()}
                >
                    <Text className="text-white">Retry</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    const renderCourseCard = (course: any, idx: number) => {
        const introVideoUrl = course.modules?.[0]?.videos?.[0]?.url || '';

        return (
            <View
                key={idx}
                className="mr-4 w-80 rounded-2xl border border-gray-200 bg-white p-2 shadow-lg"
            >
                {introVideoUrl ? (
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
                ) : (
                    <View className="h-40 items-center justify-center bg-gray-100">
                        <Text className="text-gray-500">
                            No preview available
                        </Text>
                    </View>
                )}
                <TouchableOpacity
                    onPress={() =>
                        router.push({
                            pathname: '/user/[location]/[id]',
                            params: {
                                location: userLocation || '',
                                id: course.id,
                                teacherEmail: course.teacherEmail,
                            },
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
                            ⭐ {course.rating || 'N/A'}
                        </Text>
                        <Text className="mt-1 text-base font-bold text-blue-600">
                            ${course.price}
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <ScrollView className="mb-20 flex-1 px-4 pt-4">
                <Text className="text-lg text-gray-500">Hi, There</Text>
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

                {/* Suggestions */}
                <View className="mt-6">
                    <Text className="mb-2 text-lg font-semibold">
                        Suggestions for You
                    </Text>
                    {suggestedCourses.length === 0 ? (
                        <Text className="text-sm italic text-gray-400">
                            No suggestions available.
                        </Text>
                    ) : (
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                        >
                            {suggestedCourses.map(renderCourseCard)}
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
                        {topRatedCourses.map(renderCourseCard)}
                    </ScrollView>
                </View>

                {/* Top Selling Courses */}
                <View className="mb-10 mt-6">
                    <Text className="mb-2 text-lg font-semibold">
                        Top Selling
                    </Text>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                    >
                        {topSellingCourses.map(renderCourseCard)}
                    </ScrollView>
                </View>
            </ScrollView>
            <BottomNavigationBar />
        </SafeAreaView>
    );
}

export default UserHome;
