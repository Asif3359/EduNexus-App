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
    ScrollView,
    Dimensions,
    Keyboard,
} from 'react-native';
import { Stack } from 'expo-router';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { usePayment } from './hooks/usePayment';

const { width } = Dimensions.get('window');

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
            style={styles.container}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
        >
            <Stack.Screen
                options={{
                    title: 'Payment',
                    headerTitleStyle: { color: '#4F46E5' },
                    headerTintColor: '#4F46E5',
                }}
            />

            <ScrollView
                contentContainerStyle={styles.scrollContainer}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                bounces={false}
            >
                <LinearGradient
                    colors={['#F9FAFB', '#E0E7FF']}
                    style={styles.gradientContainer}
                >
                    {/* Header Section */}
                    <View style={styles.headerContainer}>
                        <Text style={styles.headerTitle}>
                            Payment Details for Teacher Application
                        </Text>
                        <Text style={styles.headerSubtitle}>
                            Enter your card information to complete the payment
                        </Text>
                    </View>

                    {/* Card Preview */}
                    <View style={styles.cardPreview}>
                        <View style={styles.cardHeader}>
                            <Text style={styles.cardHeaderText}>
                                Credit Card
                            </Text>
                            <MaterialIcons
                                name="sim-card"
                                size={24}
                                color="white"
                            />
                        </View>
                        <Text style={styles.cardNumber}>
                            {cardDetails.number || '4242 4242 4242 4242'}
                        </Text>
                        <View style={styles.cardFooter}>
                            <View>
                                <Text style={styles.cardLabel}>Expiry</Text>
                                <Text style={styles.cardValue}>
                                    {cardDetails.expiry || '12/25'}
                                </Text>
                            </View>
                            <View>
                                <Text style={styles.cardLabel}>CVC</Text>
                                <Text style={styles.cardValue}>
                                    {cardDetails.cvc || '123'}
                                </Text>
                            </View>
                            <MaterialCommunityIcons
                                name="contactless-payment"
                                size={24}
                                color="white"
                            />
                        </View>
                    </View>

                    {/* Form Section */}
                    <View style={styles.formContainer}>
                        {/* Card Number */}
                        <View style={styles.inputContainer}>
                            <View style={styles.inputHeader}>
                                <Text style={styles.inputLabel}>
                                    Card Number
                                </Text>
                                {cardErrors.number && (
                                    <Text style={styles.errorText}>
                                        {cardErrors.number}
                                    </Text>
                                )}
                            </View>
                            <View
                                style={[
                                    styles.inputField,
                                    cardErrors.number && styles.inputError,
                                ]}
                            >
                                <MaterialIcons
                                    name="credit-card"
                                    size={20}
                                    color="#6B7280"
                                    style={styles.inputIcon}
                                />
                                <TextInput
                                    style={styles.textInput}
                                    placeholder="1234 5678 9012 3456"
                                    placeholderTextColor="#9CA3AF"
                                    keyboardType="number-pad"
                                    value={cardDetails.number}
                                    onChangeText={handleCardNumberChange}
                                    maxLength={19}
                                    returnKeyType="next"
                                    onSubmitEditing={() => {
                                        // Focus next field logic if needed
                                    }}
                                />
                            </View>
                        </View>

                        {/* Expiry and CVC */}
                        <View style={styles.rowInputContainer}>
                            <View
                                style={[
                                    styles.inputContainer,
                                    { flex: 1, marginRight: 8 },
                                ]}
                            >
                                <View style={styles.inputHeader}>
                                    <Text style={styles.inputLabel}>
                                        Expiry Date
                                    </Text>
                                    {cardErrors.expiry && (
                                        <Text style={styles.errorText}>
                                            {cardErrors.expiry}
                                        </Text>
                                    )}
                                </View>
                                <View
                                    style={[
                                        styles.inputField,
                                        cardErrors.expiry && styles.inputError,
                                    ]}
                                >
                                    <MaterialIcons
                                        name="calendar-today"
                                        size={18}
                                        color="#6B7280"
                                        style={styles.inputIcon}
                                    />
                                    <TextInput
                                        style={styles.textInput}
                                        placeholder="MM/YY"
                                        placeholderTextColor="#9CA3AF"
                                        keyboardType="number-pad"
                                        value={cardDetails.expiry}
                                        onChangeText={handleExpiryChange}
                                        maxLength={5}
                                        returnKeyType="next"
                                    />
                                </View>
                            </View>

                            <View
                                style={[
                                    styles.inputContainer,
                                    { flex: 1, marginLeft: 8 },
                                ]}
                            >
                                <View style={styles.inputHeader}>
                                    <Text style={styles.inputLabel}>CVC</Text>
                                    {cardErrors.cvc && (
                                        <Text style={styles.errorText}>
                                            {cardErrors.cvc}
                                        </Text>
                                    )}
                                </View>
                                <View
                                    style={[
                                        styles.inputField,
                                        cardErrors.cvc && styles.inputError,
                                    ]}
                                >
                                    <MaterialIcons
                                        name="lock"
                                        size={18}
                                        color="#6B7280"
                                        style={styles.inputIcon}
                                    />
                                    <TextInput
                                        style={styles.textInput}
                                        placeholder="•••"
                                        placeholderTextColor="#9CA3AF"
                                        keyboardType="number-pad"
                                        value={cardDetails.cvc}
                                        onChangeText={handleCvcChange}
                                        maxLength={3}
                                        secureTextEntry
                                        returnKeyType="done"
                                        onSubmitEditing={Keyboard.dismiss}
                                    />
                                </View>
                            </View>
                        </View>

                        {/* Submit Button */}
                        <TouchableOpacity
                            style={styles.submitButton}
                            onPress={handleSubmitPayment}
                            disabled={loading}
                            activeOpacity={0.7}
                        >
                            <LinearGradient
                                colors={['#4F46E5', '#7C3AED']}
                                style={styles.gradientButton}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                            >
                                {loading ? (
                                    <ActivityIndicator
                                        color="white"
                                        size="small"
                                    />
                                ) : (
                                    <Text style={styles.buttonText}>
                                        Pay $10.00
                                    </Text>
                                )}
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>

                    {/* Security Footer */}
                    <View style={styles.securityFooter}>
                        <MaterialIcons
                            name="security"
                            size={18}
                            color="#4F46E5"
                        />
                        <Text style={styles.securityText}>
                            Your payment is securely encrypted
                        </Text>
                    </View>
                </LinearGradient>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    scrollContainer: {
        flexGrow: 1,
    },
    gradientContainer: {
        flex: 1,
        padding: 24,
        paddingBottom: 40,
    },
    headerContainer: {
        marginBottom: 32,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 8,
        lineHeight: 32,
    },
    headerSubtitle: {
        fontSize: 16,
        color: '#6B7280',
        lineHeight: 24,
    },
    cardPreview: {
        borderRadius: 12,
        backgroundColor: '#4F46E5',
        padding: 24,
        marginBottom: 32,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 32,
    },
    cardHeaderText: {
        fontSize: 18,
        fontWeight: '600',
        color: 'white',
    },
    cardIcon: {
        height: 32,
        width: 40,
    },
    cardNumber: {
        fontSize: 22,
        fontWeight: '600',
        letterSpacing: 1,
        color: 'white',
        marginBottom: 32,
        fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    cardLabel: {
        fontSize: 12,
        color: '#A5B4FC',
        marginBottom: 4,
    },
    cardValue: {
        fontSize: 16,
        fontWeight: '500',
        color: 'white',
        fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
    },
    cardBrandIcon: {
        height: 32,
        width: 48,
    },
    formContainer: {
        borderRadius: 16,
        backgroundColor: 'white',
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 2,
    },
    inputContainer: {
        marginBottom: 20,
    },
    rowInputContainer: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    inputHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '500',
        color: '#374151',
    },
    errorText: {
        fontSize: 12,
        color: '#EF4444',
    },
    inputField: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        paddingHorizontal: 16,
        paddingVertical: 14,
        backgroundColor: '#F9FAFB',
    },
    inputError: {
        borderColor: '#FCA5A5',
        backgroundColor: '#FEE2E2',
    },
    inputIcon: {
        marginRight: 12,
    },
    textInput: {
        flex: 1,
        fontSize: 16,
        color: '#111827',
        padding: 0,
    },
    submitButton: {
        borderRadius: 12,
        overflow: 'hidden',
        marginTop: 4,
    },
    gradientButton: {
        width: '100%',
        paddingVertical: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        fontSize: 18,
        fontWeight: '600',
        color: 'white',
    },
    securityFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
    },
    securityText: {
        fontSize: 14,
        color: '#4F46E5',
        marginLeft: 8,
    },
});

// For responsive design
const responsiveStyles = StyleSheet.create({
    headerTitle: {
        fontSize: width < 400 ? 22 : 24,
    },
    cardNumber: {
        fontSize: width < 400 ? 18 : 22,
    },
});
