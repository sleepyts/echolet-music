import { t } from "i18next";
import { useMusicStore } from "../store/MusicStore";
import {
  Avatar,
  Box,
  Link,
  Skeleton,
  Stack,
  ToggleButton,
  Typography,
} from "@mui/material";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { getPlaylistDetail } from "../api/playlist/playListApis.ts";
import type { PlaylistDetail } from "../api/playlist/PlayListDetailResponse.ts";
import type { Song } from "../api/track/SongDetailResponse.ts";
import { getSongDetail } from "../api/track/songApis.ts";
import { fromMsToTime, fromTimestampToTime } from "../utils/MusicDataUtil.ts";
import { useInView } from "react-intersection-observer";
import { Menu, MyLocation, PlayArrow } from "@mui/icons-material";
import RoundedIconButton from "../components/RoundedIconButton.tsx";
import { useNavigate, useParams } from "react-router-dom";
import { CustomDialog } from "../components/CustomDialog.tsx";
import { Search } from "../components/Search.tsx";
import LongSongCard from "../components/long-song-card/index.tsx";
import { it } from "node:test";

export function PlaylistView() {
  const currentPlaylistId = useParams().id;
  const [currentPlaylistDetail, setCurrentPlaylistDetail] =
    useState<PlaylistDetail | null>(null);
  const scrollToCurrentRef = React.useRef<() => void>(() => {});

  const [loading, setLoading] = useState<boolean>(false);
  const [searchText, setSearchText] = useState("");
  useEffect(() => {
    setLoading(true);
    getPlaylistDetail(Number(currentPlaylistId))
      .then((res) => {
        setCurrentPlaylistDetail(res.playlist);
      })
      .finally(() => setLoading(false));
  }, [currentPlaylistId]);
  const seriesIds = useMemo(
    () => currentPlaylistDetail?.trackIds.map((item) => item.id) || [],
    [currentPlaylistDetail?.trackIds],
  );

  return (
    <>
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <Box
          position="sticky"
          top={"5rem"}
          zIndex={1}
          sx={{ backgroundColor: "background.paper", mb: 2 }}
        >
          <TopPlaylistInfo
            playlist={currentPlaylistDetail}
            onLocateCurrent={() => scrollToCurrentRef.current()}
            searchText={searchText}
            setSearchText={setSearchText}
            loading={loading}
          />
        </Box>
        <SeriesList
          seriesIds={seriesIds}
          scrollToCurrentRef={scrollToCurrentRef}
          searchInput={searchText}
          loading={loading}
          setLoading={setLoading}
        />
      </Box>
    </>
  );
}

function TopPlaylistInfo({
  playlist,
  onLocateCurrent,
  setSearchText,
  loading,
}: {
  playlist: PlaylistDetail | null;
  onLocateCurrent: () => void;
  searchText: string;
  setSearchText: (text: string) => void;
  loading: boolean;
}) {
  const setCurrentMusicData = useMusicStore(
    (state) => state.setCurrentMusicData,
  );
  const start = useMusicStore((state) => state.start);
  const setCurrentMusicIds = useMusicStore((state) => state.setCurrentMusicIds);
  const [openDescription, setOpenDescription] = useState<boolean>(false);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "flex-start",
          mb: 2,
        }}
      >
        {loading ? (
          <Skeleton variant="rounded" width={240} height={240} sx={{ mr: 4 }} />
        ) : (
          <Avatar
            src={playlist?.coverImgUrl}
            sx={{
              width: "15rem",
              height: "15rem",
              mr: 4,
              boxShadow: "3px 3px 4px 0px rgba(0,0,0,0.3)",
            }}
            variant={"rounded"}
          />
        )}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "flex-start",
            width: "100%",
            height: "15rem",
          }}
        >
          <Typography variant="h5" fontWeight="bold">
            {loading ? <Skeleton width={200} /> : playlist?.name}
          </Typography>

          <Box>
            <Typography>
              {loading ? (
                <Skeleton width={120} />
              ) : (
                <>
                  by
                  <Link
                    href="#"
                    variant="body2"
                    color={"inherit"}
                    ml={1}
                    underline={"hover"}
                  >
                    {playlist?.creator.nickname}
                  </Link>
                </>
              )}
            </Typography>
            <Typography color="textSecondary" variant={"caption"}>
              {loading ? (
                <Skeleton width={180} />
              ) : (
                `${t("last-update-at")} ${fromTimestampToTime(
                  playlist?.updateTime as number,
                )} · ${playlist?.trackCount}${t("song-count")}`
              )}
            </Typography>
          </Box>

          <Typography
            variant="caption"
            mt={1}
            color={"textSecondary"}
            sx={{
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              WebkitLineClamp: 2,
              "&:hover": {
                cursor: "pointer",
                opacity: "0.8",
                transition: "all 0.1s ease",
              },
            }}
            onClick={() => {
              if (!loading) setOpenDescription(true);
            }}
          >
            {loading ? (
              <Skeleton width={250} height={30} />
            ) : (
              playlist?.description
            )}
          </Typography>

          {!loading && (
            <CustomDialog
              open={openDescription}
              setOpen={setOpenDescription}
              title={t("playlist-desc")}
              content={playlist?.description || ""}
            />
          )}

          <Box
            sx={{
              position: "sticky",
              top: "5rem",
              zIndex: 1,
              backgroundColor: "background.paper",
              display: "flex",
              flexDirection: "row",
              gap: 2,
              mb: 2,
              alignItems: "center",
              mt: 1,
            }}
          >
            {loading ? (
              <>
                <Skeleton variant="circular" width={40} height={40} />
                <Skeleton variant="circular" width={40} height={40} />
                <Skeleton variant="circular" width={40} height={40} />
                <Skeleton width={200} height={40} />
              </>
            ) : (
              <>
                <RoundedIconButton
                  icon={<PlayArrow />}
                  showBorder={true}
                  onClick={() => {
                    setCurrentMusicIds(
                      playlist?.trackIds.map((item) => item.id) || [],
                    );
                    setCurrentMusicData(playlist?.tracks[0]);
                    start();
                  }}
                />
                <RoundedIconButton icon={<Menu />} showBorder={true} />
                <RoundedIconButton
                  icon={<MyLocation />}
                  showBorder={true}
                  onClick={onLocateCurrent}
                />
                <Search setInput={setSearchText} />
              </>
            )}
          </Box>
        </Box>
      </Box>
    </>
  );
}

