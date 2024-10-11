import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/FontAwesome';
import moment from 'moment';

interface CustomDatePickerProps {
    onDateChange: (date: Date) => void;
}

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({ onDateChange }) => {
    const [date, setDate] = useState<Date | null>(null);
    const [showPicker, setShowPicker] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [dateIsFocused, setDateIsFocused] = useState<boolean>(false);

    const showDatepicker = () => {
        setShowPicker(true);
    };

    const onDateSelected = (event: any, selectedDate?: Date) => {
        const currentDate = selectedDate || date;
        setShowPicker(Platform.OS === 'ios');
        if (currentDate) {
            setDate(currentDate);
            setInputValue(moment(currentDate).format('DD/MM/YYYY'));
            onDateChange(currentDate);
        }
    };

    const formatInput = (text: string): string => {
        // Faqat raqamlarni qoldirish
        const numbers = text.replace(/\D/g, '');

        // Formatlash
        if (numbers.length <= 2) {
            return numbers;
        } else if (numbers.length <= 4) {
            return `${numbers.slice(0, 2)}/${numbers.slice(2)}`;
        } else {
            return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}/${numbers.slice(4, 8)}`;
        }
    };

    const handleInputChange = (text: string) => {
        const formattedText = formatInput(text);
        setInputValue(formattedText);

        if (formattedText.length === 10) {
            const parsedDate = moment(formattedText, 'DD/MM/YYYY', true);
            if (parsedDate.isValid()) {
                setDate(parsedDate.toDate());
                onDateChange(parsedDate.toDate());
            } else {
                onDateChange(null);
            }
        } else {
            setDate(null);
            onDateChange(null);
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={!dateIsFocused ? styles.input : styles.inputFocus}
                placeholder="dd/mm/yyyy"
                value={inputValue}
                onChangeText={handleInputChange}
                keyboardType="numeric"
                placeholderTextColor="#898D8F"
                maxLength={10}
                onFocus={() => setDateIsFocused(true)}
                onBlur={() => setDateIsFocused(false)}

            />
            <TouchableOpacity onPress={showDatepicker} style={styles.iconContainer}>
                <Icon name="calendar" size={20} color="#000" />
            </TouchableOpacity>
            {showPicker && (
                <DateTimePicker
                    value={date || new Date()}
                    mode="date"
                    display="default"
                    onChange={onDateSelected}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
    },
    input: {
        borderColor: '#E6E9EB',
        width: '100%',
        color: '#131214',
        borderRadius: 8,
        paddingLeft: 15,
        flex: 1,
    },

    inputFocus: {
        flex: 1,
        borderColor: '#7257FF',
        width: '100%',
        borderWidth: 2,
        color: '#131214',
        borderRadius: 8,
        paddingLeft: 15,
        shadowColor: '#7257FF',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 1,
        elevation: 1,

    },

    iconContainer: {
        padding: 10,
    },
});

export default CustomDatePicker;