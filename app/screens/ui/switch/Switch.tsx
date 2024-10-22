import React from 'react';
import {
    TouchableOpacity,
    Animated,
    StyleSheet,
    ViewStyle,
    StyleProp
} from 'react-native';

interface SwitchProps {
    value: boolean;
    onValueChange: (value: boolean) => void;
    style?: StyleProp<ViewStyle>;
    disabled?: boolean;
}

const CustomSwitch: React.FC<SwitchProps> = ({
    value,
    onValueChange,
    style,
    disabled = false,
}) => {
    const translateX = React.useRef(new Animated.Value(value ? 22 : 2)).current;

    React.useEffect(() => {
        Animated.spring(translateX, {
            toValue: value ? 22 : 2,
            useNativeDriver: true,
            bounciness: 0,
        }).start();
    }, [value]);

    const handlePress = () => {
        if (!disabled) {
            onValueChange(!value);
        }
    };

    return (
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={handlePress}
            style={[
                styles.container,
                {
                    backgroundColor: value ? '#7257FF' : '#E6E9EB',
                },
                style,
                disabled && styles.disabled,
            ]}
        >
            <Animated.View
                style={[
                    styles.circle,
                    {
                        transform: [{ translateX }],
                    },
                ]}
            />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        width: 50,
        height: 26,
        borderRadius: 13,
        padding: 2,
        justifyContent: 'center',
    },
    circle: {
        width: 22,
        height: 22,
        borderRadius: 11,
        backgroundColor: 'white',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 2.5,
        elevation: 4,
    },
    disabled: {
        opacity: 0.5,
    },
});

export default CustomSwitch;