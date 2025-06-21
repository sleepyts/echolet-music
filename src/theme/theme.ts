// theme.ts
import {createTheme} from '@mui/material/styles';

const lightTheme = createTheme({
    palette: {
        mode: 'light',
    },
    typography: {
        fontFamily: `'Noto Sans SC','Poppins' , sans-serif`,
    },
});

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
    typography: {
        fontFamily: `'Noto Sans SC','Poppins' , sans-serif`,
    },
});

export default {
    light: lightTheme,
    dark: darkTheme,
};
export {lightTheme, darkTheme};