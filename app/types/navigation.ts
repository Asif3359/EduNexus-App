// types/navigation.ts

type RootStackParamList = {
    CourseDetailsScreen: { id: string };
    CourseVideosScreen: {
        courseId: string;
        videoUrl: string;
        videoTitle: string;
        moduleName: string;
    };
    PaymentScreen: {
        courseId: string;
        courseTitle: string;
        courseImage: string;
        coursePrice?: number;
        videoTitle?: string;
    };
};

export default RootStackParamList;
