import {
    router,
    useLocalSearchParams,
    useNavigation,
    useRouter,
} from 'expo-router';
import {
    View,
    Text,
    ActivityIndicator,
    Image,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Alert,
} from 'react-native';
import { useEffect, useState } from 'react';
import Constants from 'expo-constants';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { convertImageUrl } from '../components/convertImageUrl';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Course {
    id: number;
    title: string;
    description: string;
    price: number;
    thumbnail: string | null;
    created_at: string;
    teacher: {
        name: string;
        email: string;
        id: number;
    };
    teacher_id: number;
}

interface Module {
    ModuleID: number;
    CourseID: number;
    Title: string;
    Position: number;
}

export default function TeacherCourseDetail() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    const [course, setCourse] = useState<Course | null>(null);
    const [loading, setLoading] = useState(true);
    const [modules, setModules] = useState<Module[]>([]);
    const [newModuleTitle, setNewModuleTitle] = useState('');
    const [showAddModule, setShowAddModule] = useState(false);
    const [editingModule, setEditingModule] = useState<Module | null>(null);
    const [editModuleTitle, setEditModuleTitle] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const apiUrl = (Constants.expoConfig as any).extra.BACKEND_API;
    const baseURI = (Constants.expoConfig as any).extra.API_BASE_URL;
    const router = useRouter();

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const userLocation = await AsyncStorage.getItem('userLocation');
                const response = await fetch(
                    `${apiUrl}/course/${id}?location=${userLocation}`
                );
                const data = await response.json();

                if (data.success) {
                    setCourse(data.course);
                    fetchModules(data.course.id);
                    navigation.setOptions({
                        title: 'Manage Course',
                        headerRight: () => (
                            <TouchableOpacity
                                className="mr-4"
                                onPress={() => {
                                    setShowAddModule(true);
                                    setEditingModule(null);
                                }}
                            >
                                <Ionicons
                                    name="add"
                                    size={24}
                                    color="#6366f1"
                                />
                            </TouchableOpacity>
                        ),
                    });
                }
            } catch (error) {
                console.error('Error fetching course:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCourse();
    }, [id]);

    const fetchModules = async (courseId: number) => {
        try {
            const userLocation = await AsyncStorage.getItem('userLocation');

            const response = await fetch(
                `${apiUrl}/courses/${courseId}/modules?location=${userLocation}`
            );
            const data = await response.json();
            if (data.success) {
                setModules(data.modules);
            }
        } catch (error) {
            console.error('Error fetching modules:', error);
            Alert.alert('Error', 'Failed to load modules');
        }
    };

    const handleAddModule = async () => {
        if (!newModuleTitle.trim()) {
            Alert.alert('Error', 'Please enter a module title');
            return;
        }

        setIsSubmitting(true);
        try {
            const userLocation = await AsyncStorage.getItem('userLocation');

            const response = await fetch(`${apiUrl}/modules`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    location: userLocation,
                    course_id: id,
                    title: newModuleTitle,
                    position: modules.length + 1,
                }),
            });

            const data = await response.json();
            if (response.ok && data.module) {
                setNewModuleTitle('');
                setShowAddModule(false);
                await fetchModules(Number(id));
                Alert.alert('Success', 'Module added successfully');
            } else {
                throw new Error(data.message || 'Failed to add module');
            }
        } catch (error) {
            console.error('Error adding module:', error);
            Alert.alert('Error', 'Failed to add module. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUpdateModule = async () => {
        // if (!editingModule || !editModuleTitle.trim()) {
        //     Alert.alert('Error', 'Please enter a module title');
        //     return;
        // }

        // setIsSubmitting(true);
        // try {
        //     const response = await fetch(`${apiUrl}/modules/${editingModule.ModuleID}`, {
        //         method: 'PUT',
        //         headers: {
        //             'Content-Type': 'application/json',
        //         },
        //         body: JSON.stringify({
        //             title: editModuleTitle,
        //         }),
        //     });

        //     const data = await response.json();
        //     if (data.success) {
        //         setEditingModule(null);
        //         await fetchModules(Number(id));
        //         Alert.alert('Success', 'Module updated successfully');
        //     } else {
        //         throw new Error(data.message || 'Failed to update module');
        //     }
        // } catch (error) {
        //     console.error('Error updating module:', error);
        //     Alert.alert('Error', 'Failed to update module. Please try again.');
        // } finally {
        //     setIsSubmitting(false);
        // }

        Alert.alert('Warning', 'No functionality yet');
    };

    const handleDeleteModule = async (moduleId: number) => {
        Alert.alert(
            'Confirm Delete',
            'Are you sure you want to delete this module and all its lessons?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        // try {
                        //     const response = await fetch(`${apiUrl}/modules/${moduleId}`, {
                        //         method: 'DELETE',
                        //     });
                        //     const data = await response.json();
                        //     if (data.success) {
                        //         await fetchModules(Number(id));
                        //         Alert.alert('Success', 'Module deleted successfully');
                        //     } else {
                        //         throw new Error(data.message || 'Failed to delete module');
                        //     }
                        // } catch (error) {
                        //     console.error('Error deleting module:', error);
                        //     Alert.alert('Error', 'Failed to delete module. Please try again.');
                        // }
                        Alert.alert('Warning', 'No functionality yet');
                    },
                },
            ]
        );
    };
    const navigateToLessons = async (moduleId: number) => {
        const userLocation = await AsyncStorage.getItem('userLocation');

        router.push({
            pathname: '/manageLessons/[moduleId]',
            params: {
                courseId: id,
                moduleId: moduleId.toString(),
                location: userLocation,
            },
        });
    };

    if (loading) {
        return (
            <View className="flex-1 items-center justify-center bg-gray-50">
                <ActivityIndicator size="large" color="#6366f1" />
                <Text className="mt-4 font-medium text-indigo-600">
                    Loading course details...
                </Text>
            </View>
        );
    }

    if (!course) {
        return (
            <View className="flex-1 items-center justify-center bg-gray-50">
                <Ionicons name="sad-outline" size={48} color="#6366f1" />
                <Text className="mt-4 text-lg font-medium text-gray-700">
                    Course not found
                </Text>
                <TouchableOpacity
                    className="mt-6 rounded-full bg-indigo-600 px-6 py-3"
                    onPress={() => navigation.goBack()}
                >
                    <Text className="font-medium text-white">Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <ScrollView
            className="flex-1 bg-gray-50"
            contentContainerStyle={{ paddingBottom: 30 }}
        >
            {/* Course Header */}
            <View className="relative">
                <Image
                    source={{
                        uri: course.thumbnail || '',
                    }}
                    className="h-48 w-full"
                    resizeMode="cover"
                />
                <View className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50" />
                <View className="absolute bottom-4 left-4 right-4">
                    <Text className="text-2xl font-bold text-white">
                        {course.title}
                    </Text>
                </View>
            </View>

            {/* Course Management Sections */}
            <View className="px-4 pt-4">
                {/* Basic Info Card */}
                <View className="mb-4 rounded-lg border border-gray-100 bg-white p-4 shadow-sm shadow-indigo-100">
                    <Text className="mb-2 text-lg font-bold text-gray-800">
                        Course Information
                    </Text>
                    <Text className="mb-4 text-gray-700">
                        {course.description}
                    </Text>
                    <View className="flex-row justify-between">
                        <Text className="font-bold text-indigo-600">
                            ${course.price}
                        </Text>
                        <Text className="text-gray-500">
                            {new Date(course.created_at).toLocaleDateString()}
                        </Text>
                    </View>
                </View>

                {/* Module Management */}
                <View className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm shadow-indigo-100">
                    <View className="mb-3 flex-row items-center justify-between">
                        <Text className="text-lg font-bold text-gray-800">
                            Course Modules ({modules.length})
                        </Text>
                        <TouchableOpacity
                            onPress={() => {
                                setShowAddModule(!showAddModule);
                                setEditingModule(null);
                            }}
                            className="p-2"
                        >
                            <Ionicons
                                name={showAddModule ? 'close' : 'add'}
                                size={24}
                                color="#6366f1"
                            />
                        </TouchableOpacity>
                    </View>

                    {/* Add/Edit Module Form */}
                    {(showAddModule || editingModule) && (
                        <View className="mb-4">
                            <TextInput
                                value={
                                    editingModule
                                        ? editModuleTitle
                                        : newModuleTitle
                                }
                                onChangeText={
                                    editingModule
                                        ? setEditModuleTitle
                                        : setNewModuleTitle
                                }
                                placeholder="Enter module title"
                                className="mb-2 rounded-lg border border-gray-300 p-3"
                                autoFocus
                            />
                            <View className="flex-row justify-end space-x-2">
                                <TouchableOpacity
                                    onPress={() => {
                                        setShowAddModule(false);
                                        setEditingModule(null);
                                    }}
                                    className="rounded-lg border border-gray-300 px-4 py-2"
                                >
                                    <Text className="text-gray-700">
                                        Cancel
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={
                                        editingModule
                                            ? handleUpdateModule
                                            : handleAddModule
                                    }
                                    className="items-center justify-center rounded-lg bg-indigo-600 px-4 py-2"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <ActivityIndicator
                                            size="small"
                                            color="white"
                                        />
                                    ) : (
                                        <Text className="font-medium text-white">
                                            {editingModule
                                                ? 'Update Module'
                                                : 'Add Module'}
                                        </Text>
                                    )}
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}

                    {/* Modules List */}
                    {modules.length > 0 ? (
                        <View className="space-y-3">
                            {modules
                                .sort((a, b) => a.Position - b.Position)
                                .map(module => (
                                    <View
                                        key={module.ModuleID}
                                        className="mb-2 overflow-hidden rounded-lg border border-gray-200"
                                    >
                                        <View className="flex-row items-center justify-between bg-gray-50 p-3">
                                            <View className="flex-1 flex-row items-center">
                                                <View className="mr-3 h-8 w-8 items-center justify-center rounded-full bg-indigo-100">
                                                    <Text className="font-medium text-indigo-600">
                                                        {module.Position}
                                                    </Text>
                                                </View>
                                                <Text className="flex-1 font-medium text-gray-800">
                                                    {module.Title}
                                                </Text>
                                            </View>
                                            <View className="flex-row space-x-3">
                                                <TouchableOpacity
                                                    onPress={() =>
                                                        navigateToLessons(
                                                            module.ModuleID
                                                        )
                                                    }
                                                    className="p-2"
                                                >
                                                    <MaterialIcons
                                                        name="menu-book"
                                                        size={20}
                                                        color="#6366f1"
                                                    />
                                                </TouchableOpacity>
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        setEditingModule(
                                                            module
                                                        );
                                                        setEditModuleTitle(
                                                            module.Title
                                                        );
                                                        setShowAddModule(false);
                                                    }}
                                                    className="p-2"
                                                >
                                                    <Ionicons
                                                        name="create-outline"
                                                        size={20}
                                                        color="#6366f1"
                                                    />
                                                </TouchableOpacity>
                                                <TouchableOpacity
                                                    onPress={() =>
                                                        handleDeleteModule(
                                                            module.ModuleID
                                                        )
                                                    }
                                                    className="p-2"
                                                >
                                                    <Ionicons
                                                        name="trash-outline"
                                                        size={20}
                                                        color="#ef4444"
                                                    />
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </View>
                                ))}
                        </View>
                    ) : (
                        <View className="items-center py-6">
                            <Ionicons
                                name="book-outline"
                                size={32}
                                color="#d1d5db"
                            />
                            <Text className="mt-2 text-gray-500">
                                No modules added yet
                            </Text>
                            {!showAddModule && (
                                <TouchableOpacity
                                    className="mt-4 rounded-lg bg-indigo-600 px-4 py-2"
                                    onPress={() => setShowAddModule(true)}
                                >
                                    <Text className="text-white">
                                        Add Your First Module
                                    </Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    )}
                </View>
            </View>
        </ScrollView>
    );
}
