import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import type {SearchArtist} from "../api/search/SearchModel.ts";
import {searchArtists, searchSongs} from "../api/search/searchApis.ts";
import {Box, Grid, Link, Skeleton, Stack, ToggleButton, Typography} from "@mui/material";
import {t} from "i18next";
import {LazyAvatar} from "./PlaylistView.tsx";
import RoundedIconButton from "../components/RoundedIconButton.tsx";
import {ReadMore} from "@mui/icons-material";
import type {Song} from "../api/track/SongDetailResponse.ts";
import {getTransformScaleStyles} from "../css/CommonStyle.ts";
import {useMusicStore} from "../store/MusicStore.ts";

export function SearchView() {
    const searchInput = useParams().text || '';
    return <>
        <SearchArtistView searchInput={searchInput}/>
        <SearchMusicView searchInput={searchInput}/>
    </>
}


function SearchArtistView({searchInput}: { searchInput: string }) {
    const [searchedArtists, setSearchedArtists] = useState<SearchArtist[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        searchArtists(searchInput || '', 6, 0).then(res => {
            setSearchedArtists(res.result.artists || []);
        }).finally(() => setLoading(false));
    }, [searchInput]);

    return (
        <Box>
            <Box display="flex" flexDirection="row" alignItems="center" mb={2}>
                <Typography variant="h5" fontWeight="bold" mr={2}>
                    {t('artist')}
                </Typography>
                <RoundedIconButton
                    title={t('show-all')}
                    icon={<ReadMore/>}
                />
            </Box>

            <Stack direction="row" spacing={2}>
                {loading
                    ? [...Array(6)].map((_, index) => (
                        <Box key={index} display="flex" flexDirection="column" alignItems="center">
                            <Skeleton variant="circular" width={240} height={240}/>
                            <Skeleton variant="text" width={100} height={24} style={{marginTop: 16}}/>
                        </Box>
                    ))
                    : searchedArtists.map(artist => (
                        <Box key={artist.id} display="flex" flexDirection="column" alignItems="center">
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
                                <LazyAvatar src={artist.picUrl || ""} size={"15rem"} circled={true}/>
                            </Box>
                            <Typography variant="subtitle2" fontWeight="bold" noWrap mt={2}>
                                <Link
                                    underline="hover"
                                    color="textPrimary"
                                    sx={{'&:hover': {cursor: 'pointer'}}}
                                    onClick={() => navigate(`/artist/${artist.id}`)}
                                >
                                    {artist.name}
                                </Link>
                            </Typography>
                        </Box>
                    ))}
            </Stack>
        </Box>
    );
}


function SearchMusicView({searchInput}: { searchInput: string }) {
    const [searchedSongs, setSearchedSongs] = useState<Song[]>([]);
    const [loading, setLoading] = useState(false);
    const setCurrentMusicData = useMusicStore(state => state.setCurrentMusicData);
    const start = useMusicStore(state => state.start);
    const currentMusicData = useMusicStore(state => state.currentMusicData);
    useEffect(() => {
        setLoading(true);
        searchSongs(searchInput, 15, 0).then(res => {
            setSearchedSongs(res.result.songs);
        }).finally(() => setLoading(false));
    }, [searchInput]);
    return <>
        <Box mt={4}>
            <Box display="flex" flexDirection="row" alignItems="center" mb={2}>
                <Typography variant="h5" fontWeight="bold" mr={2}>
                    {t('song')}
                </Typography>
                <RoundedIconButton
                    title={t('show-all')}
                    icon={<ReadMore/>}
                />
            </Box>

            <Grid container spacing={2} sx={{mt: 2}}>
                {loading ? (
                    Array.from({length: 10}).map((_, index) => (
                        <Grid key={index} sx={{width: "17%"}} component="div">
                            <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                                <Skeleton variant="rectangular" width={'3rem'} height={'3rem'}/>
                                <Box>
                                    <Skeleton variant="text" width={100} height={20}/>
                                    <Skeleton variant="text" width={80} height={16}/>
                                </Box>
                            </Box>
                        </Grid>
                    ))
                ) : (
                    searchedSongs.map(song => (
                        <Grid key={song.id} sx={{width: "17%"}} component="div">
                            <ToggleButton
                                value={song.id}
                                title={song.name}
                                sx={[
                                    {
                                        border: "none",
                                        width: "100%",
                                        height: "4rem",
                                    },
                                    getTransformScaleStyles(0.97, 0.15)
                                ]}
                                selected={currentMusicData?.id === song.id}
                                onDoubleClick={async () => {
                                    setCurrentMusicData(song)
                                    start()
                                }}
                            >
                                <LazyAvatar src={song.al.picUrl}/>
                                <Box sx={{width: "100%", ml: 2}}>
                                    <Typography
                                        className="scroll-text"
                                        fontSize="0.8rem"
                                        fontWeight="bold"
                                        color="textPrimary"
                                        textTransform="capitalize"
                                        align="left"
                                        sx={{
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            width: "10rem",
                                        }}
                                    >
                                        {song.name}
                                    </Typography>
                                    <Typography
                                        fontSize={"0.7rem"}
                                        color="text.secondary"
                                        align={"left"}
                                        title={song.ar.map(artist => artist.name).join("/")}
                                        sx={{
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            width: "10rem",
                                        }}
                                        textTransform="capitalize"
                                    >
                                        {song.ar.map(artist => artist.name).join("/")}
                                    </Typography>
                                </Box>
                            </ToggleButton>
                        </Grid>
                    ))
                )}
            </Grid>
        </Box>
    </>
}