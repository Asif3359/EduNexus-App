import { StripeProvider as StripeProviderBase } from '@stripe/stripe-react-native';
import { PropsWithChildren, useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';

const STRIPE_KEY =
    'pk_test_51RPHKH4GEJzvhECafY8l8WHcXJUAbKYXHeXcUTbbSBZ3VlCO2wX50XWyQGzjmuvYt458iSM1gUyuzvV8h2bHP5eF00yQzSAaXu';

export const StripeProvider = ({ children }: PropsWithChildren) => {
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        async function init() {
            try {
                // You can fetch the publishable key from your backend if needed
                await SecureStore.setItemAsync('STRIPE_KEY', STRIPE_KEY);
                setIsReady(true);
            } catch (error) {
                console.error('Stripe initialization failed', error);
            }
        }
        init();
    }, []);

    if (!isReady) return null;

    return (
        <StripeProviderBase
            publishableKey={STRIPE_KEY}
            merchantIdentifier="merchant.com.asifahammednishst.EduNexus"
            urlScheme="edunexus://"
        >
            {children as React.ReactElement}
        </StripeProviderBase>
    );
};
