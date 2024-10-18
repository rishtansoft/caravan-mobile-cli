import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';


export type RootStackParamList = {
    home: undefined;
    active_loads: undefined,
    history: undefined,
    profile: undefined,
};

export type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'home'>;
export type ActiveLoadsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'active_loads'>;
export type HistoryScreenNavigationProp = StackNavigationProp<RootStackParamList, 'history'>;
export type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'profile'>;

export type HomeType = NativeStackScreenProps<RootStackParamList, 'home'>;
export type ActiveLoadsType = NativeStackScreenProps<RootStackParamList, 'active_loads'>;
export type HistoryType = NativeStackScreenProps<RootStackParamList, 'history'>;
export type ProfileType = NativeStackScreenProps<RootStackParamList, 'profile'>;

export type HomeRouteProp = RouteProp<RootStackParamList, 'home'>;
export type ActiveLoadsRouteProp = RouteProp<RootStackParamList, 'active_loads'>;
export type HistoryRouteProp = RouteProp<RootStackParamList, 'history'>;
export type ProfileRouteProp = RouteProp<RootStackParamList, 'profile'>;

export interface HomeProps {
    navigation: HomeScreenNavigationProp;
    route: HomeRouteProp;
}

export interface ActiveLoadsProps {
    navigation: ActiveLoadsScreenNavigationProp;
    route: ActiveLoadsRouteProp;
}

export interface HistoryProps {
    navigation: HistoryScreenNavigationProp;
    route: HistoryRouteProp;
}
export interface ProfileProps {
    navigation: ProfileScreenNavigationProp;
    route: ProfileRouteProp;
}
