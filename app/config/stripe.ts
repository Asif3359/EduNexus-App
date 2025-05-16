import Constants from 'expo-constants';

export const STRIPE_CONFIG = {
    publishableKey: Constants.expoConfig?.extra?.stripePublishableKey || '',
    merchantIdentifier: 'merchant.com.asifahammednishst.EduNexus',
    // Add any other Stripe configuration options here
};
