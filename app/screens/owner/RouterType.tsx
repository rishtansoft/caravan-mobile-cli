import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';


interface Location {
    id: string;
    status: string;
    load_id: string;
    latitude: string;
    longitude: string;
    order: number;
    start_time: string | null;
    end_time: string | null;
    location_name: string;
    createdAt: string;
    updatedAt: string;
    AssignmentId: string | null;
}

export type RootStackParamList = {
    home: undefined;
    active_loads: undefined,
    add_loads: undefined,
    add_load_second: undefined,
    add_load_third: undefined,
    history: undefined,
    main_phone_update: undefined,
    main_phone_update_sms_code: undefined,
    profile: undefined,
    profile_update: undefined,
    contact_admin: undefined,
    terms_condition: undefined,
    active_loads_detail: { itemId: string },
    active_loads_map: { itemId: string, data: Location[] | null },
    history_detail: { itemId: string },
    history_detail_map: { itemId: string },


};

export type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'home'>;
export type ActiveLoadsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'active_loads'>;
export type HistoryScreenNavigationProp = StackNavigationProp<RootStackParamList, 'history'>;
export type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'profile'>;
export type ContactAdminScreenNavigationProp = StackNavigationProp<RootStackParamList, 'contact_admin'>;
export type ActiveLoadsDetailScreenNavigationProp = StackNavigationProp<RootStackParamList, 'active_loads_detail'>;
export type HistoryDetailScreenNavigationProp = StackNavigationProp<RootStackParamList, 'history_detail'>;
export type TermsConditionScreenNavigationProp = StackNavigationProp<RootStackParamList, 'terms_condition'>;
export type ProfileDataUpdateScreenNavigationProp = StackNavigationProp<RootStackParamList, 'profile_update'>;
export type ActiveLoadsDetailMapScreenNavigationProp = StackNavigationProp<RootStackParamList, 'active_loads_map'>;
export type AddLoadsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'add_loads'>;
export type AddLoadSecondScreenNavigationProp = StackNavigationProp<RootStackParamList, 'add_load_second'>;
export type AddLoadThirdScreenNavigationProp = StackNavigationProp<RootStackParamList, 'add_load_third'>;
export type MainPhoneUpdateScreenNavigationProp = StackNavigationProp<RootStackParamList, 'main_phone_update'>;
export type MainPhoneUpdateSmcCodeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'main_phone_update_sms_code'>;
export type HistoryDetailMapCodeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'history_detail_map'>;

export type HomeType = NativeStackScreenProps<RootStackParamList, 'home'>;
export type ActiveLoadsType = NativeStackScreenProps<RootStackParamList, 'active_loads'>;
export type HistoryType = NativeStackScreenProps<RootStackParamList, 'history'>;
export type ProfileType = NativeStackScreenProps<RootStackParamList, 'profile'>;
export type ContactAdminType = NativeStackScreenProps<RootStackParamList, 'contact_admin'>;
export type ActiveLoadsDetailType = NativeStackScreenProps<RootStackParamList, 'active_loads_detail'>;
export type HistoryDetailType = NativeStackScreenProps<RootStackParamList, 'history_detail'>;
export type TermsConditionType = NativeStackScreenProps<RootStackParamList, 'terms_condition'>;
export type ProfileDataUpdateType = NativeStackScreenProps<RootStackParamList, 'profile_update'>;
export type ActiveLoadsDetailMapType = NativeStackScreenProps<RootStackParamList, 'active_loads_map'>;
export type AddLoadsType = NativeStackScreenProps<RootStackParamList, 'add_loads'>;
export type AddLoadSecondType = NativeStackScreenProps<RootStackParamList, 'add_load_second'>;
export type AddLoadThirdType = NativeStackScreenProps<RootStackParamList, 'add_load_third'>;
export type MainPhoneUpdateType = NativeStackScreenProps<RootStackParamList, 'main_phone_update'>;
export type MainPhoneUpdateSmcCodeType = NativeStackScreenProps<RootStackParamList, 'main_phone_update_sms_code'>;
export type HistoryDetailMapCodeType = NativeStackScreenProps<RootStackParamList, 'history_detail_map'>;

