import {useParams, useNavigate} from "react-router-dom";
import {useCallback, useEffect, useRef, useState} from "react";
import {Box, Skeleton, Stack, Typography, Link} from "@mui/material";
import {searchArtists} from "../api/search/searchApis";
import type {SearchArtist} from "../api/search/SearchModel";
import {useTranslation} from "react-i18next";
import {LazyAvatar} from "./PlaylistView.tsx";

export function SearchArtistsView() {
    const {text: searchText} = useParams();
    const navigate = useNavigate();
    const {t} = useTranslation();

    const [artists, setArtists] = useState<SearchArtist[]>([]);
    const [hasMore, setHasMore] = useState(true);

    const currentPageRef = useRef(1);
    const loadingRef = useRef(false);
    const observerRef = useRef<HTMLDivElement | null>(null);
    const pageSize = 20;

    const fetchArtists = useCallback(async () => {
        if (!searchText || loadingRef.current || !hasMore) return;

        loadingRef.current = true;
        try {
            const res = await searchArtists(searchText, pageSize, (currentPageRef.current - 1) * pageSize);
            const result = res.result.artists || [];

            if (result.length > 0) {
                setArtists(prev => [...prev, ...result]);
                currentPageRef.current += 1;
                if (result.length < pageSize) {
                    setHasMore(false);
                }
            } else {
                setHasMore(false);
            }
        } catch (err) {
            console.error("搜索艺术家失败:", err);
        } finally {
            loadingRef.current = false;
        }
    }, [searchText, hasMore]);

    // 监听 searchText 改变时，重置数据并加载第一页
    useEffect(() => {
        if (!searchText) return;
        setArtists([]);
        setHasMore(true);
        currentPageRef.current = 1;
        fetchArtists();
    }, [searchText]);

    // 只绑定一次 observer
    useEffect(() => {
        const el = observerRef.current;
        if (!el) return;

        const observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                fetchArtists();
            }
        });

        observer.observe(el);

        return () => {
            observer.disconnect();
        };
    }, [fetchArtists]);

    return (
        <Box>
            <Box display="flex" flexDirection="row" alignItems="center" mb={2}>
                <Typography variant="h5" fontWeight="bold" mr={2}>
                    {t('search-artist')} {searchText}
                </Typography>
            </Box>

            <Stack direction="row" spacing={2} flexWrap="wrap">
                {artists.map(artist => (
                    <Box key={artist.id} display="flex" flexDirection="column" alignItems="center" width={240} mb={4}>
                        <Box
                            sx={{
                                boxShadow: 3,
                                borderRadius: '50%',
                                transition: 'box-shadow 0.2s ease-in-out',
                                '&:hover': {
                                    cursor: 'pointer',
                                    boxShadow: 6,
                                },
                            }}
                            onClick={() => navigate(`/artist/${artist.id}`)}
                        >
                            <LazyAvatar src={artist.picUrl || ""} size="15rem" circled />
                        </Box>
                        <Typography variant="subtitle2" fontWeight="bold" noWrap mt={2}>
                            <Link
                                underline="hover"
                                color="textPrimary"
                                sx={{ '&:hover': { cursor: 'pointer' } }}
                                onClick={() => navigate(`/artist/${artist.id}`)}
                            >
                                {artist.name}
                            </Link>
                        </Typography>
                    </Box>
                ))}

                {loadingRef.current &&
                    [...Array(6)].map((_, index) => (
                        <Box key={index} display="flex" flexDirection="column" alignItems="center" width={240} mb={4}>
                            <Skeleton variant="circular" width={240} height={240} />
                            <Skeleton variant="text" width={100} height={24} style={{ marginTop: 16 }} />
                        </Box>
                    ))}
            </Stack>

            {/* Intersection Observer 触发器 */}
            {hasMore && <div ref={observerRef} style={{ height: 80 }} />}
        </Box>
    );
}
