import {
  Avatar,
  Box,
  Drawer,
  List,
  ListItem,
  ToggleButton,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { getUserPlaylistInfo } from "../api/playlist/playListApis.ts";
import type { Playlist } from "../api/playlist/PlaylistInfoResponse.ts";
import { useMusicStore } from "../store/MusicStore.ts";
import { useNavigate } from "react-router-dom";
import { t } from "i18next";
import RoundedIconButton from "./RoundedIconButton.tsx";
import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";
import { getTransformScaleStyles } from "../css/CommonStyle.ts";
import { useUserStore } from "../store/UserStore.ts";

export const drawerWidth = 240;
export const collapsedWidth = 60;

interface LeftDrawerProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function LeftDrawer({ open, setOpen }: LeftDrawerProps) {
  const navigate = useNavigate();
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const currentPlaylistId = useMusicStore((state) => state.currentPlaylistId);
  const setCurrentPlaylistId = useMusicStore(
    (state) => state.setCurrentPlaylistId
  );
  const userProfile = useUserStore((state) => state.userProfile);
  const isLoggedIn = useUserStore((state) => state.isLoggedIn);
  useEffect(() => {
    if (isLoggedIn) {
      getUserPlaylistInfo(userProfile?.userId || 0).then((res) => {
        setPlaylists(res.playlist);
      });
    }
  }, [isLoggedIn]);
  return (
    <Drawer
      open={open}
      variant={"permanent"}
      PaperProps={{
        sx: {
          width: open ? drawerWidth : collapsedWidth,
          overflowX: "hidden",
          p: 1,
        },
      }}
    >
      <Box
        height={"5rem"}
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          gap: 2,
        }}
      >
        <img src={"/icon.webp"} alt={"icon"} width={"30px"} />
        {open && <Typography variant={"h6"}>Echolet Music</Typography>}
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", p: 0.5 }}>
        <RoundedIconButton
          icon={!open ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
          onClick={() => setOpen(!open)}
        />

        <Typography
          variant="body1"
          sx={{
            ml: 3,
            opacity: open ? 1 : 0,
            transition: "opacity 0.3s ease",
            width: open ? "auto" : 0,
            overflow: "hidden",
            whiteSpace: "nowrap",
          }}
        >
          {t("playlists")}
        </Typography>
      </Box>
      <List
        sx={{
          mt: 2,
          overflow: "hidden",
          transition: "opacity 0.3s ease",
        }}
      >
        {isLoggedIn ? (
          playlists.map((playlist) => (
            <ListItem key={playlist.id} sx={{ p: 0 }} title={playlist.name}>
              <ToggleButton
                sx={[
                  {
                    p: 0.5,
                    width: "100%",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    border: "none",
                    "&.Mui-selected": {},
                  },
                  getTransformScaleStyles(0.99, 0.1),
                ]}
                value={playlist.id}
                selected={currentPlaylistId === playlist.id}
                onClick={() => {
                  setCurrentPlaylistId(playlist.id);
                  navigate("/playlist/" + playlist.id);
                }}
              >
                <Avatar
                  src={playlist.coverImgUrl}
                  variant={"rounded"}
                  sx={{ width: "2rem", height: "2rem" }}
                />
                {open && (
                  <Typography
                    fontSize={"0.8rem"}
                    color={"textPrimary"}
                    textTransform={"none"}
                    ml={1}
                    noWrap={true}
                  >
                    {playlist.name}
                  </Typography>
                )}
              </ToggleButton>
            </ListItem>
          ))
        ) : (
          <Box
            alignItems={"center"}
            justifyContent={"center"}
            sx={{
              height: "100%",
              display: "flex",
              width: "100%",
              textAlign: "center",
            }}
          >
            {t("login-to-get-playlist")}
          </Box>
        )}
      </List>
    </Drawer>
  );
}
