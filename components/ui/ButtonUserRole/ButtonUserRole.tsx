import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    StyleSheet,
    Dimensions,
} from 'react-native';

// Tanlash turi uchun enum
enum UserType {
    DRIVER = 'driver',
    OWNER = 'owner',
}

interface SelectionButtonProps {
    selected: boolean;
    onPress: () => void;
    imageSource: any;
    title: string;
}

const SelectionButton: React.FC<SelectionButtonProps> = ({
    selected,
    onPress,
    imageSource,
    title,
}) => (
    <TouchableOpacity
        style={[
            styles.button,
            selected && styles.selectedButton,
        ]}
        onPress={onPress}
        activeOpacity={0.8}
    >
        <Image source={imageSource} style={styles.buttonImage} />
        <Text style={[styles.buttonText, selected && styles.selectedText]}>
            {title}
        </Text>
    </TouchableOpacity>
);

interface UserTypeSelectionProps {
    onSelect?: (type: UserType) => void;
}

const UserTypeSelection: React.FC<UserTypeSelectionProps> = ({ onSelect }) => {

    const [selectedType, setSelectedType] = useState<UserType | null>(null);
    const handleSelect = (type: UserType) => {
        setSelectedType(type);
        onSelect?.(type);
    };

    return (
        <View style={styles.container}>
            <View style={styles.buttonContainer}>
                <SelectionButton
                    selected={selectedType === UserType.DRIVER}
                    onPress={() => handleSelect(UserType.DRIVER)}
                    imageSource={require('../../../app/assets/dirver.jpg')} // Rasimni o'z loyihangizdan ko'rsating
                    title="Haydovchi"
                />

                <SelectionButton
                    selected={selectedType === UserType.OWNER}
                    onPress={() => handleSelect(UserType.OWNER)}
                    imageSource={require('../../../app/assets/cargo.png')} // Rasimni o'z loyihangizdan ko'rsating
                    title="Yuk egasi"
                />
            </View>
        </View>
    );
};

const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',

    },
    button: {
        width: '47%', // Ekran kengligining yarmi, chetlardan padding ayirilgan
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#E6E9EB',
        height: 150
    },
    selectedButton: {
        backgroundColor: '#ffffff',
        borderColor: '#7257FF',
        borderWidth: 2,
        // Shadow for iOS
        shadowColor: '#7257FF',
        shadowOffset: {
            width: 10,
            height: 2,
        },
        shadowOpacity: 1.85,
        shadowRadius: 3.84,
        // Shadow for Android
        elevation: 30,
    },
    buttonImage: {
        width: 90,
        height: 90,
        marginBottom: 8,
    },
    buttonText: {
        fontSize: 16,
        color: '#898D8F',
        marginTop: 8,
    },
    selectedText: {
        color: '#7257FF',
    },
});

export default UserTypeSelection;