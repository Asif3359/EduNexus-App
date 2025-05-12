import React, { useState } from 'react';
import {
    SafeAreaView,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Alert,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

function CreateCourse() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [modules, setModules] = useState([
        { title: '', videos: [{ title: '', url: '' }] },
    ]);
    const [liveClasses, setLiveClasses] = useState([
        { title: '', schedule: '', duration: '', link: '' },
    ]);

    const addModule = () => {
        setModules([
            ...modules,
            { title: '', videos: [{ title: '', url: '' }] },
        ]);
    };

    const removeModule = (index: number) => {
        if (modules.length > 1) {
            const updatedModules = [...modules];
            updatedModules.splice(index, 1);
            setModules(updatedModules);
        }
    };

    const addVideoToModule = (moduleIndex: number) => {
        const updatedModules = [...modules];
        updatedModules[moduleIndex].videos.push({ title: '', url: '' });
        setModules(updatedModules);
    };

    const removeVideoFromModule = (moduleIndex: number, videoIndex: number) => {
        const updatedModules = [...modules];
        if (updatedModules[moduleIndex].videos.length > 1) {
            updatedModules[moduleIndex].videos.splice(videoIndex, 1);
            setModules(updatedModules);
        }
    };

    const addLiveClass = () => {
        setLiveClasses([
            ...liveClasses,
            { title: '', schedule: '', duration: '', link: '' },
        ]);
    };

    const removeLiveClass = (index: number) => {
        if (liveClasses.length > 1) {
            const updatedLiveClasses = [...liveClasses];
            updatedLiveClasses.splice(index, 1);
            setLiveClasses(updatedLiveClasses);
        }
    };

    const handleSubmit = () => {
        // Validate form data
        if (!title.trim() || !description.trim() || !price.trim()) {
            Alert.alert('Error', 'Please fill in all required fields');
            return;
        }

        // Prepare course data
        const courseData = {
            title,
            description,
            price: parseFloat(price),
            modules: modules.map(module => ({
                title: module.title,
                videos: module.videos.filter(
                    video => video.title.trim() && video.url.trim()
                ),
            })),
            liveClasses: liveClasses.filter(
                lc => lc.title.trim() && lc.schedule.trim() && lc.link.trim()
            ),
        };

        // Here you would typically send the data to your backend
        console.log('Course data:', courseData);
        Alert.alert('Success', 'Course created successfully!');
        // Reset form or navigate away
    };

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <ScrollView className="p-4">
                <Text className="mb-6 mt-4 text-center text-3xl font-bold text-indigo-700">
                    Create New Course
                </Text>

                {/* Basic Course Information */}
                <View className="mb-6 rounded-lg bg-white p-4 shadow">
                    <Text className="mb-2 text-lg font-semibold text-gray-800">
                        Course Details
                    </Text>

                    <View className="mb-4">
                        <Text className="mb-1 text-sm font-medium text-gray-700">
                            Title*
                        </Text>
                        <TextInput
                            className="rounded border border-gray-300 p-2"
                            placeholder="Course Title"
                            value={title}
                            onChangeText={setTitle}
                        />
                    </View>

                    <View className="mb-4">
                        <Text className="mb-1 text-sm font-medium text-gray-700">
                            Description*
                        </Text>
                        <TextInput
                            className="textAlignVertical='top' h-24 rounded border border-gray-300 p-2"
                            placeholder="Course Description"
                            multiline
                            value={description}
                            onChangeText={setDescription}
                        />
                    </View>

                    <View className="mb-4">
                        <Text className="mb-1 text-sm font-medium text-gray-700">
                            Price (USD)*
                        </Text>
                        <TextInput
                            className="rounded border border-gray-300 p-2"
                            placeholder="0.00"
                            keyboardType="numeric"
                            value={price}
                            onChangeText={setPrice}
                        />
                    </View>
                </View>

                {/* Modules Section */}
                <View className="mb-6 rounded-lg bg-white p-4 shadow">
                    <View className="mb-3 flex-row items-center justify-between">
                        <Text className="text-lg font-semibold text-gray-800">
                            Course Modules
                        </Text>
                        <TouchableOpacity
                            className="rounded bg-indigo-100 px-3 py-1"
                            onPress={addModule}
                        >
                            <Text className="text-indigo-700">
                                + Add Module
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {modules.map((module, moduleIndex) => (
                        <View
                            key={moduleIndex}
                            className="mb-4 border-b border-gray-200 pb-4"
                        >
                            <View className="mb-2 flex-row items-center justify-between">
                                <Text className="text-sm font-medium text-gray-700">
                                    Module {moduleIndex + 1}
                                </Text>
                                {modules.length > 1 && (
                                    <TouchableOpacity
                                        className="rounded bg-red-100 px-2 py-1"
                                        onPress={() =>
                                            removeModule(moduleIndex)
                                        }
                                    >
                                        <Text className="text-xs text-red-600">
                                            Remove
                                        </Text>
                                    </TouchableOpacity>
                                )}
                            </View>

                            <View className="mb-3">
                                <TextInput
                                    className="mb-2 rounded border border-gray-300 p-2"
                                    placeholder={`Module ${moduleIndex + 1} Title`}
                                    value={module.title}
                                    onChangeText={text => {
                                        const updatedModules = [...modules];
                                        updatedModules[moduleIndex].title =
                                            text;
                                        setModules(updatedModules);
                                    }}
                                />
                            </View>

                            <Text className="mb-2 text-sm font-medium text-gray-700">
                                Videos
                            </Text>

                            {module.videos.map((video, videoIndex) => (
                                <View
                                    key={videoIndex}
                                    className="mb-3 ml-2 border-l-2 border-indigo-200 pl-2"
                                >
                                    <View className="mb-1 flex-row items-center justify-between">
                                        <Text className="text-xs text-gray-600">
                                            Video {videoIndex + 1}
                                        </Text>
                                        {module.videos.length > 1 && (
                                            <TouchableOpacity
                                                className="rounded bg-red-100 px-1 py-0.5"
                                                onPress={() =>
                                                    removeVideoFromModule(
                                                        moduleIndex,
                                                        videoIndex
                                                    )
                                                }
                                            >
                                                <Text className="text-xs text-red-600">
                                                    Remove
                                                </Text>
                                            </TouchableOpacity>
                                        )}
                                    </View>

                                    <TextInput
                                        className="mb-2 rounded border border-gray-300 p-2"
                                        placeholder="Video Title"
                                        value={video.title}
                                        onChangeText={text => {
                                            const updatedModules = [...modules];
                                            updatedModules[moduleIndex].videos[
                                                videoIndex
                                            ].title = text;
                                            setModules(updatedModules);
                                        }}
                                    />

                                    <TextInput
                                        className="rounded border border-gray-300 p-2"
                                        placeholder="Video URL"
                                        value={video.url}
                                        onChangeText={text => {
                                            const updatedModules = [...modules];
                                            updatedModules[moduleIndex].videos[
                                                videoIndex
                                            ].url = text;
                                            setModules(updatedModules);
                                        }}
                                    />
                                </View>
                            ))}

                            <TouchableOpacity
                                className="mt-2 self-start rounded bg-indigo-100 px-3 py-1"
                                onPress={() => addVideoToModule(moduleIndex)}
                            >
                                <Text className="text-sm text-indigo-700">
                                    + Add Video
                                </Text>
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>

                {/* Live Classes Section */}
                <View className="mb-6 rounded-lg bg-white p-4 shadow">
                    <View className="mb-3 flex-row items-center justify-between">
                        <Text className="text-lg font-semibold text-gray-800">
                            Live Classes
                        </Text>
                        <TouchableOpacity
                            className="rounded bg-indigo-100 px-3 py-1"
                            onPress={addLiveClass}
                        >
                            <Text className="text-indigo-700">+ Add Class</Text>
                        </TouchableOpacity>
                    </View>

                    {liveClasses.map((liveClass, index) => (
                        <View
                            key={index}
                            className="mb-4 border-b border-gray-200 pb-4"
                        >
                            <View className="mb-2 flex-row items-center justify-between">
                                <Text className="text-sm font-medium text-gray-700">
                                    Live Class {index + 1}
                                </Text>
                                {liveClasses.length > 1 && (
                                    <TouchableOpacity
                                        className="rounded bg-red-100 px-2 py-1"
                                        onPress={() => removeLiveClass(index)}
                                    >
                                        <Text className="text-xs text-red-600">
                                            Remove
                                        </Text>
                                    </TouchableOpacity>
                                )}
                            </View>

                            <TextInput
                                className="mb-2 rounded border border-gray-300 p-2"
                                placeholder="Class Title"
                                value={liveClass.title}
                                onChangeText={text => {
                                    const updatedLiveClasses = [...liveClasses];
                                    updatedLiveClasses[index].title = text;
                                    setLiveClasses(updatedLiveClasses);
                                }}
                            />

                            <TextInput
                                className="mb-2 rounded border border-gray-300 p-2"
                                placeholder="Schedule (YYYY-MM-DD HH:MM)"
                                value={liveClass.schedule}
                                onChangeText={text => {
                                    const updatedLiveClasses = [...liveClasses];
                                    updatedLiveClasses[index].schedule = text;
                                    setLiveClasses(updatedLiveClasses);
                                }}
                            />

                            <TextInput
                                className="mb-2 rounded border border-gray-300 p-2"
                                placeholder="Duration (minutes)"
                                keyboardType="numeric"
                                value={liveClass.duration}
                                onChangeText={text => {
                                    const updatedLiveClasses = [...liveClasses];
                                    updatedLiveClasses[index].duration = text;
                                    setLiveClasses(updatedLiveClasses);
                                }}
                            />

                            <TextInput
                                className="rounded border border-gray-300 p-2"
                                placeholder="Meeting Link"
                                value={liveClass.link}
                                onChangeText={text => {
                                    const updatedLiveClasses = [...liveClasses];
                                    updatedLiveClasses[index].link = text;
                                    setLiveClasses(updatedLiveClasses);
                                }}
                            />
                        </View>
                    ))}
                </View>

                {/* Submit Button */}
                <TouchableOpacity
                    className="mb-8 rounded-lg bg-indigo-600 p-3"
                    onPress={handleSubmit}
                >
                    <Text className="text-center font-semibold text-white">
                        Create Course
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

export default CreateCourse;
