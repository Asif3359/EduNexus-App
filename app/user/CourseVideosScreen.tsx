// CourseVideosScreen.tsx
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Dimensions,
    ScrollView,
} from 'react-native';
import { WebView } from 'react-native-webview';
import Collapsible from 'react-native-collapsible';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useRoute, RouteProp } from '@react-navigation/native';
import courseDetailsData from '@/assets/data/courseDetails.json';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

type CourseVideosScreenParams = {
    courseId: string;
    videoUrl: string;
    videoTitle: string;
    moduleName: string;
};

type CourseVideosScreenRouteProp = RouteProp<
    Record<'CourseVideosScreen', CourseVideosScreenParams>,
    'CourseVideosScreen'
>;

export default function CourseVideosScreen() {
    const route = useRoute<CourseVideosScreenRouteProp>();
    const { courseId, videoUrl, videoTitle, moduleName } = route.params;

    const screenWidth = Dimensions.get('window').width;
    const playerHeight = (screenWidth * 10) / 16;

    const [activeSections, setActiveSections] = useState<number[]>([]);
    const [activeVideoUrl, setActiveVideoUrl] = useState(videoUrl);
    const [activeModuleName, setActiveModuleName] = useState(moduleName);
    const [activeVideoTitle, setActiveVideoTitle] = useState(videoTitle);
    const [seenVideos, setSeenVideos] = useState<string[]>([]);

    const course = courseDetailsData.find(c => c.id === courseId);

    useEffect(() => {
        const loadSeenVideos = async () => {
            const seen = await AsyncStorage.getItem('seenVideos');
            if (seen) {
                setSeenVideos(JSON.parse(seen));
            }
        };
        loadSeenVideos();
    }, []);

    useEffect(() => {
        const indexToExpand = course?.modules.findIndex(
            mod => mod.title === moduleName
        );
        if (indexToExpand !== undefined && indexToExpand >= 0) {
            setActiveSections([indexToExpand]);
        }
    }, [course, moduleName]);

    const markVideoSeen = async (url: string) => {
        if (!seenVideos.includes(url)) {
            const updated = [...seenVideos, url];
            setSeenVideos(updated);
            await AsyncStorage.setItem('seenVideos', JSON.stringify(updated));
        }
    };

    const saveVideoToHistory = async (
        id: string,
        title: string,
        url: string,
        module: string
    ) => {
        const newHistoryItem = {
            id,
            title,
            url,
            module,
            date: new Date().toISOString(),
        };
        const existing = await AsyncStorage.getItem('videoHistory');
        const history = existing ? JSON.parse(existing) : [];
        history.unshift(newHistoryItem); // add to the top
        await AsyncStorage.setItem(
            'videoHistory',
            JSON.stringify(history.slice(0, 50))
        ); // limit to 50
    };

    const toggleSection = (index: number) => {
        setActiveSections(prevSections =>
            prevSections.includes(index)
                ? prevSections.filter(i => i !== index)
                : [...prevSections, index]
        );
    };

    const injectedJS = `
        (function() {
            const video = document.querySelector('video');
            if (!video) return;

            function checkProgress() {
                if (!video.duration || video.duration === Infinity) return;
                const watched = video.currentTime / video.duration;
                if (watched >= 0.9) {
                    window.ReactNativeWebView.postMessage('80_percent_watched');
                    video.removeEventListener('timeupdate', checkProgress);
                }
            }

            video.addEventListener('timeupdate', checkProgress);
        })();
        true;
    `;

    if (!course) {
        return (
            <View className="flex-1 items-center justify-center bg-white">
                <Text className="text-lg text-gray-700">Course not found.</Text>
            </View>
        );
    }

    return (
        <ScrollView
            className="flex-1 bg-white"
            showsVerticalScrollIndicator={false}
        >
            <View>
                <WebView
                    allowsFullscreenVideo
                    javaScriptEnabled
                    allowsInlineMediaPlayback
                    mediaPlaybackRequiresUserAction={false}
                    domStorageEnabled
                    originWhitelist={['*']}
                    source={{ uri: activeVideoUrl }}
                    style={{
                        height: playerHeight,
                        width: '100%',
                        borderRadius: 12,
                        marginBottom: 16,
                    }}
                    injectedJavaScript={injectedJS}
                    onMessage={event => {
                        if (event.nativeEvent.data === '80_percent_watched') {
                            markVideoSeen(activeVideoUrl);
                        }
                    }}
                />
            </View>

            <View className="mb-6 px-4">
                <Text className="mb-1 text-xl font-bold text-purple-800">
                    {activeModuleName}
                </Text>
                <Text className="mb-2 text-base text-gray-600">
                    {activeVideoTitle}
                </Text>
            </View>

            <View className="px-4 pb-10">
                <Text className="mb-4 text-2xl font-bold text-purple-800">
                    Course Modules
                </Text>
                <ScrollView
                    style={{ maxHeight: 400 }}
                    nestedScrollEnabled={true}
                    showsVerticalScrollIndicator={false}
                >
                    {course.modules.map((item, index) => {
                        const isActive = activeSections.includes(index);
                        return (
                            <View
                                key={index}
                                className={`mb-4 rounded-2xl shadow ${isActive ? 'border border-purple-200 bg-purple-50' : 'border border-gray-200 bg-white'}`}
                            >
                                <TouchableOpacity
                                    onPress={() => toggleSection(index)}
                                    className={`flex-row items-center justify-between rounded-t-2xl bg-purple-200 px-5 py-4`}
                                >
                                    <Text className="text-lg font-bold text-gray-800">
                                        {item.title}
                                    </Text>
                                    <Icon
                                        name={
                                            isActive
                                                ? 'chevron-up'
                                                : 'chevron-down'
                                        }
                                        size={20}
                                        color={isActive ? '#7c3aed' : '#6B7280'}
                                    />
                                </TouchableOpacity>

                                <Collapsible collapsed={!isActive}>
                                    <View className="space-y-3 rounded-b-2xl bg-purple-50 px-5 py-4">
                                        {item.videos.map((video, vidIdx) => {
                                            const isSeen = seenVideos.includes(
                                                video.url
                                            );
                                            return (
                                                <TouchableOpacity
                                                    key={`${index}-${vidIdx}`}
                                                    onPress={() => {
                                                        setActiveVideoUrl(
                                                            video.url
                                                        );
                                                        setActiveVideoTitle(
                                                            video.title
                                                        );
                                                        setActiveModuleName(
                                                            item.title
                                                        );
                                                        saveVideoToHistory(
                                                            course.id,
                                                            video.title,
                                                            video.url,
                                                            item.title
                                                        );
                                                    }}
                                                    className="my-1 flex-row items-center space-x-3 rounded-xl border border-purple-200 bg-white p-3 shadow-sm"
                                                >
                                                    <Feather
                                                        name="play-circle"
                                                        size={20}
                                                        color="#7c3aed"
                                                    />
                                                    <Text
                                                        className={`flex-1 px-2 font-medium ${isSeen ? 'text-gray-400' : 'text-purple-700'}`}
                                                    >
                                                        {video.title}
                                                    </Text>
                                                    {isSeen ? (
                                                        <Feather
                                                            name="check-circle"
                                                            size={16}
                                                            color="#10b981"
                                                        />
                                                    ) : (
                                                        <Feather
                                                            name="circle"
                                                            size={16}
                                                            color="#10b981"
                                                        />
                                                    )}
                                                </TouchableOpacity>
                                            );
                                        })}
                                    </View>
                                </Collapsible>
                            </View>
                        );
                    })}
                </ScrollView>
            </View>
        </ScrollView>
    );
}
