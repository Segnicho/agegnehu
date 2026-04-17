import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'lowest' | 'low' | 'medium' | 'high' | 'highest';
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  variant = 'lowest',
}) => {
  const getBackgroundColor = () => {
    switch (variant) {
      case 'lowest':
        return colors.surfaceContainerLowest;
      case 'low':
        return colors.surfaceContainerLow;
      case 'medium':
        return colors.surfaceContainerMedium;
      case 'high':
        return colors.surfaceContainerHigh;
      case 'highest':
        return colors.surfaceContainerHighest;
      default:
        return colors.surfaceContainerLowest;
    }
  };

  return (
    <View style={[styles.card, { backgroundColor: getBackgroundColor() }, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    padding: 16,
    // Note: No borders or shadows as per DESIGN.md ("tonal depth over borders")
  },
});
