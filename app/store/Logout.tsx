import { RemoveData } from '../screens/AsyncStorage/AsyncStorage';
import { logout } from './UserData';
import store from '../store/store';
import SocketService from '../screens/ui/Socket/index';
export const handleLogout = async () => {
    const socketService = SocketService.getInstance();

    try {

        socketService.disconnect()
        // Redux state'ni tozalash
        store.dispatch(logout());

        await RemoveData('user_id')
        await RemoveData('token')
        await RemoveData('role')
        await RemoveData('inlogin')
        await RemoveData('user_id_passwor')
        await RemoveData('user_data')
        await RemoveData('user_data_2')
        // Qo'shimcha storage keylarni ham o'chirish kerak bo'lsa shu yerga qo'shing

        return true;
    } catch (error) {
        console.error('Logout error:', error);
        return false;
    }
};