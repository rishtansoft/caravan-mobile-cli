declare module 'react-native-vector-icons/*' {
    import { FunctionComponent, SVGProps } from 'react';
    
    export interface IconProps {
      name: string;
      size?: number;
      color?: string;
      style?: object;
      // boshqa kerakli propslarni qo'shing
    }
  
    const Icon: FunctionComponent<IconProps>;
  
    export default Icon;
  }
  