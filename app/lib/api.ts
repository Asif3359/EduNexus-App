const API_BASE_URL = 'http://10.0.2.2:8000/api';

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
    id: string
): Promise<CourseDetails> => {
    const response = await fetch(`${API_BASE_URL}/courses/${location}/${id}`);

    if (!response.ok) {
        throw new Error(
            response.status === 404
                ? 'Course not found'
                : 'Failed to fetch course details'
        );
    }

    return response.json();
};
