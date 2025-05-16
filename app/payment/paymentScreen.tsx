import {
    View,
    Text,
    TouchableOpacity,
    ActivityIndicator,
    TextInput,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    Image,
} from 'react-native';
import { Stack } from 'expo-router';
import { usePayment } from './hooks/usePayment';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
export default function PaymentScreen() {
    const {
        loading,
        cardDetails,
        cardErrors,
        handleCardNumberChange,
        handleExpiryChange,
        handleCvcChange,
        handleSubmitPayment,
    } = usePayment();

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className="flex-1 bg-gray-50"
        >
            <Stack.Screen
                options={{
                    title: 'Payment',
                    headerTitleStyle: { color: '#4F46E5' },
                    headerTintColor: '#4F46E5',
                }}
            />
            <LinearGradient
                colors={['#F9FAFB', '#E0E7FF']}
                className="flex-1 p-6"
            >
                <View className="mb-8">
                    <Text className="mb-2 text-3xl font-bold text-gray-900">
                        Payment Details
                    </Text>
                    <Text className="text-gray-500">
                        Enter your card information to complete the payment
                    </Text>
                </View>

                {/* Card Preview */}
                <View className="mb-8 rounded-xl bg-indigo-600 p-6 shadow-lg">
                    <View className="mb-8 flex-row items-center justify-between">
                        <Text className="text-lg font-semibold text-white">
                            Credit Card
                        </Text>
                        <Image
                            source={require('../../assets/images/icon.png')}
                            className="h-8 w-10"
                            resizeMode="contain"
                        />
                    </View>
                    <Text className="mb-6 text-xl font-bold tracking-wider text-white">
                        {cardDetails.number || '•••• •••• •••• ••••'}
                    </Text>
                    <View className="flex-row justify-between">
                        <View>
                            <Text className="mb-1 text-xs text-indigo-200">
                                Expiry
                            </Text>
                            <Text className="font-medium text-white">
                                {cardDetails.expiry || '••/••'}
                            </Text>
                        </View>
                        <View>
                            <Text className="mb-1 text-xs text-indigo-200">
                                CVC
                            </Text>
                            <Text className="font-medium text-white">
                                {cardDetails.cvc || '•••'}
                            </Text>
                        </View>
                        <Image
                            source={require('../../assets/images/icon.png')}
                            className="h-8 w-12"
                            resizeMode="contain"
                        />
                    </View>
                </View>

                {/* Form */}
                <View className="rounded-2xl bg-white p-6 shadow-sm">
                    {/* Card Number */}
                    <View className="mb-5">
                        <View className="mb-2 flex-row items-center justify-between">
                            <Text className="font-medium text-gray-700">
                                Card Number
                            </Text>
                            {cardErrors.number && (
                                <Text className="text-xs text-red-500">
                                    {cardErrors.number}
                                </Text>
                            )}
                        </View>
                        <View
                            className={`flex-row items-center rounded-lg border p-3 ${cardErrors.number ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
                        >
                            <MaterialIcons
                                name="credit-card"
                                size={20}
                                color="#6B7280"
                                className="mr-2"
                            />
                            <TextInput
                                className="flex-1 text-gray-800"
                                placeholder="1234 5678 9012 3456"
                                keyboardType="numeric"
                                value={
                                    cardDetails.number || '4242 4242 4242 4242'
                                }
                                onChangeText={handleCardNumberChange}
                                maxLength={19}
                            />
                        </View>
                    </View>

                    {/* Expiry and CVC */}
                    <View className="mb-5 flex-row space-x-4">
                        <View className="flex-1">
                            <View className="mb-2 flex-row items-center justify-between">
                                <Text className="font-medium text-gray-700">
                                    Expiry Date
                                </Text>
                                {cardErrors.expiry && (
                                    <Text className="text-xs text-red-500">
                                        {cardErrors.expiry}
                                    </Text>
                                )}
                            </View>
                            <View
                                className={`flex-row items-center rounded-lg border p-3 ${cardErrors.expiry ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
                            >
                                <MaterialIcons
                                    name="calendar-today"
                                    size={18}
                                    color="#6B7280"
                                    className="mr-2"
                                />
                                <TextInput
                                    className="flex-1 text-gray-800"
                                    placeholder="MM/YY"
                                    keyboardType="numeric"
                                    value={cardDetails.expiry || '12/25'}
                                    onChangeText={handleExpiryChange}
                                    maxLength={5}
                                />
                            </View>
                        </View>
                        <View className="flex-1">
                            <View className="mb-2 flex-row items-center justify-between">
                                <Text className="font-medium text-gray-700">
                                    CVC
                                </Text>
                                {cardErrors.cvc && (
                                    <Text className="text-xs text-red-500">
                                        {cardErrors.cvc}
                                    </Text>
                                )}
                            </View>
                            <View
                                className={`flex-row items-center rounded-lg border p-3 ${cardErrors.cvc ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
                            >
                                <MaterialIcons
                                    name="lock"
                                    size={18}
                                    color="#6B7280"
                                    className="mr-2"
                                />
                                <TextInput
                                    className="flex-1 text-gray-800"
                                    placeholder="123"
                                    keyboardType="numeric"
                                    value={cardDetails.cvc || '123'}
                                    onChangeText={handleCvcChange}
                                    maxLength={3}
                                    secureTextEntry
                                />
                            </View>
                        </View>
                    </View>

                    <TouchableOpacity
                        className="mt-2 items-center justify-center rounded-xl py-4"
                        onPress={handleSubmitPayment}
                        disabled={loading}
                        activeOpacity={0.8}
                    >
                        <LinearGradient
                            colors={['#4F46E5', '#7C3AED']}
                            className="w-full items-center rounded-xl py-4"
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                        >
                            {loading ? (
                                <ActivityIndicator color="white" />
                            ) : (
                                <Text className="text-lg font-bold text-white">
                                    Pay $24.99
                                </Text>
                            )}
                        </LinearGradient>
                    </TouchableOpacity>
                </View>

                <View className="mt-6 flex-row items-center justify-center">
                    <MaterialIcons name="security" size={18} color="#4F46E5" />
                    <Text className="ml-2 text-sm text-indigo-600">
                        Your payment is securely encrypted
                    </Text>
                </View>
            </LinearGradient>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    shadow: {
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
    },
});
