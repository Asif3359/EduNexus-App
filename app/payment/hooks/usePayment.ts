import { useState } from 'react';
import { useStripe } from '@stripe/stripe-react-native';
import { Alert } from 'react-native';
import { api } from '../../services/api';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
export const usePayment = () => {
    const { initPaymentSheet, presentPaymentSheet } = useStripe();
    const [loading, setLoading] = useState(false);
    const [cardDetails, setCardDetails] = useState({
        number: '',
        expiry: '',
        cvc: '',
    });
    const [cardErrors, setCardErrors] = useState({
        number: '',
        expiry: '',
        cvc: '',
    });

    const validateCard = () => {
        const errors = { number: '', expiry: '', cvc: '' };
        let isValid = true;

        if (
            !cardDetails.number ||
            cardDetails.number.replace(/\s/g, '').length < 15
        ) {
            errors.number = 'Valid card number required';
            isValid = false;
        }

        if (!cardDetails.expiry || !cardDetails.expiry.includes('/')) {
            errors.expiry = 'MM/YY required';
            isValid = false;
        }

        if (!cardDetails.cvc || cardDetails.cvc.length < 3) {
            errors.cvc = 'CVC required';
            isValid = false;
        }

        setCardErrors(errors);
        return isValid;
    };

    const handleCardNumberChange = (value: string) => {
        // Format with spaces every 4 digits
        const formatted = value
            .replace(/\D/g, '')
            .replace(/(\d{4})(?=\d)/g, '$1 ');
        setCardDetails(prev => ({ ...prev, number: formatted }));
    };

    const handleExpiryChange = (value: string) => {
        // Format as MM/YY
        const formatted = value
            .replace(/\D/g, '')
            .replace(/^(\d{2})/, '$1/')
            .substring(0, 5);
        setCardDetails(prev => ({ ...prev, expiry: formatted }));
    };

    const handleCvcChange = (value: string) => {
        setCardDetails(prev => ({ ...prev, cvc: value }));
    };

    const handleSubmitPayment = async () => {
        if (!validateCard()) return;

        setLoading(true);
        try {
            // 1. Create payment intent
            const { clientSecret } = await api.createPaymentIntent({
                amount: 1000, // $10.00 in cents
                currency: 'usd',
            });

            // 2. Initialize payment sheet
            const { error } = await initPaymentSheet({
                merchantDisplayName: 'Your App Name',
                paymentIntentClientSecret: clientSecret,
                defaultBillingDetails: {
                    email: 'customer@example.com', // Replace with user's email
                },
            });

            if (error) throw error;

            // 3. Present payment sheet
            const { error: paymentError } = await presentPaymentSheet();

            if (paymentError) throw paymentError;

            await AsyncStorage.setItem('clientSecret', clientSecret);

            // Alert.alert('Success', 'Payment completed successfully!');
            // router.push('/user/applyForTeacher');

            Alert.alert('Success', 'Payment successfull!', [
                {
                    text: 'OK',
                    onPress: () => router.replace('/user/applyForTeacher'),
                },
            ]);
        } catch (error: unknown) {
            Alert.alert('Error', (error as Error)?.message || 'Payment failed');
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        cardDetails,
        cardErrors,
        handleCardNumberChange,
        handleExpiryChange,
        handleCvcChange,
        handleSubmitPayment,
    };
};
