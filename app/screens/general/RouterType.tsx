import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';


export type RootStackParamList = {
    login: undefined;
    home: undefined;
    new_password: undefined,
    register: undefined,
    forgot_sms_pagepassword: undefined,
    register_second: undefined,
    verify_sms_screen: undefined
};

export type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'login'>;
export type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'home'>;
export type PasswordChengScreenNavigationProp = StackNavigationProp<RootStackParamList, 'new_password'>;
export type RegisterScreenNavigationProp = StackNavigationProp<RootStackParamList, 'register'>;
export type SmsPagePasswordScreenNavigationProp = StackNavigationProp<RootStackParamList, 'forgot_sms_pagepassword'>;
export type RegisterSecondPropsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'register_second'>;
export type VerifySmsScreenPropsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'verify_sms_screen'>;


export type LoginType = NativeStackScreenProps<RootStackParamList, 'login'>;
export type HomeType = NativeStackScreenProps<RootStackParamList, 'home'>;
export type PasswordChengType = NativeStackScreenProps<RootStackParamList, 'new_password'>;
export type RegisterType = NativeStackScreenProps<RootStackParamList, 'register'>;
export type SmsPagePasswordType = NativeStackScreenProps<RootStackParamList, 'forgot_sms_pagepassword'>;
export type RegisterSecondType = NativeStackScreenProps<RootStackParamList, 'register_second'>;
export type VerifySmsScreenType = NativeStackScreenProps<RootStackParamList, 'verify_sms_screen'>;

export type LoginScreenRouteProp = RouteProp<RootStackParamList, 'login'>;
export type HomeScreenRouteProp = RouteProp<RootStackParamList, 'home'>;
export type PasswordChengScreenRouteProp = RouteProp<RootStackParamList, 'new_password'>;
export type RegisterScreenRouteProp = RouteProp<RootStackParamList, 'register'>;
export type SmsPagePasswordScreenRouteProp = RouteProp<RootStackParamList, 'forgot_sms_pagepassword'>;
export type RegisterSecondScreenRouteProp = RouteProp<RootStackParamList, 'register_second'>;
export type VerifySmsScreenScreenRouteProp = RouteProp<RootStackParamList, 'verify_sms_screen'>;

export interface LoginProps {
    navigation: LoginScreenNavigationProp;
    route: LoginScreenRouteProp;
}

export interface HomeProps {
    navigation: HomeScreenNavigationProp;
    route: HomeScreenRouteProp;
}

export interface VerifySmsScreenProps {
    navigation: VerifySmsScreenPropsScreenNavigationProp;
    route: VerifySmsScreenScreenRouteProp;
}

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
