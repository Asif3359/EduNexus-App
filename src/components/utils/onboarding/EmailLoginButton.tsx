import { Text, TouchableOpacity } from 'react-native';

interface EmailLoginButtonProps {
    onPress: () => void;
}

export default function EmailLoginButton({ onPress }: EmailLoginButtonProps) {
    return (
        <TouchableOpacity
            className="h-[50px] w-11/12 flex-row items-center justify-center rounded-full bg-white px-4"
            onPress={onPress}
        >
            <Text className="text-base font-semibold text-black">
                🔗 Continue with E-mail
            </Text>
        </TouchableOpacity>
    );
}
