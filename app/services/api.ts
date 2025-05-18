import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = Constants.expoConfig?.extra?.BACKEND_API;

export const api = {
    async createPaymentIntent(data: { amount: number; currency: string }) {
        const response = await fetch(`${API_URL}/create-payment-intent`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        console.log(response.json);

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to create payment intent');
        }

        return await response.json();
    },

    createEnrollment: async (data: {
        studentId: string;
        courseId: string;
        teacherId: string;
        paidAmount: string;
        location: string;
    }) => {
        const response = await fetch(`${API_URL}/enrollments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${await AsyncStorage.getItem('token')}`,
            },
            body: JSON.stringify({
                student_id: data.studentId,
                course_id: data.courseId,
                teacher_id: data.teacherId,
                paid_amount: data.paidAmount,
                location: data.location,
            }),
        });

        return response.json();
    },

    async checkEnrollment(
        courseId: string,
        studentId: string,
        location: string
    ) {
        try {
            const response = await fetch(
                `${API_URL}/enrollments/check/${courseId}?student_id=${studentId}&location=${location}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                        Authorization: `Bearer ${await AsyncStorage.getItem('token')}`,
                    },
                }
            );

            if (!response.ok) {
                const errorData = await response.text();
                console.error('Enrollment check failed:', {
                    status: response.status,
                    statusText: response.statusText,
                    response: errorData,
                });
                throw new Error(
                    `Failed to check enrollment: ${response.statusText}`
                );
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Failed to check enrollment:', error);
            throw error;
        }
    },

    async getCourseDetails(courseId: string, location: string) {
        try {
            console.log(courseId, location);
            console.log('API Request:', {
                url: `${API_URL}/courses/full-course/${courseId}/${location}`,
                courseId,
                location,
            });

            const response = await fetch(
                `${API_URL}/courses/full-course/${courseId}/${location}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                        Authorization: `Bearer ${await AsyncStorage.getItem('token')}`,
                    },
                }
            );

            if (!response.ok) {
                const errorData = await response.text();
                console.error('Failed to fetch course details:', {
                    status: response.status,
                    statusText: response.statusText,
                    response: errorData,
                    courseId,
                    location,
                });
                throw new Error(
                    `Failed to fetch course details: ${response.statusText}`
                );
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Failed to fetch course details:', error);
            throw error;
        }
    },
};
