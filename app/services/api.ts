import Constants from 'expo-constants';

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
};
