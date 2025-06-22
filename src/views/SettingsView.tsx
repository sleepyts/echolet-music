import {Box, Select, MenuItem, Typography} from "@mui/material";
import {t} from "i18next";
import {useSettingsStore} from "../store/SettingsStore.ts";

export function SettingsView() {
    const language = useSettingsStore(state => state.language);
    const setLanguage = useSettingsStore(state => state.setLanguage);
    return (
        <Box
            width="50%"
            sx={{
                margin: "0 auto",  // 关键，水平居中
            }}
        >
            <Box
                display="flex"
                flexDirection="row"
                alignItems="center"
                width="100%"
                justifyContent="space-between"
            >
                <Typography variant="body1" sx={{mr: 2}}>
                    {t("language")}
                </Typography>
                <Select variant="standard" value={language} onChange={e => {
                    setLanguage(e.target.value)
                }}>
                    <MenuItem value="zh-CN">{t('zh-CN')}</MenuItem>
                    <MenuItem value="zh-TW">{t("zh-TW")}</MenuItem>
                    <MenuItem value="en-US">{t("en-US")}</MenuItem>
                </Select>
            </Box>
        </Box>
    );
}
