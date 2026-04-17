import React from 'react';
import {
  View,
  TextInput as RNTextInput,
  TextInputProps as RNTextInputProps,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { colors, typography } from '../theme';
import { Text } from './Text';

interface InputProps extends RNTextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  containerStyle,
  style,
  ...props
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text variant="labelMedium" color="onSurfaceVariant" style={styles.label}>
          {label}
        </Text>
      ) as any}
      <RNTextInput
        style={[
          styles.input,
          error ? styles.inputError : null,
          style,
        ]}
        placeholderTextColor={colors.outline}
        {...props}
      />
      {error && (
        <Text variant="bodySmall" color="error" style={styles.error}>
          {error}
        </Text>
      ) as any}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
    ...typography.bodyLarge,
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: 12,
    height: 56,
    paddingHorizontal: 16,
    color: colors.onSurface,
  },
  inputError: {
    borderWidth: 1,
    borderColor: colors.error,
  },
  error: {
    marginTop: 4,
    marginLeft: 4,
  },
});
