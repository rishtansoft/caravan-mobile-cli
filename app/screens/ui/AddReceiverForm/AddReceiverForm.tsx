import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    Pressable,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CustomSwitch from '../switch/Switch';
import Fontisto from 'react-native-vector-icons/Octicons'; //arrow-switch

interface ReceiverFormProps {
    onSubmit: (data: {
        phone: string;
        payer: 'sender' | 'receiver';
        roundTrip: boolean;
        comment: string;
    }) => void;
}

const AddReceiverForm: React.FC<ReceiverFormProps> = ({ onSubmit }) => {
    const [phone, setPhone] = useState('');
    const [comment, setComment] = useState('');
    const [payer, setPayer] = useState<'sender' | 'receiver'>('sender');
    const [roundTrip, setRoundTrip] = useState(false);
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
        <View style={styles.container}>
            {/* Telefon raqami Input */}
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Qabul qiluvchining telefon raqami</Text>
                <TextInput
                    value={phone}
                    onChangeText={setPhone}
                    placeholder="+998 __  ___  __  __"
                    placeholderTextColor="#898D8F"
                    style={phoneIsFocused ? styles.inputFocus : styles.input}
                    onFocus={() => setPhoneIsFocused(true)}
                    onBlur={() => setPhoneIsFocused(false)}
                    keyboardType="phone-pad"
                />
            </View>

            {/* Kim to'laydi Radio */}
            <View style={styles.payerContainer}>
                <Text style={styles.radioText}>Kim to'laydi</Text>
                <View style={styles.radioGroup}>
                    <Pressable
                        style={styles.radioButton}
                        onPress={() => setPayer('sender')}
                    >
                        <RadioButton selected={payer === 'sender'} />
                        <Text style={[
                            styles.activeText
                        ]}>
                            Yuk beruvchi
                        </Text>
                    </Pressable>
                    <Pressable
                        style={styles.radioButton}
                        onPress={() => setPayer('receiver')}
                    >
                        <RadioButton selected={payer === 'receiver'} />
                        <Text style={[
                            styles.activeText
                        ]}>
                            Yuk oluvchi
                        </Text>
                    </Pressable>
                </View>
            </View>

            {/* Borib qaytish */}
            <View style={styles.roundTripContainer}>
                <View style={styles.roundTripLeft}>
                    <Fontisto name="arrow-switch" size={24} color="#131214" />
                    <Text style={styles.roundTripText}>Borib qaytish</Text>
                </View>
                <CustomSwitch
                    value={roundTrip}
                    onValueChange={setRoundTrip}
                />
            </View>

            {/* Izoh TextArea */}
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Buyurtma uchun sharh</Text>
                <TextInput
                    value={comment}
                    onChangeText={setComment}
                    placeholder="Buyurtma uchun sharh"
                    placeholderTextColor="#898D8F"
                    style={[
                        commentIsFocused ? styles.inputFocus : styles.input,
                        styles.textArea
                    ]}
                    onFocus={() => setCommentIsFocused(true)}
                    onBlur={() => setCommentIsFocused(false)}
                    multiline={true}
                    numberOfLines={4}
                    textAlignVertical="top"
                />
            </View>
        </View>
    );
};


const styles = StyleSheet.create({

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