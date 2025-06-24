import {useNavigate, useParams} from "react-router-dom";
import {useCallback, useEffect, useRef, useState} from "react";
import type {Song} from "../api/track/SongDetailResponse.ts";
import {useMusicStore} from "../store/MusicStore.ts";
import {Box, CircularProgress, Link, Stack, ToggleButton, Typography} from "@mui/material";
import {getSongDetail} from "../api/track/songApis.ts";
import {fromMsToTime} from "../utils/MusicDataUtil.ts";
import {searchSongs} from "../api/search/searchApis.ts";
import {LazyAvatar} from "./PlaylistView.tsx";
import {t} from "i18next";

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
            const res = await searchSongs(searchText, pageSize, (currentPage - 1) * pageSize);
            if (res.result.songs && res.result.songs.length > 0) {
                setSongs(prev => [...prev, ...res.result.songs]);
                setCurrentPage(prev => prev + 1);
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

    const currentMusicData = useMusicStore(state => state.currentMusicData)
    const start = useMusicStore(state => state.start)
    const setCurrentMusicIds = useMusicStore(state => state.setCurrentMusicIds)
    const setCurrentMusicData = useMusicStore(state => state.setCurrentMusicData)

    const navigate = useNavigate();
    return <>
        <Box>
            <Typography variant="h4">{t('search-song') + " " + searchText}</Typography>
            <Stack direction="column" spacing={1} mt={2}>
                {
                    songs.map((item, index) =>
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
                                    <Typography lineHeight={1} width={'2rem'}>{index + 1}</Typography>
                                    <LazyAvatar src={item.al.picUrl} size={"3rem"}/>
                                    <Box sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'flex-start',
                                        textAlign: 'left',
                                    }}>
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

                                        <Typography variant="body2" color="text.secondary" noWrap
                                                    textTransform="capitalize">
                                            {item.ar.slice(0, 5).map((artist, index) => (
                                                <span key={artist.id || artist.name}>
                                                    <Link
                                                        underline="hover"
                                                        color="textSecondary"
                                                        variant="caption"
                                                        onClick={() => {
                                                            navigate('/artist/' + artist.id)
                                                        }}
                                                    >
                                                        {artist.name}
                                                    </Link>
                                                    {index !== 4 && ' / '}
                                                    </span>
                                            ))}
                                        </Typography>
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
                                              }}>{item.al.name}
                                        </Link>
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