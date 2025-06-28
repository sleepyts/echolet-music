import { Avatar, Box, Button, Stack } from "@mui/material";
import {
  DarkModeOutlined,
  GitHub,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  LightModeOutlined,
  Login,
  Logout,
  SettingsOutlined,
} from "@mui/icons-material";
import { t } from "i18next";
import { darkTheme, lightTheme } from "../theme/theme.ts";
import RoundedIconButton from "./RoundedIconButton.tsx";
import { useUserStore } from "../store/UserStore.ts";
import { useNavigate } from "react-router-dom";
import { useNavigationStack } from "../hooks/NavigationHook.ts";
import { Search } from "./Search.tsx";
import { useState } from "react";

export function Header({ theme, setTheme }: any) {
  const userProfile = useUserStore((state) => state.userProfile);
  const isLoggedIn = useUserStore((state) => state.isLoggedIn);
  const logout = useUserStore((state) => state.logout);
  const navigate = useNavigate();
  const { goBack, goForward, canGoBack, canGoForward } = useNavigationStack();
  const [search, setSearch] = useState<string>("");
  return (
    <Box
      display={"flex"}
      p={4}
      height={"5rem"}
      position={"sticky"}
      top={0}
      zIndex={1000}
      alignItems={"center"}
      sx={{ backgroundColor: "background.default" }}
    >
      <Box display="flex" gap={2} flex={1}>
        <RoundedIconButton
          icon={<KeyboardArrowLeft />}
          onClick={goBack}
          showBorder={canGoBack}
        />
        <RoundedIconButton
          icon={<KeyboardArrowRight />}
          onClick={goForward}
          showBorder={canGoForward}
        />
        <Search
          setInput={setSearch}
          handleSearch={() => navigate(`/search/${search}`)}
        />
      </Box>
      <Stack
        spacing={2}
        direction={"row"}
        sx={{
          position: "absolute",
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        <Button
          variant={"outlined"}
          color="inherit"
          size={"small"}
          onClick={() => navigate("/")}
        >
          {t("home")}
        </Button>
      </Stack>

      <Stack
        spacing={1}
        direction={"row"}
        justifyContent={"flex-end"}
        alignItems={"center"}
        flex={1}
      >
        {isLoggedIn ? (
          <>
            <Avatar
              src={userProfile?.avatarUrl}
              sx={{ width: 30, height: 30 }}
            />
          </>
        ) : (
          <>
            <RoundedIconButton
              icon={<Login />}
              title={t("login")}
              onClick={() => navigate("/login")}
            />
          </>
        )}
        {isLoggedIn && (
          <>
            <RoundedIconButton
              icon={<Logout />}
              onClick={() => logout()}
              title={t("logout")}
            />
          </>
        )}
        <RoundedIconButton
          title={theme == lightTheme ? t("dark-mode") : t("light-mode")}
          icon={
            theme == lightTheme ? <DarkModeOutlined /> : <LightModeOutlined />
          }
          onClick={() => {
            setTheme(theme == lightTheme ? darkTheme : lightTheme);
          }}
        />
        <RoundedIconButton
          icon={<SettingsOutlined />}
          onClick={() => navigate("/settings")}
        />
        <RoundedIconButton
          icon={<GitHub />}
          onClick={() =>
            window.open("https://github.com/sleepyts/echolet-music")
          }
        />
      </Stack>
    </Box>
  );
}
