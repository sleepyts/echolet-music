import type { FC } from "react";
import type { Song } from "../../api/track/SongDetailResponse";
import { Box, ToggleButton, Typography } from "@mui/material";
import { getTransformScaleStyles } from "../../css/CommonStyle";
import { useMusicStore } from "../../store/MusicStore";
import { LazyAvatar } from "../../views/PlaylistView";
import ArtistLink from "../artist-link";

interface ShortSongCardProps {
  /* 歌曲信息  */
  song: Song;
  /**点击后切换到播放列表 */
  musicIds?: number[];
}

const ShortSongCard: FC<ShortSongCardProps> = ({ song, musicIds }) => {
  const currentMusicData = useMusicStore((state) => state.currentMusicData);
  const setCurrentMusicIds = useMusicStore((state) => state.setCurrentMusicIds);
  const setCurrentMusicData = useMusicStore(
    (state) => state.setCurrentMusicData,
  );
  const start = useMusicStore((state) => state.start);
  return (
    <>
      <ToggleButton
        value={song.id}
        title={song.name}
        sx={[
          {
            p: 1.1,
            border: "none",
            width: "100%",
          },
          getTransformScaleStyles(0.97, 0.15),
        ]}
        selected={currentMusicData?.id === song.id}
        onDoubleClick={async () => {
          musicIds && setCurrentMusicIds(musicIds);
          setCurrentMusicData(song);
          start();
        }}
      >
        <LazyAvatar src={song.al.picUrl} />
        <Box sx={{ width: "100%", ml: 2 }}>
          <Typography
            className="scroll-text"
            fontSize="0.8rem"
            fontWeight="bold"
            color="textPrimary"
            textTransform="capitalize"
            align="left"
            sx={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              width: "10rem",
            }}
          >
            {song.name}
          </Typography>
          <ArtistLink artists={song.ar} />
        </Box>
      </ToggleButton>
    </>
  );
};

export default ShortSongCard;
