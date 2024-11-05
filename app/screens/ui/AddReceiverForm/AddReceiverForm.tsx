import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    Pressable,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CustomSwitch from '../switch/Switch';
import Fontisto from 'react-native-vector-icons/Octicons';

interface ReceiverFormProps {
    phone: string;
    payer: 'sender' | 'receiver';
    roundTrip: boolean;
    comment: string;
    phoneError: boolean;
    payerError: boolean;
    roundTripError: boolean;
    commentError: boolean;
    onPhoneChange: (value: string) => void;
    onPayerChange: (value: 'sender' | 'receiver') => void;
    onRoundTripChange: (value: boolean) => void;
    onCommentChange: (value: string) => void;
}

const AddReceiverForm: React.FC<ReceiverFormProps> = ({
    phone,
    payer,
    roundTrip,
    comment,
    phoneError,
    payerError,
    roundTripError,
    commentError,
    onPhoneChange,
    onPayerChange,
    onRoundTripChange,
    onCommentChange,
}) => {
    // const [phone, setPhone] = useState('');
    // const [comment, setComment] = useState('');
    // const [payer, setPayer] = useState<'sender' | 'receiver'>('sender');
    // const [roundTrip, setRoundTrip] = useState(false);
    const [phoneIsFocused, setPhoneIsFocused] = useState(false);
    const [commentIsFocused, setCommentIsFocused] = useState(false);

    const RadioButton = ({ selected }: { selected: boolean }) => (
        <View style={[styles.radioContainer, selected && styles.radioContainerSelected]}>
            <View style={[
                styles.radioOuter,
                selected && styles.radioOuterSelected
            ]}>
                {selected && (
                    <View style={styles.radioInnerContainer}>
                        <View style={styles.radioInner} />
                    </View>
                )}
            </View>
        </View>
    );

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.keyboardAvoidingView}
        >
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContentContainer}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.container}>
                    {/* Telefon raqami Input */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Qabul qiluvchining telefon raqami</Text>
                        <TextInput
                            value={phone}
                            onChangeText={onPhoneChange}
                            placeholder="+998 __  ___  __  __"
                            placeholderTextColor="#898D8F"
                            style={[
                                phoneIsFocused ? styles.inputFocus : styles.input,
                                phoneError && styles.errorInput
                            ]}
                            onFocus={() => setPhoneIsFocused(true)}
                            onBlur={() => setPhoneIsFocused(false)}
                            keyboardType="phone-pad"
                        />
                        {phoneError && (
                            <Text style={styles.errorText}>To'g'ri telefon raqami kiriting</Text>
                        )}
                    </View>

                    {/* Kim to'laydi Radio */}
                    <View style={styles.payerContainer}>
                        <Text style={styles.radioText}>Kim to'laydi</Text>
                        <View style={styles.radioGroup}>
                            <Pressable
                                style={styles.radioButton}
                                onPress={() => onPayerChange('sender')}
                            >
                                <RadioButton selected={payer === 'sender'} />
                                <Text style={styles.activeText}>Yuk beruvchi</Text>
                            </Pressable>
                            <Pressable
                                style={styles.radioButton}
                                onPress={() => onPayerChange('receiver')}
                            >
                                <RadioButton selected={payer === 'receiver'} />
                                <Text style={styles.activeText}>Yuk oluvchi</Text>
                            </Pressable>
                        </View>
                        {payerError && (
                            <Text style={styles.errorText}>Kim to'lashini tanlang</Text>
                        )}
                    </View>

                    {/* Borib qaytish */}
                    <View style={styles.roundTripContainer}>
                        <View style={styles.roundTripLeft}>
                            <Fontisto name="arrow-switch" size={24} color="#131214" />
                            <Text style={styles.roundTripText}>Borib qaytish</Text>
                        </View>
                        <CustomSwitch
                            value={roundTrip}
                            onValueChange={onRoundTripChange}
                        />

                    </View>

                    {/* Izoh TextArea */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Buyurtma uchun sharh</Text>
                        <TextInput
                            value={comment}
                            onChangeText={onCommentChange}
                            placeholder="Buyurtma uchun sharh"
                            placeholderTextColor="#898D8F"
                            style={[
                                commentIsFocused ? styles.inputFocus : styles.input,
                                styles.textArea,
                                commentError && styles.errorInput
                            ]}
                            onFocus={() => setCommentIsFocused(true)}
                            onBlur={() => setCommentIsFocused(false)}
                            multiline={true}
                            numberOfLines={4}
                            textAlignVertical="top"
                        />
                        {commentError && (
                            <Text style={styles.errorText}>Buyurtma uchun sharh yozing</Text>
                        )}
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    errorInput: {
        borderColor: '#FF3B30',
    },
    errorText: {
        color: '#FF3B30',
        fontSize: 12,
        marginTop: 4,
    },
    selectedText: {
        color: '#000000',
    },

    keyboardAvoidingView: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    scrollContentContainer: {
        flexGrow: 1,
        paddingBottom: 20, // Klaviatura ostida qo'shimcha padding
    },
    // ... qolgan styles kodlari o'zgarishsiz qoladi ...
    radioContainer: {
        width: 20,
        height: 20,
        padding: 2,
        backgroundColor: '#f5f8fa',
        borderRadius: 10,
        elevation: 1,
        shadowColor: 'rgba(16,22,26,0.2)',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 1,
    },
    radioContainerSelected: {
        backgroundColor: '#7257FF',
    },
    radioOuter: {
        width: '100%',
        height: '100%',
        borderRadius: 8,
        backgroundColor: '#f5f8fa',
        borderWidth: 1,
        borderColor: 'rgba(16,22,26,0.2)',
    },
    radioOuterSelected: {
        borderColor: 'transparent',
        backgroundColor: '#7257FF',
    },
    radioInnerContainer: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    radioInner: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#fff',
    },
    radioButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    radioText: {
        fontSize: 14,
        color: '#898D8F',
    },
    activeText: {
        color: '#131214',
        fontWeight: '500',
    },
    container: {
        gap: 16,
        flex: 1,
    },
    inputContainer: {
        gap: 8,
        marginBottom: 16,
    },
    label: {
        fontSize: 16,
        fontWeight: '500',
        color: '#131214',
        marginBottom: 4,
    },
    input: {
        borderColor: '#E6E9EB',
        width: '100%',
        borderWidth: 1,
        color: '#131214',
        borderRadius: 8,
        paddingLeft: 15,
        height: 48,
    },
    inputFocus: {
        borderColor: '#7257FF',
        width: '100%',
        borderWidth: 2,
        color: '#131214',
        borderRadius: 8,
        paddingLeft: 15,
        height: 48,
        shadowColor: '#7257FF',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 1,
        elevation: 1,
    },
    textArea: {
        height: 100,
        paddingTop: 12,
        paddingRight: 15,
        paddingBottom: 12,
    },
    payerContainer: {
        marginBottom: 16,
    },
    radioGroup: {
        flexDirection: 'column',
        gap: 12,
        marginTop: 8,
    },
    roundTripContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 8,
        marginBottom: 16,
    },
    roundTripLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    roundTripText: {
        fontSize: 16,
        color: '#131214',
        fontWeight: '500',
    },
});

export default AddReceiverForm;