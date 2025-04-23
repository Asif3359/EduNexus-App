import React, { useState } from 'react';
import {
    View,
    Text,
    StatusBar,
    Image,
    Dimensions,
    ImageBackground,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Carousel from 'react-native-reanimated-carousel';
import SocialButton from '@/src/components/utils/auth/SocialButton';
import EmailLoginButton from '@/src/components/utils/onboarding/EmailLoginButton';
import { router } from 'expo-router';

const { width, height } = Dimensions.get('window');

export default function Onboarding() {
    const insets = useSafeAreaInsets();
    const [currentSlide, setCurrentSlide] = useState(0);

    // Slide Data
    const slides = [
        {
            title: 'Connect & Learn',
            subtitle:
                'Find expert peer tutors and get personalized academic support anytime, anywhere.',
            image: require('../../assets/images/chatIllustration.png'),
        },
        {
            title: 'Grow Your Knowledge',
            subtitle:
                'Access a wide range of resources to expand your learning experience.',
            image: require('../../assets/images/Illustration_1.png'),
        },
        {
            title: 'Interactive Learning',
            subtitle:
                'Experience engaging lessons with real-time peer interactions.',
            image: require('../../assets/images/Illustration _2.png'),
        },
    ];

    return (
        <>
            <StatusBar
                translucent
                backgroundColor="transparent"
                barStyle="light-content"
            />
            <ImageBackground
                source={require('../../assets/images/Splash.png')}
                className="h-full w-full"
                resizeMode="cover"
            >
                <View
                    className="flex-1 gap-2 bg-black/30"
                    style={{
                        paddingTop: insets.top,
                        paddingBottom: insets.bottom,
                    }}
                >
                    {/* Carousel */}
                    <Carousel
                        loop
                        width={width}
                        height={height * 0.68}
                        data={slides}
                        scrollAnimationDuration={500}
                        onSnapToItem={index => setCurrentSlide(index)}
                        renderItem={({ item }) => (
                            <View className="left-[22px] top-[93px] w-full items-start justify-center gap-8 px-4">
                                <Image
                                    source={item.image}
                                    className="h-[337px] w-[350px] object-contain"
                                />
                                <View>
                                    <Text className="mt-6 text-4xl font-bold text-white">
                                        {item.title}
                                    </Text>
                                    <Text className="mt-3 text-lg text-white">
                                        {item.subtitle}
                                    </Text>
                                </View>
                            </View>
                        )}
                    />

                    {/* Dots for Pagination */}
                    <View className="left-[22px] flex-row px-4">
                        {slides.map((_, index) => (
                            <View
                                key={index}
                                className={`mx-1 h-2 rounded-full ${index === currentSlide ? 'w-2 bg-white' : 'w-2 bg-white/50'}`}
                            />
                        ))}
                    </View>

                    {/* Login Buttons */}
                    <View className="mt-12 items-center gap-2 px-4">
                        <EmailLoginButton
                            onPress={() => router.push('/login')}
                        />

                        {/* Social Login */}
                        <View className="mt-4 flex-row justify-center gap-4">
                            <SocialButton
                                title="Apple"
                                iconName="apple"
                                color="black"
                                onPress={() => console.log('Apple Login')}
                            />
                            <SocialButton
                                title="Google"
                                iconName="google"
                                color="red"
                                onPress={() => console.log('Google Login')}
                            />
                            <SocialButton
                                title="Facebook"
                                iconName="facebook"
                                color="blue"
                                onPress={() => console.log('Facebook Login')}
                            />
                        </View>
                    </View>

                    {/* Terms & Policy */}
                    <Text className="mt-5 text-center text-sm text-white opacity-70">
                        By continuing you agree to our{' '}
                        <Text className="font-bold underline">
                            Terms of Service
                        </Text>{' '}
                        &{' '}
                        <Text className="font-bold underline">
                            Privacy Policy
                        </Text>
                        .
                    </Text>
                </View>
            </ImageBackground>
        </>
    );
}
