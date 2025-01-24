import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Platform, useColorScheme } from 'react-native';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const COLORS = {
  light: {
    background: 'hsl(0 0% 100%)',
    foreground: 'hsl(240 10% 3.9%)',
    card: 'hsl(0 0% 100%)',
    'card-foreground': 'hsl(240 10% 3.9%)',
    popover: 'hsl(0 0% 100%)',
    'popover-foreground': 'hsl(240 10% 3.9%)',
    primary: 'hsl(142.1 76.2% 36.3%)',
    'primary-foreground': 'hsl(355.7 100% 97.3%)',
    secondary: 'hsl(240 4.8% 95.9%)',
    'secondary-foreground': 'hsl(240 5.9% 10%)',
    muted: 'hsl(240 4.8% 95.9%)',
    'muted-foreground': 'hsl(240 3.8% 46.1%)',
    accent: 'hsl(240 4.8% 95.9%)',
    'accent-foreground': 'hsl(240 5.9% 10%)',
    destructive: 'hsl(0 84.2% 60.2%)',
    'destructive-foreground': 'hsl(0 0% 98%)',
    border: 'hsl(240 5.9% 90%)',
    input: 'hsl(240 5.9% 90%)',
    ring: 'hsl(142.1 76.2% 36.3%)',
  },
  dark: {
    background: 'hsl(20 14.3% 4.1%)',
    foreground: 'hsl(0 0% 95%)',
    card: 'hsl(24 9.8% 10%)',
    'card-foreground': 'hsl(0 0% 95%)',
    popover: 'hsl(0 0% 9%)',
    'popover-foreground': 'hsl(0 0% 95%)',
    primary: 'hsl(142.1 70.6% 45.3%)',
    'primary-foreground': 'hsl(144.9 80.4% 10%)',
    secondary: 'hsl(240 3.7% 15.9%)',
    'secondary-foreground': 'hsl(0 0% 98%)',
    muted: 'hsl(0 0% 15%)',
    'muted-foreground': 'hsl(240 5% 64.9%)',
    accent: 'hsl(12 6.5% 15.1%)',
    'accent-foreground': 'hsl(0 0% 98%)',
    destructive: 'hsl(0 62.8% 30.6%)',
    'destructive-foreground': 'hsl(0 85.7% 97.3%)',
    border: 'hsl(240 3.7% 15.9%)',
    input: 'hsl(240 3.7% 15.9%)',
    ring: 'hsl(142.4 71.8% 29.2%)',
  },
} as const;

export const getMemoizedColor = (colorScheme: 'light' | 'dark') => {
  return (variable: keyof typeof COLORS.light) => {
    return COLORS[colorScheme][variable] || variable;
  };
};

export function getColor(variable: keyof typeof COLORS.light) {
  const colorScheme = useColorScheme();
  const isDarkColorScheme = colorScheme === 'dark';

  return COLORS[isDarkColorScheme ? 'dark' : 'light'][variable] || variable;
}

export function getStaticColor(variable: keyof typeof COLORS.light, isDark: boolean) {
  return COLORS[isDark ? 'dark' : 'light'][variable] || variable;
}
