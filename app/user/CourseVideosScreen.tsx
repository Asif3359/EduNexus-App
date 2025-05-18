/* eslint-disable prettier/prettier */
import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Dimensions,
    ScrollView,
    SafeAreaView,
    ActivityIndicator,
    Image,
} from 'react-native';
import { WebView } from 'react-native-webview';
import Collapsible from 'react-native-collapsible';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams } from 'expo-router';
import { api } from '../services/api';

interface Video {
    id: number;
    title: string;
    video_url: string;
    position: number;
    created_at: string;
    updated_at: string;
    module_id: number;
}

interface Module {
    id: number;
    title: string;
    position: number;
    course_id: number;
    videos: Video[];
    live_classes: any[];
    created_at: string;
    updated_at: string;
}

interface Course {
    id: number;
    title: string;
    description: string;
    price: string;
    thumbnail: string;
    category: string;
    teacher_id: number;
    modules: Module[];
    created_at: string;
    updated_at: string;
}

export default function CourseVideosScreen() {
    const { courseId, videoId, moduleId, videoTitle, videoUrl, location } =
        useLocalSearchParams<{
            courseId: string;
            videoId?: string;
            moduleId?: string;
            videoTitle?: string;
            videoUrl?: string;
            location: string;
        }>();

    const screenWidth = Dimensions.get('window').width;
    const playerHeight = (screenWidth * 9) / 16;
    const webViewRef = useRef<WebView>(null);

    const [course, setCourse] = useState<Course | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeSections, setActiveSections] = useState<number[]>([]);
    const [activeVideo, setActiveVideo] = useState<Video | null>(null);
    const [activeModule, setActiveModule] = useState<Module | null>(null);
    const [webViewKey, setWebViewKey] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [seenVideos, setSeenVideos] = useState<number[]>([]);

    useEffect(() => {
        const fetchCourseDetails = async () => {
            try {
                setLoading(true);
                if (!courseId) {
                    throw new Error('Course ID is required');
                }

                const data = await api.getCourseDetails(courseId, location);
                setCourse(data);

                // // Always use the first video in the first module
                // let initialVideo: Video | null = null;
                // let initialModule: Module | null = null;

                // if (data.modules.length > 0 && data.modules[0].videos.length > 0) {
                //     initialVideo = data.modules[0].videos[0];
                //     initialModule = data.modules[0];
                // }

                // Find initial video to play
                let initialVideo: Video | null = null;
                let initialModule: Module | null = null;

                // First try to find by videoUrl if provided (since this is what we're passing from [location]/[id].tsx)
                if (videoUrl) {
                    for (const module of data.modules) {
                        const foundVideo = module.videos.find(
                            (v: { video_url: string }) =>
                                v.video_url === videoUrl
                        );
                        if (foundVideo) {
                            initialVideo = foundVideo;
                            initialModule = module;
                            break;
                        }
                    }
                }

                // If not found by videoUrl, try by videoId
                if (!initialVideo && videoId) {
                    for (const module of data.modules) {
                        const foundVideo = module.videos.find(
                            (v: { id: { toString: () => string } }) =>
                                v.id.toString() === videoId
                        );
                        if (foundVideo) {
                            initialVideo = foundVideo;
                            initialModule = module;
                            break;
                        }
                    }
                }

                // If still not found, only use first video as fallback if no specific video was requested
                if (
                    !initialVideo &&
                    !videoId &&
                    !videoUrl &&
                    data.modules.length > 0 &&
                    data.modules[0].videos.length > 0
                ) {
                    initialVideo = data.modules[0].videos[0];
                    initialModule = data.modules[0];
                }

                if (initialVideo && initialModule) {
                    setActiveVideo(initialVideo);
                    setActiveModule(initialModule);

                    // Expand the module containing the active video
                    const moduleIndex = data.modules.findIndex(
                        (m: { id: number }) => m.id === initialModule?.id
                    );
                    if (moduleIndex !== -1) {
                        setActiveSections([moduleIndex]);
                    }
                }
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err.message
                        : 'Failed to load course details'
                );
            } finally {
                setLoading(false);
            }
        };

        fetchCourseDetails();
    }, [courseId, location]);

    useEffect(() => {
        const loadSeenVideos = async () => {
            try {
                const seen = await AsyncStorage.getItem('seenVideos');
                if (seen) {
                    setSeenVideos(JSON.parse(seen));
                }
            } catch (err) {
                console.error('Failed to load seen videos:', err);
            }
        };
        loadSeenVideos();
    }, []);

    const markVideoSeen = async (videoId: number) => {
        try {
            if (!seenVideos.includes(videoId)) {
                const updated = [...seenVideos, videoId];
                setSeenVideos(updated);
                await AsyncStorage.setItem(
                    'seenVideos',
                    JSON.stringify(updated)
                );
            }
        } catch (err) {
            console.error('Failed to mark video as seen:', err);
        }
    };

    const handleVideoSelect = (video: Video, module: Module) => {
        setActiveVideo(video);
        setActiveModule(module);
        setWebViewKey(prev => prev + 1);
        setIsPlaying(false);
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
            function initializeVideo() {
                const video = document.querySelector('video');
                if (video) {
                    const playPromise = video.play();
                    
                    if (playPromise !== undefined) {
                        playPromise.catch(e => {
                            console.log('Auto-play prevented:', e);
                            document.getElementById('playButton').style.display = 'flex';
                        });
                    }
                    
                    function checkProgress() {
                        if (!video.duration || video.duration === Infinity) return;
                        const watched = video.currentTime / video.duration;
                        if (watched >= 0.9) {
                            window.ReactNativeWebView.postMessage(JSON.stringify({
                                type: 'video_progress',
                                videoId: '${activeVideo?.id}',
                                progress: watched
                            }));
                            video.removeEventListener('timeupdate', checkProgress);
                        }
                    }
                    
                    video.addEventListener('timeupdate', checkProgress);
                }
            }
            
            const playButton = document.createElement('div');
            playButton.id = 'playButton';
            playButton.style.position = 'absolute';
            playButton.style.top = '50%';
            playButton.style.left = '50%';
            playButton.style.transform = 'translate(-50%, -50%)';
            playButton.style.width = '60px';
            playButton.style.height = '60px';
            playButton.style.backgroundColor = 'rgba(0,0,0,0.6)';
            playButton.style.borderRadius = '50%';
            playButton.style.display = 'none';
            playButton.style.justifyContent = 'center';
            playButton.style.alignItems = 'center';
            playButton.style.cursor = 'pointer';
            playButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#ffffff"><path d="M8 5v14l11-7z"/></svg>';
            playButton.onclick = function() {
                const video = document.querySelector('video');
                if (video) {
                    video.play();
                    playButton.style.display = 'none';
                }
            };
            document.body.appendChild(playButton);
            
            document.addEventListener('DOMContentLoaded', initializeVideo);
            
            if (document.readyState === 'complete' || document.readyState === 'interactive') {
                initializeVideo();
            }
            
            document.addEventListener('play', function() {
                document.getElementById('playButton').style.display = 'none';
            }, true);
        })();
        true;
    `;

    if (loading) {
        return (
            <SafeAreaView className="flex-1 items-center justify-center bg-white">
                <ActivityIndicator size="large" color="#9333ea" />
                <Text className="mt-4 text-gray-700">
                    Loading course details...
                </Text>
            </SafeAreaView>
        );
    }

    if (error || !course) {
        return (
            <SafeAreaView className="flex-1 items-center justify-center bg-white">
                <Text className="text-lg text-red-500">
                    {error || 'Course not found'}
                </Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                {/* Course Header */}
                <View className="bg-white p-4 shadow-sm">
                    <Image
                        source={{ uri: course.thumbnail }}
                        className="mb-3 h-40 w-full rounded-lg"
                        resizeMode="cover"
                    />
                    <Text className="text-xl font-bold text-gray-900">
                        {course.title}
                    </Text>
                    <Text className="mt-1 font-medium text-purple-600">
                        ${course.price}
                    </Text>
                    <Text className="mt-2 text-gray-600">
                        {course.description}
                    </Text>
                </View>

                {/* Video Player Section */}
                {activeVideo && (
                    <>
                        <View className="mb-4 bg-black">
                            <WebView
                                key={webViewKey}
                                ref={webViewRef}
                                allowsFullscreenVideo
                                javaScriptEnabled
                                allowsInlineMediaPlayback
                                mediaPlaybackRequiresUserAction={false}
                                domStorageEnabled
                                originWhitelist={['*']}
                                source={{ uri: activeVideo.video_url }}
                                style={{ height: playerHeight, width: '100%' }}
                                injectedJavaScript={injectedJS}
                                onMessage={event => {
                                    const message = JSON.parse(
                                        event.nativeEvent.data
                                    );
                                    if (
                                        message.type === 'video_progress' &&
                                        message.progress >= 0.9
                                    ) {
                                        markVideoSeen(
                                            parseInt(message.videoId)
                                        );
                                    }
                                }}
                                onLoadStart={() => setIsPlaying(false)}
                                onLoadEnd={() => setIsPlaying(true)}
                            />
                        </View>

                        {/* Current Video Info */}
                        <View className="mb-6 px-5">
                            <Text className="mb-1 text-xs font-medium text-purple-600">
                                {activeModule?.title}
                            </Text>
                            <Text className="text-lg font-bold text-gray-900">
                                {activeVideo.title}
                            </Text>
                            <View className="mt-2 flex-row items-center">
                                <Feather
                                    name={isPlaying ? 'play' : 'pause'}
                                    size={16}
                                    color="#9333ea"
                                />
                                <Text className="ml-2 text-sm text-gray-500">
                                    {isPlaying ? 'Now Playing' : 'Paused'}
                                </Text>
                            </View>
                        </View>
                    </>
                )}

                {/* Course Modules */}
                <View className="rounded-t-3xl bg-white px-5 pb-10 pt-6 shadow-md">
                    <Text className="mb-6 text-xl font-bold text-gray-900">
                        Course Content
                    </Text>

                    {course.modules.map((module, index) => {
                        const isActive = activeSections.includes(index);
                        const completedVideos = module.videos.filter(v =>
                            seenVideos.includes(v.id)
                        ).length;
                        const progress =
                            module.videos.length > 0
                                ? Math.round(
                                      (completedVideos / module.videos.length) *
                                          100
                                  )
                                : 0;

                        return (
                            <View
                                key={module.id}
                                className={`mb-4 overflow-hidden rounded-xl ${isActive ? 'border border-purple-100 bg-purple-50' : 'border border-gray-100 bg-white'}`}
                            >
                                <TouchableOpacity
                                    onPress={() => toggleSection(index)}
                                    className={`flex-row items-center justify-between px-4 py-3 ${isActive ? 'bg-purple-100' : 'bg-white'}`}
                                >
                                    <View className="flex-row items-center">
                                        <View className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-purple-50">
                                            <Text className="font-bold text-purple-700">
                                                {index + 1}
                                            </Text>
                                        </View>
                                        <View>
                                            <Text className="text-base font-semibold text-gray-800">
                                                {module.title}
                                            </Text>
                                            <Text className="mt-1 text-xs text-gray-500">
                                                {completedVideos} of{' '}
                                                {module.videos.length} videos
                                                completed
                                            </Text>
                                        </View>
                                    </View>
                                    <View className="flex-row items-center">
                                        <View className="mr-3 h-1 w-16 rounded-full bg-gray-200">
                                            <View
                                                className="h-1 rounded-full bg-purple-600"
                                                style={{
                                                    width: `${progress}%`,
                                                }}
                                            />
                                        </View>
                                        <Icon
                                            name={
                                                isActive
                                                    ? 'chevron-up'
                                                    : 'chevron-down'
                                            }
                                            size={14}
                                            color="#6B7280"
                                        />
                                    </View>
                                </TouchableOpacity>

                                <Collapsible collapsed={!isActive}>
                                    <View className="px-2 py-2">
                                        {module.videos.map(video => {
                                            const isSeen = seenVideos.includes(
                                                video.id
                                            );
                                            const isActiveVideo =
                                                activeVideo?.id === video.id;

                                            return (
                                                <TouchableOpacity
                                                    key={video.id}
                                                    onPress={() =>
                                                        handleVideoSelect(
                                                            video,
                                                            module
                                                        )
                                                    }
                                                    className={`my-1 flex-row items-center rounded-lg px-3 py-3 ${isActiveVideo ? 'bg-purple-100' : 'bg-white'}`}
                                                >
                                                    <View className="mr-3 flex h-8 w-8 items-center justify-center rounded-full border border-purple-200 bg-white">
                                                        <Feather
                                                            name={
                                                                isActiveVideo
                                                                    ? 'play'
                                                                    : 'play-circle'
                                                            }
                                                            size={16}
                                                            color={
                                                                isActiveVideo
                                                                    ? '#9333ea'
                                                                    : '#7c3aed'
                                                            }
                                                        />
                                                    </View>
                                                    <View className="flex-1">
                                                        <Text
                                                            className={`text-sm font-medium ${isSeen ? 'text-gray-600' : 'text-gray-800'}`}
                                                        >
                                                            {video.title}
                                                        </Text>
                                                    </View>
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
                                                            color="#d1d5db"
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
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
