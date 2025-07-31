import { useNavigate, useParams } from "react-router-dom";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { getArtistSongs } from "../api/artist/artistApis";
import type { Song } from "../api/track/SongDetailResponse";
import {
  Box,
  CircularProgress,
  Link,
  Stack,
  ToggleButton,
  Typography,
} from "@mui/material";
import { getSongDetail } from "../api/track/songApis.ts";
import { fromMsToTime } from "../utils/MusicDataUtil.ts";
import { useMusicStore } from "../store/MusicStore.ts";
import { Search } from "../components/Search.tsx";
import LongSongCard from "../components/long-song-card/index.tsx";
import { it } from "node:test";

export function ArtistSongsView() {
  const artistId = useParams().id;
  const [songs, setSongs] = useState<Song[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const observerRef = useRef<HTMLDivElement | null>(null);
  const pageSize = 20;

  const fetchSongs = useCallback(async () => {
    if (!artistId || loading || !hasMore) return;
    setLoading(true);
    try {
      const res = await getArtistSongs(
        Number(artistId),
        pageSize,
        (currentPage - 1) * pageSize,
      );
      if (res.songs && res.songs.length > 0) {
        setSongs((prev) => [...prev, ...res.songs]);
        setCurrentPage((prev) => prev + 1);
        if (res.songs.length < pageSize) setHasMore(false);
      } else {
        setHasMore(false);
      }
    } finally {
      setLoading(false);
    }
  }, [artistId, currentPage, loading, hasMore]);

  useEffect(() => {
    if (!artistId) return;
    setSongs([]);
    setCurrentPage(1);
    setHasMore(true);
  }, [artistId]);

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
    <SimpleSonglist songs={songs} loading={loading} observerRef={observerRef} />
  );
}

export interface SimpleSongslistProps {
  songs: Song[];
  loading: boolean;
  observerRef: React.RefObject<HTMLDivElement | null>;
}

export function SimpleSonglist({
  songs,
  loading,
  observerRef,
}: SimpleSongslistProps) {
  const [searchText, setSearchText] = useState("");
  return (
    <>
      <Box>
        <Search setInput={setSearchText} />
        <Stack direction="column" spacing={1} mt={2}>
          {songs
            .filter(
              (song) =>
                song.name.toLowerCase().includes(searchText.toLowerCase()) ||
                song.al.name.toLowerCase().includes(searchText.toLowerCase()),
            )
            .map((item) => (
              <LongSongCard
                song={item}
                musicIds={songs.map((item) => item.id)}
                withAvatar={false}
              />
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
