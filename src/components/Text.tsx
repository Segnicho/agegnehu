import React from 'react';
import { Text as RNText, TextProps as RNTextProps, TextStyle } from 'react-native';
import { colors, typography } from '../theme';

interface TextProps extends RNTextProps {
  variant?: keyof typeof typography;
  color?: keyof typeof colors | string;
  align?: TextStyle['textAlign'];
}

export const Text: React.FC<TextProps> = ({
  variant = 'bodyLarge',
  color = 'onSurface',
  align,
  style,
  children,
  ...props
}) => {
  const textColor = (colors as any)[color] || color;
  const variantStyle = typography[variant];

  return (
    <RNText
      style={[
        variantStyle,
        { color: textColor, textAlign: align },
        style,
      ]}
      {...props}
    >
      {children}
    </RNText>
  );
};
