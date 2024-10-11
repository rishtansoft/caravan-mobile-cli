import { StackNavigationProp, } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';


export type RootStackParamList = {
    Login: undefined;
    Home: undefined;
    PasswordCheng: undefined,
    Register: undefined,
    Smspagepassword: undefined,
    RegisterSecond: undefined
};

export type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;
export type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;
export type PasswordChengScreenNavigationProp = StackNavigationProp<RootStackParamList, 'PasswordCheng'>;
export type RegisterScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Register'>;
export type SmsPagePasswordScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Smspagepassword'>;
export type RegisterSecondPropsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'RegisterSecond'>;


export type LoginType = NativeStackScreenProps<RootStackParamList, 'Login'>;
export type HomeType = NativeStackScreenProps<RootStackParamList, 'Home'>;
export type PasswordChengType = NativeStackScreenProps<RootStackParamList, 'PasswordCheng'>;
export type RegisterType = NativeStackScreenProps<RootStackParamList, 'Register'>;
export type SmsPagePasswordType = NativeStackScreenProps<RootStackParamList, 'Smspagepassword'>;
export type RegisterSecondType = NativeStackScreenProps<RootStackParamList, 'RegisterSecond'>;

export type HomeScreenRouteProp = RouteProp<RootStackParamList, 'Home'>;
export type LoginScreenRouteProp = RouteProp<RootStackParamList, 'Login'>;
export type PasswordChengScreenRouteProp = RouteProp<RootStackParamList, 'PasswordCheng'>;
export type RegisterScreenRouteProp = RouteProp<RootStackParamList, 'Register'>;
export type SmsPagePasswordScreenRouteProp = RouteProp<RootStackParamList, 'Smspagepassword'>;
export type RegisterSecondScreenRouteProp = RouteProp<RootStackParamList, 'RegisterSecond'>;

export interface LoginProps {
    navigation: LoginScreenNavigationProp;
    route: LoginScreenRouteProp;
}

export interface HomeProps {
    navigation: HomeScreenNavigationProp;
    route: HomeScreenRouteProp;
}

export interface PasswordChengProps {
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



