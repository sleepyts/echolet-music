import { Box, Grid, Skeleton, ToggleButton, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import type { RecommendPlaylist } from "../api/user/RecommendPlaylistModel.ts";
import {
  getUserDailyRecommendSongs,
  getUserRecommendPlaylist,
} from "../api/user/userApis.ts";
import { LazyAvatar } from "./PlaylistView.tsx";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { t } from "i18next";
import { useMusicStore } from "../store/MusicStore.ts";
import type { Song } from "../api/track/SongDetailResponse.ts";
import { getTransformScaleStyles } from "../css/CommonStyle.ts";
import RoundedIconButton from "../components/RoundedIconButton.tsx";
import { RoundedPlaylist } from "../components/RoundedPlaylist.tsx";
import ShortSongCard from "../components/short-song-card/index.tsx";

export function HomeView() {
  return (
    <>
      <Box display={"flex"} flexDirection={"column"} gap={2}>
        <ForYou />
        <RecommendPlaylist />
      </Box>
    </>
  );
}

function RecommendPlaylist() {
  const [recommendPlaylist, setRecommendPlaylist] = useState<
    RecommendPlaylist[]
  >([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    getUserRecommendPlaylist()
      .then((res) => {
        setRecommendPlaylist(res.result);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);
  return (
    <>
      {loading ? (
        <></>
      ) : (
        <>
          <Typography variant="h4" fontWeight="bold" mb={2}>
            {t("recomment-playlist")}
          </Typography>
          <RoundedPlaylist playlists={recommendPlaylist} />
        </>
      )}
    </>
  );
}

function ForYou() {
  const [dailySongs, setDailySongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);
  useEffect(() => {
    setLoading(true);
    getUserDailyRecommendSongs()
      .then((res) => {
        setDailySongs(res.data.dailySongs);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);
  const displayedSongs = expanded ? dailySongs : dailySongs.slice(0, 10);
  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
          mt: 2,
          gap: 2,
        }}
      >
        <Typography variant="h4" fontWeight="bold">
          {t("daily-recommend-songs")}
        </Typography>
        {dailySongs.length > 10 && (
          <RoundedIconButton
            title={expanded ? t("unexpand") : t("show-more")}
            icon={expanded ? <ExpandLess /> : <ExpandMore />}
            onClick={() => setExpanded(!expanded)}
          ></RoundedIconButton>
        )}
      </Box>

      <Grid container spacing={4}>
        {loading
          ? Array.from({ length: 10 }).map((_, index) => (
              <Grid key={index} component="div">
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Skeleton
                    variant="rectangular"
                    width={"3rem"}
                    height={"3rem"}
                  />
                  <Box>
                    <Skeleton variant="text" width={100} height={20} />
                    <Skeleton variant="text" width={80} height={16} />
                  </Box>
                </Box>
              </Grid>
            ))
          : displayedSongs.map((song) => (
              <Grid key={song.id} component="div">
                <ShortSongCard
                  song={song}
                  musicIds={dailySongs.map((item) => item.id)}
                />
              </Grid>
            ))}
      </Grid>
    </>
  );
}