const SeriesList = ({
  seriesIds,
  scrollToCurrentRef,
  searchInput = "",
  loading,
  setLoading,
}: {
  seriesIds: number[];
  scrollToCurrentRef?: React.MutableRefObject<() => void>;
  searchInput?: string;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}) => {
  const setCurrentMusicData = useMusicStore(
    (state) => state.setCurrentMusicData,
  );
  const start = useMusicStore((state) => state.start);
  const currentMusicData = useMusicStore((state) => state.currentMusicData);
  const setCurrentMusicIds = useMusicStore((state) => state.setCurrentMusicIds);
  const [, setVisibleIds] = useState<number[]>([]);
  const [dataList, setDataList] = useState<Song[]>([]);

  const navigate = useNavigate();

  const itemRefs = useRef<Record<number, HTMLButtonElement | null>>({});

  // 定义滚动到当前歌曲的函数，并通过ref暴露给父组件
  React.useEffect(() => {
    if (scrollToCurrentRef) {
      scrollToCurrentRef.current = () => {
        if (!currentMusicData?.id) return;
        const el = itemRefs.current[currentMusicData.id];
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      };
    }
  }, [currentMusicData, scrollToCurrentRef]);
  useEffect(() => {
    setLoading(true);
    if (seriesIds.length === 0) return;

    fetchDataByIds(seriesIds)
      .then((data) => {
        setDataList(data);
        setVisibleIds(seriesIds);
      })
      .finally(() => setLoading(false));
    return () => {
      setDataList([]);
      setVisibleIds([]);
    };
  }, [seriesIds]);

  const fetchDataByIds = async (ids: number[]): Promise<Song[]> => {
    return getSongDetail(ids).then((res) => res.songs);
  };

  return (
    <Box sx={{ p: 1 }}>
      <Stack direction={"column"} spacing={2}>
        {loading ? (
          <>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => (
              <Skeleton
                key={item}
                variant="rectangular"
                width={"100%"}
                height={"3rem"}
              />
            ))}
          </>
        ) : (
          <>
            {dataList
              .filter(
                (item) =>
                  item.name.toLowerCase().includes(searchInput.toLowerCase()) ||
                  item.alia.some((alia) => alia.includes(searchInput)) ||
                  item.al.name
                    .toLowerCase()
                    .includes(searchInput.toLowerCase()) ||
                  item.ar.some((artist) =>
                    artist.name
                      .toLowerCase()
                      .includes(searchInput.toLowerCase()),
                  ),
              )
              .map((item) => (
                <LongSongCard song={item} musicIds={seriesIds} />
              ))}
          </>
        )}
      </Stack>
    </Box>
  );
};

export const LazyAvatar = ({
  src,
  size = "3rem",
  circled = false,
}: {
  src: string;
  size?: string;
  circled?: boolean;
}) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const picSize =
    Number(size.replace("rem", "")) *
    Number(
      getComputedStyle(document.documentElement).fontSize.replace("px", ""),
    );
  return (
    <div ref={ref}>
      {inView ? (
        <Avatar
          src={src + `?param=${picSize}y${picSize}`}
          sx={{ width: size, height: size }}
          variant={circled ? "circular" : "rounded"}
        />
      ) : (
        <></>
      )}
    </div>
  );
};
