import { Box, Link, ToggleButton, Typography } from "@mui/material";
import type { FC } from "react";
import { LazyAvatar } from "../../views/PlaylistView";
import { fromMsToTime } from "../../utils/MusicDataUtil";
import type { Song } from "../../api/track/SongDetailResponse";
import { useMusicStore } from "../../store/MusicStore";
import { useNavigate } from "react-router-dom";
import ArtistLink from "../artist-link";

interface LongSongCardProps {
  song: Song;
  // 所有歌曲的ref 用于定位跳转
  songRefs?: React.RefObject<Record<number, HTMLButtonElement | null>>;
  musicIds?: number[];
  withAvatar?: boolean;
}

const LongSongCard: FC<LongSongCardProps> = ({
  song,
  songRefs,
  musicIds,
  withAvatar = true,
}) => {
  const currentMusicData = useMusicStore((state) => state.currentMusicData);
  const setCurrentMusicIds = useMusicStore((state) => state.setCurrentMusicIds);
  const setCurrentMusicData = useMusicStore(
    (state) => state.setCurrentMusicData,
  );
  const start = useMusicStore((state) => state.start);

  const songAlis = "( " + song.alia.join(" / ") + " )";
  const navigate = useNavigate();
  return (
    <>
      <ToggleButton
        value={song.id}
        key={song.id}
        ref={(el) => {
          if (songRefs) songRefs.current[song.id] = el;
        }}
        sx={[
          {
            border: "none",
            justifyContent: "start",
            display: "flex",
          },
        ]}
        size={"small"}
        selected={currentMusicData?.id === song.id}
        onDoubleClick={async () => {
          musicIds && setCurrentMusicIds(musicIds);
          setCurrentMusicData(song);
          start();
        }}
      >
        {withAvatar && <LazyAvatar src={song.al.picUrl} />}
        <Box
          sx={{
            flex: 2,
            display: "flex",
            flexDirection: "column",
            alignsongs: "flex-start",
            ml: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignsongs: "center",
              gap: 2,
            }}
          >
            <Typography
              fontWeight="bold"
              color={"textPrimary"}
              noWrap
              textTransform="capitalize"
            >
              {song.name}
            </Typography>
            {song.alia && song.alia.length > 0 && (
              <Typography variant="body2" color="text.secondary" noWrap>
                {songAlis}
              </Typography>
            )}
          </Box>
          <ArtistLink artists={song.ar} />
        </Box>
        <Box
          sx={{
            alignsongs: "flex-start",
            justifyContent: "flex-start",
            flex: 1.5,
          }}
        >
          <Typography
            variant="body2"
            color="textPrimary"
            noWrap
            textTransform="capitalize"
          >
            <Link
              underline="hover"
              color="textPrimary"
              variant="caption"
              onClick={() => {
                navigate("/album/" + song.al.id);
              }}
            >
              {song.al.name}
            </Link>
          </Typography>
        </Box>
        <Box
          sx={{
            textAlign: "right",
            width: "100%",
            alignsongs: "center",
            flex: 1,
          }}
        >
          <Typography variant="body2" color="textPrimary" noWrap>
            {fromMsToTime(song.dt)}
          </Typography>
        </Box>
      </ToggleButton>
    </>
  );
};
export default LongSongCard;
