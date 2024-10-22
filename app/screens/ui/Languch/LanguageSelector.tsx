// components/LanguageSelector.tsx
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Modal,
    StyleSheet,
    Image,
    Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Feather from 'react-native-vector-icons/Feather';

type Language = {
    id: string;
    name: string;
    flag: any; // Rasmlar uchun
    code: string;
};

const languages: Language[] = [
    {
        id: '1',
        name: "O'zbek",
        flag: require('../../../assets/img/uz.png'),
        code: 'uz'
    },
    {
        id: '2',
        name: 'English',
        flag: require('../../../assets/img/en.png'),
        code: 'en'
    },
    {
        id: '3',
        name: 'Русский',
        flag: require('../../../assets/img/ru.png'),
        code: 'ru'
    }
];

interface LanguageSelectorProps {
    selectedLanguage: string;
    onSelectLanguage: (languageCode: string) => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
    selectedLanguage,
    onSelectLanguage
}) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [name, setName] = useState('');

    useEffect(() => {
        const nameLeng = languages.find((el) => el.code == selectedLanguage)?.name;
        if (nameLeng) {
            setName(nameLeng)
        }
    }, [selectedLanguage]);

    const handleLanguageSelect = (languageCode: string) => {
        onSelectLanguage(languageCode);
        setModalVisible(false);
    };

    return (
        <View>
            <TouchableOpacity
                style={styles.setting}
                onPress={() => setModalVisible(true)}
            >
                <View style={styles.setting_left}>
                    <SimpleLineIcons name="globe" size={20} color="#131214" />
                    <Text style={styles.setting_text}>{name}</Text>
                </View>
                <Icon
                    name="angle-right" size={20} color="#131214" />
            </TouchableOpacity>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setModalVisible(false)}
                >
                    <View style={styles.modalContent}>
                        {/* Modal Header with gray line */}
                        <View style={styles.modalHeader}>
                            <View style={styles.headerLine} />
                        </View>

                        <Text style={styles.modalTitle}>Ilova tili</Text>

                        {/* Language Options */}
                        {languages.map((language) => (
                            <TouchableOpacity
                                key={language.id}
                                style={styles.languageOption}
                                onPress={() => handleLanguageSelect(language.code)}
                            >
                                <View style={styles.languageRow}>
                                    <Image
                                        source={language.flag}
                                        style={styles.flagIcon}
                                    />
                                    <Text style={styles.languageName}>{language.name}</Text>

                                    {/* Checkbox */}
                                    <View style={styles.checkbox}>
                                        {selectedLanguage === language.code && (
                                            <Feather name="check" size={24} color="#898D8F" />

                                        )}
                                    </View>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    setting: {
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
        marginBottom: 15

    },
    setting_left: {
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'row',
        gap: 10,

    },
    setting_text: {
        color: '#131214',
        fontSize: 16,

    },

    selectorButton: {
        padding: 15,
        backgroundColor: 'white',
    },
    buttonText: {
        fontSize: 16,
        color: '#131214',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingBottom: 30,
    },
    modalHeader: {
        alignItems: 'center',
        paddingVertical: 10,
    },
    headerLine: {
        width: 48,
        height: 5,
        backgroundColor: '#E6E9EB',
        borderRadius: 2.5,
    },
    modalTitle: {
        fontSize: 26,
        color: '#131214',
        textAlign: 'left',
        marginVertical: 15,
        fontWeight: '600',
        paddingHorizontal: 20,
    },
    languageOption: {
        paddingVertical: 15,
        paddingHorizontal: 20,
    },
    languageRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    flagIcon: {
        width: 25,
        height: 25,
        marginRight: 15,
        borderRadius: 80
    },
    languageName: {
        fontSize: 16,
        flex: 1,
        color: '#131214',
    },
    checkbox: {
        // width: 24,
        // height: 24,
        // borderRadius: 12,
        // borderWidth: 2,
        // borderColor: '#007AFF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkboxInner: {
        width: 14,
        height: 14,
        borderRadius: 7,
        backgroundColor: '#007AFF',
    },
});

export default LanguageSelector;