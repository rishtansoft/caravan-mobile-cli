import AsyncStorage from '@react-native-async-storage/async-storage';

// Ma'lumotni saqlash
export const StoreData = async (key: string, value: string): Promise<void> => {
    try {
        await AsyncStorage.setItem(key, value);
    } catch (e) {
        console.error("Ma'lumotni saqlashda xato yuz berdi:", e);
    }
}

// Ma'lumotni olish
export const GetData = async (key: string): Promise<string | null> => {
    try {
        const value = await AsyncStorage.getItem(key);
        if (value !== null) {
            return value;
        }
        return null; // Ma'lumot topilmadi
    } catch (e) {
        console.error("Ma'lumotni olishda xato yuz berdi:", e);
        return null;
    }
}

// Ma'lumotni o'chirish
export const RemoveData = async (key: string): Promise<void> => {
    try {
        await AsyncStorage.removeItem(key);
        console.log(`${key} kaliti bo'yicha ma'lumot o'chirildi.`);
    } catch (e) {
        console.error("Ma'lumotni o'chirishda xato yuz berdi:", e);
    }
}
