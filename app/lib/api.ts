import Constants from 'expo-constants';

const apiUrl = (Constants.expoConfig as any).extra.BACKEND_API;
interface CourseDetails {
    id: string;
    title: string;
    description: string;
    price: number;
    instructor: string;
    thumbnail: string;
    location: string;
    duration: string;
    rating: number;
    enrollments: number;
    email: string;
    modules: {
        title: string;
        videos: {
            title: string;
            url: string;
            duration: number;
        }[];
    }[];
}

export const fetchCourseDetails = async (
    location: string,
    id: string,
    teacherEmail: string
): Promise<CourseDetails> => {
    const response = await fetch(
        `${apiUrl}/courses/${location}/${id}/${teacherEmail}`
    );

    if (!response.ok) {
        throw new Error(
            response.status === 404
                ? 'Course not found'
                : 'Failed to fetch course details'
        );
    }

    return response.json();
};
