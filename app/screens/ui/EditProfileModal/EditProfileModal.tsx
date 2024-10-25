import React from 'react';
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface EditProfileModalProps {
    visible: boolean;
    onClose: () => void;
    onChangePhoneNumber: () => void;
    onChangePersonalInfo: () => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
    visible,
    onClose,
    onChangePhoneNumber,
    onChangePersonalInfo,
}) => {
    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="slide"
            onRequestClose={onClose}
        >
            <TouchableOpacity onPress={onClose} style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    {/* Handle bar */}
                    <View style={styles.handleContainer}>
                        <View style={styles.handle} />
                    </View>

                    {/* Phone number button */}
                    <TouchableOpacity
                        style={styles.button}
                        onPress={onChangePhoneNumber}
                    >
                        <Icon name="phone" size={24} color="#666666" />
                        <Text style={styles.buttonText}>
                            Asosiy telefon raqamni o'zgartirish
                        </Text>
                        <Icon name="chevron-right" size={24} color="#666666" />
                    </TouchableOpacity>

                    {/* Personal info button */}
                    <TouchableOpacity
                        style={styles.button}
                        onPress={onChangePersonalInfo}
                    >
                        <Icon name="account-edit" size={24} color="#666666" />
                        <Text style={styles.buttonText}>
                            Shaxsiy ma'lumotlarni o'zgartirish
                        </Text>
                        <Icon name="chevron-right" size={24} color="#666666" />
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingBottom: 20,
    },
    handleContainer: {
        width: '100%',
        height: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 10,
    },
    handle: {
        width: 48,
        height: 5,
        backgroundColor: '#E6E9EB',
        borderRadius: 3,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    buttonText: {
        flex: 1,
        color: '#000000',
        fontSize: 16,
        marginLeft: 12,
    },
});

export default EditProfileModal;