const palette = {
  primary: '#004cc3',
  primaryContainer: '#d7e2ff',
  onPrimary: '#ffffff',
  secondary: '#a83900', // Lost
  secondaryContainer: '#ffdbcc',
  onSecondary: '#ffffff',
  tertiary: '#0d631b', // Found
  tertiaryContainer: '#d0ffd3',
  onTertiary: '#ffffff',
  error: '#ba1a1a',
  background: '#fdfbff',
  onBackground: '#1a1b1f',
  surface: '#fdfbff',
  onSurface: '#1a1b1f',
  surfaceVariant: '#e1e2ec',
  onSurfaceVariant: '#44474f',
  surfaceContainerLowest: '#ffffff',
  surfaceContainerLow: '#f7f3f9',
  surfaceContainerMedium: '#f2edf3',
  surfaceContainerHigh: '#ece7ed',
  surfaceContainerHighest: '#e6e1e7',
  outline: '#74777f',
  outlineVariant: '#c4c6d0',
};

export const colors = {
  ...palette,
  lost: palette.secondary,
  found: palette.tertiary,
  lostContainer: palette.secondaryContainer,
  foundContainer: palette.tertiaryContainer,
};
