import React, { useRef, useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Dimensions,
    Image,
    ImageSourcePropType,
    Animated
} from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import { HomeProps } from './RouterType';

interface Slide {
    key: string;
    image: ImageSourcePropType;
    text: string;
    sub_text: string;
}

const slides: Slide[] = [
    {
        key: '1',
        image: require('../../assets/img/silder.png'),
        text: 'Eng yaxshi dizayn tizimini yarating 1',
        sub_text: "1000+ UI komponentlariga, Uslublar kutubxonasiga, piktogramma va rasmlarga to'liq kirish."
    },
    {
        key: '2',
        image: require('../../assets/img/silder.png'),
        text: 'Eng yaxshi dizayn tizimini yarating 2',
        sub_text: "1000+ UI komponentlariga, Uslublar kutubxonasiga, piktogramma va rasmlarga to'liq kirish."

    },
    {
        key: '3',
        image: require('../../assets/img/silder.png'),
        text: 'Eng yaxshi dizayn tizimini yarating 3',
        sub_text: "1000+ UI komponentlariga, Uslublar kutubxonasiga, piktogramma va rasmlarga to'liq kirish."

    },
    {
        key: '4',
        image: require('../../assets/img/silder.png'),
        text: 'Eng yaxshi dizayn tizimini yarating 4',
        sub_text: "1000+ UI komponentlariga, Uslublar kutubxonasiga, piktogramma va rasmlarga to'liq kirish."

    },
    {
        key: '5',
        image: require('../../assets/img/silder.png'),
        text: 'Eng yaxshi dizayn tizimini yarating 5',
        sub_text: "1000+ UI komponentlariga, Uslublar kutubxonasiga, piktogramma va rasmlarga to'liq kirish."

    },
];

const IntroScreen: React.FC<HomeProps> = ({ navigation }) => {
    const animatedValue = useRef(new Animated.Value(0)).current;

    const handlePressIn = () => {
        // setIsPressed(true);
        Animated.timing(animatedValue, {
            toValue: 1, // Final holat (bosilganda)
            duration: 100, // O'zgarish vaqti (ms)
            useNativeDriver: false, // ranglar uchun `useNativeDriver` false bo'lishi kerak
        }).start();
    };

    const backgroundColor = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['#7257FF', '#462eba'], // 0 = 'blue', 1 = 'darkblue'
    });


    const handlePressOut = () => {
        // setIsPressed(false);
        Animated.timing(animatedValue, {
            toValue: 0, // Bosilmaganda dastlabki holatga qaytadi
            duration: 100, // O'zgarish vaqti (ms)
            useNativeDriver: false,
        }).start();
    };

    const renderItem = ({ item }: { item: Slide }) => {
        return (
            <View style={styles.slide}>
                <View style={styles.imageContainer}>
                    <Image source={item.image} style={styles.image} />
                    <Text style={styles.text}>{item.text}</Text>
                    <Text style={styles.sub_text}>{item.sub_text}</Text>
                </View>
            </View>
        );
    };

    const renderPagination = (activeIndex: number): React.ReactElement => {
        return (
            <View style={styles.paginationContainer}>
                <View style={styles.paginationDots}>
                    {slides.map((_, i) => (
                        <View
                            key={i}
                            style={[
                                styles.dot,
                                i === activeIndex ? styles.dotActive : styles.dotInactive,
                            ]}
                        />
                    ))}
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <AppIntroSlider<Slide>
                data={slides}
                renderItem={renderItem}
                renderPagination={renderPagination}
                showPrevButton={false}
                showNextButton={false}
                showDoneButton={false}
            />
            <View style={styles.bottomContainer}>
                <View style={{
                    display: 'flex',
                    width: '100%',
                    alignItems: 'center',
                    flexDirection: 'row',
                    justifyContent: 'center'
                }}>
                    <TouchableOpacity
                        // style={isPressed ? styles.inbutton : styles.button}
                        onPressIn={() => handlePressIn()}
                        onPressOut={() => handlePressOut()}
                        activeOpacity={1}
                        onPress={() => navigation.navigate('register')}
                    >
                        <Animated.View style={[styles.button, { backgroundColor }]}>
                            <Text
                                style={styles.button_text}>
                                Ro'yxatdan o'tish
                            </Text>
                        </Animated.View>
                    </TouchableOpacity>
                </View>
                <View style={{
                    marginTop: 13
                }}>
                    <Text style={{ marginBottom: 5, color: '#131214', fontSize: 18 }}>Akkountingiz bormi?   <Text onPress={() => navigation.navigate('login')} style={{ color: '#7257FF', fontWeight: '600' }}>Kirish</Text></Text>
                </View>
            </View>
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        paddingHorizontal: 15
    },
    slide: {
        flex: 1,
        // alignItems: 'center',
        // justifyContent: 'space-between',
        marginTop: 50
    },
    imageContainer: {
        alignItems: 'center',
    },
    image: {
        width: Dimensions.get('window').width * 0.8,
        height: Dimensions.get('window').width * 0.8,
        resizeMode: 'contain',
    },
    button: {
        backgroundColor: '#7257FF',
        padding: 10,
        width: '100%',
        borderRadius: 20,
        cursor: 'pointer',
        marginBottom: 16,
        paddingHorizontal: 30

    },
    button_text: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 20,
        width: '100%',
    },
    text: {
        marginTop: 20,
        textAlign: 'center',
        fontSize: 35,
        color: '#333',
        fontWeight: '600',
    },
    sub_text: {
        textAlign: 'center',
        fontSize: 16,
        color: '#6E7375',
    },
    paginationContainer: {
        position: 'absolute',
        bottom: 220,
        left: 0,
        right: 0,
        alignItems: 'center',
    },
    paginationDots: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginHorizontal: 4,
    },
    dotActive: {
        backgroundColor: '#7257FF',
    },
    dotInactive: {
        backgroundColor: '#E6E9EB',
    },
    bottomContainer: {
        position: 'absolute',
        bottom: 40,
        left: 0,
        right: 0,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    loginText: {
        fontSize: 14,
        color: '#333',
    },
});

export default IntroScreen;