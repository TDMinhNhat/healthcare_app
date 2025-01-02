import { DefaultTheme } from "@react-navigation/native";

// Tùy chỉnh theme
export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    main: {
      primary: "#432C81",
      secondary: "#57428f",
      tertiary: "#7b6ba9",
      quaternary: "#9f97be",
      quinary: "#c5c0d6",
    },
    alertStatus: {
      success: "#43A048",
      info: "#B8B8B8",
      warning: "#FB8A00",
      error: "#F44336",
    },
    textIcon: {
      contentPrimary: "#2B2B2B",
      contentSecondary: "#4F4F4F",
      contentTertiary: "#868686",
      contentDisabled: "#C8C8C8",
      contentOnColor: "#FFFFFF",
    },
    greyscale: {
      900: "#212121",
      800: "#424242",
      700: "#616161",
      600: "#757575",
      500: "#9E9E9E",
      400: "#BDBDBD",
      300: "#E0E0E0",
      200: "#EEEEEE",
      100: "#F5F5F5",
      50: "#FAFAFA",
    },
  },
};

// Định nghĩa type tùy chỉnh
export type CustomThemeType = typeof theme;

declare module "@react-navigation/native" {
  export function useTheme(): CustomThemeType;
}
