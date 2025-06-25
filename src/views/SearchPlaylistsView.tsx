import {useRef, useEffect, useCallback, useState} from 'react';
import {Box, Typography, Stack} from '@mui/material';
import {useParams,} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import type {SearchPlaylist} from "../api/search/SearchModel.ts";
import {searchPlaylist} from "../api/search/searchApis.ts";
import {RoundedPlaylist} from "../components/RoundedPlaylist.tsx";

export function SearchPlaylistsView() {
    const {text: searchText} = useParams();
    const {t} = useTranslation();

    const [playlists, setPlaylists] = useState<SearchPlaylist[]>([]);
    const [hasMore, setHasMore] = useState(true);

    const currentPageRef = useRef(1);
    const loadingRef = useRef(false);
    const observerRef = useRef<HTMLDivElement | null>(null);
    const pageSize = 20;

    const fetchPlaylists = useCallback(async () => {
        if (!searchText || loadingRef.current || !hasMore) return;

        loadingRef.current = true;
        try {
            const res = await searchPlaylist(searchText, pageSize, (currentPageRef.current - 1) * pageSize);
            const result = res.result.playlists || [];

            if (result.length > 0) {
                setPlaylists(prev => [...prev, ...result]);
                currentPageRef.current += 1;
                if (result.length < pageSize) {
                    setHasMore(false);
                }
            } else {
                setHasMore(false);
            }
        } catch (err) {
            console.error("搜索歌单失败:", err);
        } finally {
            loadingRef.current = false;
        }
    }, [searchText, hasMore]);

    // 当搜索词改变时，重置分页
    useEffect(() => {
        if (!searchText) return;
        setPlaylists([]);
        setHasMore(true);
        currentPageRef.current = 1;
        fetchPlaylists(); // 初始化加载第一页
    }, [searchText, fetchPlaylists]);

    // 只绑定一次 observer，不依赖 fetchPlaylists
    useEffect(() => {
        const el = observerRef.current;
        if (!el) return;

        const observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                fetchPlaylists();
            }
        });

        observer.observe(el);

        return () => {
            observer.disconnect();
        };
    }, [fetchPlaylists]);

    return (
        <Box>
            <Box display="flex" flexDirection="row" alignItems="center" mb={2}>
                <Typography variant="h5" fontWeight="bold" mr={2}>
                    {t('search-playlist')} {searchText}
                </Typography>
            </Box>

            <Stack direction="row" spacing={2} flexWrap="wrap">
                <RoundedPlaylist playlists={playlists}/>
            </Stack>

            {hasMore && <div ref={observerRef} style={{height: 80}}/>}
        </Box>
    );
}
