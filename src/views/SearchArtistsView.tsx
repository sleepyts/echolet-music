import {useParams, useNavigate} from "react-router-dom";
import {useCallback, useEffect, useRef, useState} from "react";
import {Box, Skeleton, Stack, Typography, Link} from "@mui/material";
import {searchArtists} from "../api/search/searchApis";
import type {SearchArtist} from "../api/search/SearchModel";
import ReadMore from "@mui/icons-material/ReadMore";
import {useTranslation} from "react-i18next";
import RoundedIconButton from "../components/RoundedIconButton.tsx";
import {LazyAvatar} from "./PlaylistView.tsx";

export function SearchArtistsView() {
    const {text: searchText} = useParams();
    const navigate = useNavigate();
    const {t} = useTranslation();

    const [artists, setArtists] = useState<SearchArtist[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const observerRef = useRef<HTMLDivElement | null>(null);
    const pageSize = 20;

    const fetchArtists = useCallback(async () => {
        if (!searchText || loading || !hasMore) return;
        setLoading(true);
        try {
            const res = await searchArtists(searchText, pageSize, (currentPage - 1) * pageSize);
            if (res.result.artists && res.result.artists.length > 0) {
                setArtists(prev => [...prev, ...res.result.artists]);
                setCurrentPage(prev => prev + 1);
                if (res.result.artists.length < pageSize) {
                    setHasMore(false);
                }
            } else {
                setHasMore(false);
            }
        } catch (err) {
            console.error("搜索艺术家失败:", err);
        } finally {
            setLoading(false);
        }
    }, [searchText, currentPage, loading, hasMore]);

    useEffect(() => {
        if (!searchText) return;
        setArtists([]);
        setCurrentPage(1);
        setHasMore(true);
    }, [searchText]);

    useEffect(() => {
        fetchArtists(); // 初始化加载第一页
    }, [fetchArtists]);

    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore && !loading) {
                fetchArtists();
            }
        });

        const el = observerRef.current;
        if (el) observer.observe(el);

        return () => {
            if (el) observer.unobserve(el);
        };
    }, [fetchArtists, hasMore, loading]);

    return (
        <Box>
            <Box display="flex" flexDirection="row" alignItems="center" mb={2}>
                <Typography variant="h5" fontWeight="bold" mr={2}>
                    {t('artist')}
                </Typography>
                <RoundedIconButton title={t('show-all')} icon={<ReadMore />} />
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

                {loading &&
                    [...Array(6)].map((_, index) => (
                        <Box key={index} display="flex" flexDirection="column" alignItems="center" width={240} mb={4}>
                            <Skeleton variant="circular" width={240} height={240} />
                            <Skeleton variant="text" width={100} height={24} style={{ marginTop: 16 }} />
                        </Box>
                    ))}
            </Stack>

            {/* Intersection Observer 触发器 */}
            {hasMore && <div ref={observerRef} style={{ height: 1 }} />}
        </Box>
    );
}
