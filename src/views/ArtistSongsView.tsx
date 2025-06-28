import {useNavigate, useParams} from "react-router-dom";
import React, {useCallback, useEffect, useRef, useState} from "react";
import {getArtistSongs} from "../api/artist/artistApis";
import type {Song} from "../api/track/SongDetailResponse";
import {Box, CircularProgress, Link, Stack, ToggleButton, Typography} from "@mui/material";
import {getSongDetail} from "../api/track/songApis.ts";
import {fromMsToTime} from "../utils/MusicDataUtil.ts";
import {useMusicStore} from "../store/MusicStore.ts";
import {Search} from "../components/Search.tsx";

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
            const res = await getArtistSongs(Number(artistId), pageSize, (currentPage - 1) * pageSize);
            if (res.songs && res.songs.length > 0) {
                setSongs(prev => [...prev, ...res.songs]);
                setCurrentPage(prev => prev + 1);
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
        const observer = new IntersectionObserver(entries => {
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
        <SimpleSonglist songs={songs} loading={loading} observerRef={observerRef}/>
    );
}

export interface SimpleSongslistProps {
    songs: Song[]
    loading: boolean
    observerRef: React.RefObject<HTMLDivElement | null>
}

export function SimpleSonglist({
                                   songs,
                                   loading,
                                   observerRef
                               }: SimpleSongslistProps) {
    const currentMusicData = useMusicStore(state => state.currentMusicData)
    const start = useMusicStore(state => state.start)
    const setCurrentMusicIds = useMusicStore(state => state.setCurrentMusicIds)
    const setCurrentMusicData = useMusicStore(state => state.setCurrentMusicData)

    const navigate = useNavigate();
    const [searchText, setSearchText] = useState("");
    return <>
        <Box>

            <Search setInput={setSearchText}/>
            <Stack direction="column" spacing={1} mt={2}>
                {
                    songs.filter(song => song.name.toLowerCase().includes(searchText.toLowerCase()) || song.al.name.toLowerCase().includes(searchText.toLowerCase())).map((item, index) =>
                        (
                            <ToggleButton value={item.id}
                                          key={item.id}
                                          sx={
                                              [
                                                  {
                                                      border: 'none',
                                                      justifyContent: "start",
                                                      display: "flex",
                                                  },
                                              ]
                                          }
                                          size={"small"}
                                          selected={currentMusicData?.id === item.id}
                                          onDoubleClick={async () => {
                                              getSongDetail([item.id]).then(res => {
                                                  setCurrentMusicData(res.songs[0])
                                                  start()
                                                  setCurrentMusicIds(songs.map(song => song.id))

                                              })
                                          }}
                            >
                                <Box sx={{
                                    flex: 2,
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    gap: 2,
                                }}>
                                    <Typography lineHeight={1}>{index + 1}</Typography>
                                    {/*<LazyAvatar src={item.al.picUrl} size={"3rem"} circled={true}/>*/}
                                    <Box sx={{display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 2}}>
                                        <Typography fontWeight="bold"
                                                    color={"textPrimary"}
                                                    noWrap
                                                    textTransform="capitalize">
                                            {item.name}
                                        </Typography>
                                        {
                                            item.alia && item.alia.length > 0 &&
                                            <Typography variant="body2" color="text.secondary" noWrap>
                                                {"( " + item.alia.join(' / ') + " )"}
                                            </Typography>
                                        }

                                    </Box>
                                </Box>
                                <Box flex={1}>
                                    <Typography variant="body2" color="textPrimary" noWrap
                                                textTransform="capitalize">
                                        <Link underline="hover"
                                              color="textPrimary"
                                              variant="caption"
                                              onClick={() => {
                                                  navigate('/album/' + item.al.id)
                                              }}>{item.al.name}</Link>
                                    </Typography>
                                </Box>
                                <Box sx={{textAlign: 'right', width: '100%', alignItems: 'center', flex: 1}}>
                                    <Typography variant="body2" color="textPrimary" noWrap>
                                        {fromMsToTime(item.dt)}
                                    </Typography>
                                </Box>
                            </ToggleButton>
                        )
                    )
                }
            </Stack>

            {/* 监听这个空 div 是否进入视口 */}
            <div ref={observerRef} style={{height: 1}}/>

            {loading && (
                <Box display="flex" justifyContent="center" mt={2}>
                    <CircularProgress size={24}/>
                </Box>
            )}

        </Box></>
}