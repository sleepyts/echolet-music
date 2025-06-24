// theme.ts
import {createTheme} from '@mui/material/styles';

const lightTheme = createTheme({
    palette: {
        mode: 'light',
    },
    typography: {
        fontFamily: [
            '"Rubik"',
            '"Noto Sans SC"',
            'PingFang SC',          // macOS 中文默认
            'Microsoft YaHei',      // Windows 中文默认
            'sans-serif',
        ].join(',')
    },
});

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
    typography: {
        fontFamily: [
            '"Rubik"',
            '"Noto Sans SC"',
            'PingFang SC',          // macOS 中文默认
            'Microsoft YaHei',      // Windows 中文默认
            'sans-serif',
        ].join(',')
    },
});

export default {
    light: lightTheme,
    dark: darkTheme,
};
export {lightTheme, darkTheme};