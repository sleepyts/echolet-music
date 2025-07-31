import { Box, Grid, IconButton, Link, Typography } from "@mui/material";
import { LazyAvatar } from "../views/PlaylistView";
import { PlayArrow } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import type { Playlist } from "../api/playlist/PlaylistInfoResponse";
import type { SearchPlaylist } from "../api/search/SearchModel.ts";
import { getPlaylistDetail } from "../api/playlist/playListApis.ts";
import { getSongDetail } from "../api/track/songApis.ts";
import { useMusicStore } from "../store/MusicStore.ts";
import type { RecommendPlaylist } from "../api/user/RecommendPlaylistModel.ts";

interface RoundedPlaylistProps {
  playlists: Playlist[] | SearchPlaylist[] | RecommendPlaylist[] | undefined;
}

export function RoundedPlaylist({ playlists }: RoundedPlaylistProps) {
  const setCurrentMusicData = useMusicStore(
    (state) => state.setCurrentMusicData
  );
  const setCurrentMusicIds = useMusicStore((state) => state.setCurrentMusicIds);
  const start = useMusicStore((state) => state.start);

  const navigate = useNavigate();
  return (
    <>
      <Grid container spacing={6}>
        {playlists &&
          playlists.map((playlist) => {
            return (
              <>
                <Grid key={playlist.id} component={"div"}>
                  <Box>
                    <Box
                      sx={(theme) => ({
                        position: "relative", // 关键！让播放按钮定位生效
                        borderRadius: 2,
                        overflow: "hidden",
                        transition: "all 0.3s",
                        backgroundColor:
                          theme.palette.mode === "dark"
                            ? theme.palette.grey[800]
                            : theme.palette.grey[100],
                        boxShadow:
                          theme.palette.mode === "dark"
                            ? "0 0 18px rgba(255,255,255,0.1)"
                            : "0 6px 24px rgba(0,0,0,0.15)",

                        "&:hover": {
                          boxShadow:
                            theme.palette.mode === "dark"
                              ? "0 0 32px rgba(255,255,255,0.2)"
                              : "0 12px 36px rgba(0,0,0,0.25)",
                          cursor: "pointer",

                          // 播放按钮显现
                          "& .hover-play-button": {
                            opacity: 1,
                            transform: "translate(-50%, -50%) scale(1)",
                          },
                        },
                      })}
                    >
                      {/* 图片组件 */}
                      <Box
                        display={"flex"}
                        justifyContent={"center"}
                        alignItems={"center"}
                        onClick={() => {
                          navigate(`/playlist/${playlist.id}`);
                        }}
                      >
                        <LazyAvatar
                          src={
                            ("coverImgUrl" in playlist &&
                              playlist.coverImgUrl) ||
                            ("picUrl" in playlist && playlist.picUrl) ||
                            ""
                          }
                          size={"12rem"}
                        />
                      </Box>

                      {/* 播放按钮 */}
                      <IconButton
                        className="hover-play-button"
                        sx={{
                          position: "absolute",
                          top: "50%",
                          left: "50%",
                          transform: "translate(-50%, -50%) scale(0.9)",
                          opacity: 0,
                          color: "#fff",
                          backgroundColor: "rgba(122,119,119,0.6)",
                          transition: "all 0.3s ease",
                          zIndex: 2,
                          "&:hover": {
                            backgroundColor: "rgba(45,44,44,0.8)",
                          },
                        }}
                        onClick={async () => {
                          const res = await getPlaylistDetail(playlist.id);
                          setCurrentMusicIds(
                            res.playlist.trackIds.map((item) => item.id)
                          );

                          const songRes = await getSongDetail([
                            res.playlist.trackIds[0].id,
                          ]);
                          setCurrentMusicData(songRes.songs[0]);
                          start();
                        }}
                      >
                        <PlayArrow fontSize="large" />
                      </IconButton>
                    </Box>

                    <Box
                      sx={{
                        mt: 2,
                        width: "12rem",
                      }}
                    >
                      <Typography
                        variant="subtitle2"
                        fontWeight="bold"
                        sx={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        <Link
                          underline="hover"
                          color="textPrimary"
                          sx={{
                            "&:hover": { cursor: "pointer" },
                          }}
                          onClick={() => {
                            navigate(`/playlist/${playlist.id}`);
                          }}
                        >
                          {playlist.name}
                        </Link>
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </>
            );
          })}
      </Grid>
    </>
  );
}
