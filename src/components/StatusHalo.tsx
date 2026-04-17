import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../theme';

interface StatusHaloProps {
  type: 'lost' | 'found';
  size?: number;
  style?: ViewStyle;
  children: React.ReactNode;
}

export const StatusHalo: React.FC<StatusHaloProps> = ({
  type,
  size = 120,
  style,
  children,
}) => {
  const haloColor = type === 'lost' ? colors.secondary : colors.tertiary;

  return (
    <View style={[styles.container, style]}>
      <View
        style={[
          styles.halo,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: haloColor,
            opacity: 0.15,
          },
        ]}
      />
      <View style={styles.content}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  halo: {
    position: 'absolute',
  },
  content: {
    zIndex: 1,
  },
});
