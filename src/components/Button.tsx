import React from 'react';
import {
  TouchableOpacity,
  TouchableOpacityProps,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
} from 'react-native';
import { colors } from '../theme';
import { Text } from './Text';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  loading = false,
  style,
  disabled,
  ...props
}) => {
  const getStyles = () => {
    const base: ViewStyle = styles.base;
    if (variant === 'primary') return [base, styles.primary, disabled && styles.disabled];
    if (variant === 'secondary') return [base, styles.secondary, disabled && styles.disabled];
    if (variant === 'outline') return [base, styles.outline, disabled && styles.disabled];
    if (variant === 'ghost') return [base, styles.ghost, disabled && styles.disabled];
    return base;
  };

  const getTextColor = () => {
    if (variant === 'primary') return 'onPrimary';
    if (variant === 'secondary') return 'onSurfaceVariant';
    if (variant === 'outline') return 'primary';
    if (variant === 'ghost') return 'primary';
    return 'onPrimary';
  };

  return (
    <TouchableOpacity
      style={[getStyles(), style]}
      disabled={disabled || loading}
      activeOpacity={0.7}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? colors.onPrimary : colors.primary} />
      ) : (
        <Text variant="labelLarge" color={getTextColor()}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  primary: {
    backgroundColor: colors.primary,
  },
  secondary: {
    backgroundColor: colors.surfaceContainerHighest,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.outlineVariant,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  disabled: {
    opacity: 0.5,
  },
});
