import { RemoveData } from '../screens/AsyncStorage/AsyncStorage';
import { logout } from './UserData';
import store from '../store/store';
import SocketService from '../screens/ui/Socket/index';
export const handleLogout = async () => {
    const socketService = SocketService.getInstance();

    try {

        socketService.disconnect()
        // Redux state'ni tozalas
        RemoveData('user_id')
        RemoveData('token')
        RemoveData('role')
        RemoveData('inlogin')
        RemoveData('user_id_passwor')
        RemoveData('user_data')
        RemoveData('user_data_2')
        store.dispatch(logout());
        // Qo'shimcha storage keylarni ham o'chirish kerak bo'lsa shu yerga qo'shing

        return true;
    } catch (error) {
        console.error('Logout error:', error);
        return false;
    }
};