import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';


export type RootStackParamList = {
    login: undefined;
    // Home: undefined;
    new_password: undefined,
    register: undefined,
    forgot_sms_pagepassword: undefined,
    register_second: undefined
};

export type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'login'>;
// export type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;
export type PasswordChengScreenNavigationProp = StackNavigationProp<RootStackParamList, 'new_password'>;
export type RegisterScreenNavigationProp = StackNavigationProp<RootStackParamList, 'register'>;
export type SmsPagePasswordScreenNavigationProp = StackNavigationProp<RootStackParamList, 'forgot_sms_pagepassword'>;
export type RegisterSecondPropsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'register_second'>;


export type LoginType = NativeStackScreenProps<RootStackParamList, 'login'>;
// export type HomeType = NativeStackScreenProps<RootStackParamList, 'Home'>;
export type PasswordChengType = NativeStackScreenProps<RootStackParamList, 'new_password'>;
export type RegisterType = NativeStackScreenProps<RootStackParamList, 'register'>;
export type SmsPagePasswordType = NativeStackScreenProps<RootStackParamList, 'forgot_sms_pagepassword'>;
export type RegisterSecondType = NativeStackScreenProps<RootStackParamList, 'register_second'>;

export type LoginScreenRouteProp = RouteProp<RootStackParamList, 'login'>;
// export type HomeScreenRouteProp = RouteProp<RootStackParamList, 'Home'>;
export type PasswordChengScreenRouteProp = RouteProp<RootStackParamList, 'new_password'>;
export type RegisterScreenRouteProp = RouteProp<RootStackParamList, 'register'>;
export type SmsPagePasswordScreenRouteProp = RouteProp<RootStackParamList, 'forgot_sms_pagepassword'>;
export type RegisterSecondScreenRouteProp = RouteProp<RootStackParamList, 'register_second'>;

export interface LoginProps {
    navigation: LoginScreenNavigationProp;
    route: LoginScreenRouteProp;
}

// export interface HomeProps {
//     navigation: HomeScreenNavigationProp;
//     route: HomeScreenRouteProp;
// }

export interface NewPasswordProps {
    navigation: PasswordChengScreenNavigationProp;
    route: PasswordChengScreenRouteProp;
}

export interface RegisterProps {
    navigation: RegisterScreenNavigationProp;
    route: RegisterScreenRouteProp;
}

export interface SmsPagePasswordProps {
    navigation: SmsPagePasswordScreenNavigationProp;
    route: SmsPagePasswordScreenRouteProp;
}

export interface RegisterSecondProps {
    navigation: RegisterSecondPropsScreenNavigationProp;
    route: RegisterSecondScreenRouteProp;
}
