import { useParams } from "react-router-dom";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Song } from "../api/track/SongDetailResponse.ts";
import { Box, CircularProgress, Stack, Typography } from "@mui/material";
import { searchSongs } from "../api/search/searchApis.ts";
import { t } from "i18next";
import LongSongCard from "../components/long-song-card/index.tsx";

export function SearchSongsView() {
  const searchText = useParams().text;
  const [songs, setSongs] = useState<Song[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const observerRef = useRef<HTMLDivElement | null>(null);
  const pageSize = 20;

  const fetchSongs = useCallback(async () => {
    if (!searchText || loading || !hasMore) return;
    setLoading(true);
    try {
      const res = await searchSongs(
        searchText,
        pageSize,
        (currentPage - 1) * pageSize,
      );
      if (res.result.songs && res.result.songs.length > 0) {
        setSongs((prev) => [...prev, ...res.result.songs]);
        setCurrentPage((prev) => prev + 1);
        if (res.result.songs.length < pageSize) setHasMore(false);
      } else {
        setHasMore(false);
      }
    } finally {
      setLoading(false);
    }
  }, [searchText, currentPage, loading, hasMore]);

  useEffect(() => {
    if (!searchText) return;
    setSongs([]);
    setCurrentPage(1);
    setHasMore(true);
  }, [searchText]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore && !loading) {
        fetchSongs();
      }
    });

    const el = observerRef.current;
    if (el) observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
    };
  }, [fetchSongs, hasMore, loading]);
  return (
    <>
      <Box>
        <Typography variant="h4">
          {t("search-song") + " " + searchText}
        </Typography>
        <Stack direction="column" spacing={1} mt={2}>
          {songs.map((item) => (
            <LongSongCard song={item} musicIds={songs.map((item) => item.id)} />
          ))}
        </Stack>

        {/* 监听这个空 div 是否进入视口 */}
        <div ref={observerRef} style={{ height: 1 }} />

        {loading && (
          <Box display="flex" justifyContent="center" mt={2}>
            <CircularProgress size={24} />
          </Box>
        )}
      </Box>
    </>
  );
}
