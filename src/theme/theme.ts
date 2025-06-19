// theme.ts
import {createTheme} from '@mui/material/styles';

const lightTheme = createTheme({
    palette: {
        mode: 'light',
    },
});
const darkTheme = createTheme({
    palette: {
        mode: 'dark', // 设置为暗色模式
    },
});

export { lightTheme, darkTheme };