export type HomeRouteProp = RouteProp<RootStackParamList, 'home'>;
export type ActiveLoadsRouteProp = RouteProp<RootStackParamList, 'active_loads'>;
export type HistoryRouteProp = RouteProp<RootStackParamList, 'history'>;
export type ProfileRouteProp = RouteProp<RootStackParamList, 'profile'>;
export type ContactAdminRouteProp = RouteProp<RootStackParamList, 'contact_admin'>;
export type ActiveLoadsDetailRouteProp = RouteProp<RootStackParamList, 'active_loads_detail'>;
export type HistoryDetailRouteProp = RouteProp<RootStackParamList, 'history_detail'>;
export type TermsConditionRouteProp = RouteProp<RootStackParamList, 'terms_condition'>;
export type ProfileDataUpdateRouteProp = RouteProp<RootStackParamList, 'profile_update'>;
export type ActiveLoadsDetailMapRouteProp = RouteProp<RootStackParamList, 'active_loads_map'>;
export type AddLoadsRouteProp = RouteProp<RootStackParamList, 'add_loads'>;
export type AddLoadSecondRouteProp = RouteProp<RootStackParamList, 'add_load_second'>;
export type AddLoadThirdRouteProp = RouteProp<RootStackParamList, 'add_load_third'>;
export type MainPhoneUpdateRouteProp = RouteProp<RootStackParamList, 'main_phone_update'>;
export type MainPhoneUpdateSmcCodeRouteProp = RouteProp<RootStackParamList, 'main_phone_update_sms_code'>;
export type HistoryDetailMapCodeRouteProp = RouteProp<RootStackParamList, 'history_detail_map'>;


export interface AddLoadsProps {
    navigation: AddLoadsScreenNavigationProp;
    route: AddLoadsRouteProp;
}

export interface HistoryDetailMapProps {
    navigation: HistoryDetailMapCodeScreenNavigationProp;
    route: HistoryDetailMapCodeRouteProp;
}

export interface MainPhoneUpdateProps {
    navigation: MainPhoneUpdateScreenNavigationProp;
    route: MainPhoneUpdateRouteProp;
}

export interface MainPhoneUpdateSmcCodeProps {
    navigation: MainPhoneUpdateSmcCodeScreenNavigationProp;
    route: MainPhoneUpdateSmcCodeRouteProp;
}



export interface AddLoadSecondProps {
    navigation: AddLoadSecondScreenNavigationProp;
    route: AddLoadSecondRouteProp;
}

export interface AddLoadThirdProps {
    navigation: AddLoadThirdScreenNavigationProp;
    route: AddLoadThirdRouteProp;
}



export interface HomeProps {
    navigation: HomeScreenNavigationProp;
    route: HomeRouteProp;
}

export interface ProfileDataUpdateProps {
    navigation: ProfileDataUpdateScreenNavigationProp;
    route: ProfileDataUpdateRouteProp;
}

export interface ActiveLoadsProps {
    navigation: ActiveLoadsScreenNavigationProp;
    route: ActiveLoadsRouteProp;
}

export interface TermsConditionProps {
    navigation: TermsConditionScreenNavigationProp;
    route: TermsConditionRouteProp;
}

export interface ActiveLoadsDetailProps {
    navigation: ActiveLoadsDetailScreenNavigationProp;
    route: ActiveLoadsDetailRouteProp;
}

export interface ActiveLoadsDetailMapProps {
    navigation: ActiveLoadsDetailMapScreenNavigationProp;
    route: ActiveLoadsDetailMapRouteProp;
}

export interface HistoryProps {
    navigation: HistoryScreenNavigationProp;
    route: HistoryRouteProp;
}

export interface HistoryDetailProps {
    navigation: HistoryDetailScreenNavigationProp;
    route: HistoryDetailRouteProp;
}

export interface ProfileProps {
    navigation: ProfileScreenNavigationProp;
    route: ProfileRouteProp;
}

export interface ContactAdminProps {
    navigation: ContactAdminScreenNavigationProp;
    route: ContactAdminRouteProp;
}
