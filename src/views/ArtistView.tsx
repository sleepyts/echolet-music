import {useNavigate, useParams} from "react-router-dom";
import type {ArtistData} from "../api/artist/ArtistDetailModel.ts";
import React, {useEffect, useState} from "react";
import {getArtistDetail, getArtistHotAlbums, getArtistHotSongs} from "../api/artist/artistApis.ts";
import {Avatar, Box, Grid, IconButton, Link, Skeleton, Stack, ToggleButton, Typography} from "@mui/material";
import RoundedIconButton from "../components/RoundedIconButton.tsx";
import {ExpandLess, ExpandMore, FavoriteBorder, PlayArrow, ReadMore} from "@mui/icons-material";
import {t} from "i18next";
import type {Song} from "../api/track/SongDetailResponse.ts";
import {LazyAvatar} from "./PlaylistView.tsx";
import {useMusicStore} from "../store/MusicStore.ts";
import {getSongDetail} from "../api/track/songApis.ts";
import {getTransformScaleStyles} from "../css/CommonStyle.ts";
import type {HotAlbum} from "../api/artist/ArtistAlbumModel.ts";
import {fromTimestampToYear} from "../utils/MusicDataUtil.ts";
import {getAlbumDetail} from "../api/album/albumApis.ts";
import {CustomDialog} from "../components/CustomDialog.tsx";

export function ArtistView() {
    const artistId = useParams().id;
    const [artistDetail, setArtistDetail] = useState<ArtistData>();

    const [loading, setLoading] = useState(true);
    useEffect(() => {
        if (!artistId) {
            return;
        }
        setLoading(true);
        getArtistDetail(Number(artistId)).then(res => {
            setArtistDetail(res.data)
            setLoading(false);
        })

        return () => {
            setArtistDetail(undefined);
        }
    }, [artistId]);
    return <>
        <Box sx={{display: "flex", flexDirection: "column"}}>
            <ArtistInfo artistDetail={artistDetail} loading={loading}/>
            <ArtistHotSong artistId={Number(artistId)}/>
            <ArtistsAlbums artistId={Number(artistId)}/>
        </Box>
    </>
}

export function ArtistsAlbums({artistId}: { artistId: number }) {
    const [albums, setAlbums] = useState<HotAlbum[]>([]);
    const setCurrentMusicData = useMusicStore(state => state.setCurrentMusicData)
    const start = useMusicStore(state => state.start)
    const setCurrentMusicIds = useMusicStore(state => state.setCurrentMusicIds)
    const navigate = useNavigate();

    const [albumLoading, setAlbumLoading] = useState(true);
    useEffect(() => {
        setAlbumLoading(true);
        getArtistHotAlbums(artistId).then(res => {
            setAlbums(res);
            setAlbumLoading(false);
        }).catch(() => setAlbumLoading(false));

        return () => {
            setAlbums([]);
            setAlbumLoading(false);
        };
    }, [artistId]);

    return (
        <Box mt={4}>
            <Box display="flex" flexDirection="row" alignItems="center" mb={2} gap={2}>
                <Typography variant="h5" fontWeight="bold" color="text.primary">
                    {t("album-ep-single")}
                </Typography>
                {/*<RoundedIconButton*/}
                {/*    title={t('show-all')}*/}
                {/*    icon={<ReadMore/>}*/}
                {/*/>*/}
            </Box>


            {
                albumLoading ? (
                    <Grid container spacing={3}>
                        {Array.from({length: 6}).map((_, index) => (
                            <Grid key={index} width={'15%'} component="div">
                                <Skeleton variant="rectangular" width="15rem" height="15rem" sx={{borderRadius: 2}}/>
                                <Box mt={2}>
                                    <Skeleton variant="text" width="100%" height={24}/>
                                    <Skeleton variant="text" width="60%" height={16}/>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                ) : albums.length === 0 ? (
                    <Typography color="text.secondary">{t("noAlbumsAvailable")}</Typography>
                ) : (

                    <Grid container spacing={3}>
                        {albums.map(album => (
                            <Grid key={album.id} width={'15%'} component={"div"}>
                                <Box>
                                    <Box
                                        sx={(theme) => ({
                                            width: '15rem',
                                            position: 'relative', // 关键！让播放按钮定位生效
                                            borderRadius: 2,
                                            overflow: 'hidden',
                                            transition: 'all 0.3s',
                                            backgroundColor:
                                                theme.palette.mode === 'dark'
                                                    ? theme.palette.grey[800]
                                                    : theme.palette.grey[100],
                                            boxShadow:
                                                theme.palette.mode === 'dark'
                                                    ? '0 0 18px rgba(255,255,255,0.1)'
                                                    : '0 6px 24px rgba(0,0,0,0.15)',

                                            '&:hover': {
                                                boxShadow:
                                                    theme.palette.mode === 'dark'
                                                        ? '0 0 32px rgba(255,255,255,0.2)'
                                                        : '0 12px 36px rgba(0,0,0,0.25)',
                                                cursor: 'pointer',

                                                // 播放按钮显现
                                                '& .hover-play-button': {
                                                    opacity: 1,
                                                    transform: 'translate(-50%, -50%) scale(1)',
                                                },
                                            },
                                        })}
                                    >
                                        {/* 图片组件 */}
                                        <Box onClick={() => {
                                            navigate(`/album/${album.id}`)
                                        }}>
                                            <LazyAvatar src={album.picUrl || ""} size={'15rem'}/>

                                        </Box>

                                        {/* 播放按钮 */}
                                        <IconButton
                                            className="hover-play-button"
                                            sx={{
                                                position: 'absolute',
                                                top: '50%',
                                                left: '50%',
                                                transform: 'translate(-50%, -50%) scale(0.9)',
                                                opacity: 0,
                                                color: '#fff',
                                                backgroundColor: 'rgba(122,119,119,0.6)',
                                                transition: 'all 0.3s ease',
                                                zIndex: 2,
                                                '&:hover': {
                                                    backgroundColor: 'rgba(45,44,44,0.8)',
                                                },
                                            }}
                                            onClick={() => {
                                                getAlbumDetail(album.id).then(res1 => {
                                                    getSongDetail([res1.songs[0].id]).then(res2 => {
                                                        setCurrentMusicData(res2.songs[0])
                                                        setCurrentMusicIds(res1.songs.map(song => song.id))
                                                        start()
                                                    })
                                                })
                                            }}
                                        >
                                            <PlayArrow fontSize="large"/>
                                        </IconButton>
                                    </Box>

                                    <Box mt={2}>
                                        <Typography variant="subtitle2" fontWeight="bold" noWrap>
                                            <Link
                                                underline="hover"
                                                color="textPrimary"
                                                sx={{'&:hover': {cursor: 'pointer'}}}
                                                onClick={() => {
                                                    navigate(`/album/${album.id}`)
                                                }}
                                            >
                                                {album.name}
                                            </Link>
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {album.size >= 8 ? t('album') : album.size >= 2 ? t('ep') : t('single')}-{fromTimestampToYear(album.publishTime)}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                )
            }
        </Box>
    );
}

export function ArtistInfo({artistDetail, loading}: { artistDetail: ArtistData | undefined, loading: boolean }) {
    const [openDescription, setOpenDescription] = React.useState(false);

    if (loading || !artistDetail) {
        // 骨架屏模式
        return (
            <Box sx={{display: "flex", justifyContent: "flex-start", flexDirection: "row", mb: 2}}>
                <Skeleton variant="circular" width={240} height={240} sx={{flexShrink: 0}}/>
                <Box sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    ml: 3,
                    flexGrow: 1
                }}>
                    <Skeleton variant="text" width="50%" height={50}/>
                    <Skeleton variant="text" width="70%" height={30}/>
                    <Skeleton variant="text" width="100%" height={60}/>
                    <Skeleton variant="rectangular" width={100} height={40} sx={{borderRadius: '20px'}}/>
                </Box>
            </Box>
        );
    }
    // 正常内容模式
    return (
        <Box sx={{display: "flex", justifyContent: "flex-start", flexDirection: "row", mb: 2}}>
            <Avatar src={artistDetail.artist.avatar}
                    sx={{width: '15rem', height: '15rem', boxShadow: '0px 0px 10px rgba(0,0,0,0.2)'}}/>
            <Box sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                alignItems: "flex-start",
                ml: 3
            }}>
                <Typography variant="h3" color="textPrimary" fontWeight={"bold"}>
                    {artistDetail.artist.name}
                </Typography>
                <Typography variant="subtitle2" color="textSecondary">
                    {artistDetail.artist.musicSize} {t('song-count')} · {artistDetail.artist.albumSize} {t('album-count')} · {artistDetail.artist.mvSize} {t('mv-count')}
                </Typography>
                <Typography variant="body2" color="text.secondary"
                            sx={{
                                display: '-webkit-box',
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                                WebkitLineClamp: 2,
                                '&:hover': {
                                    cursor: 'pointer',
                                    opacity: '0.8',
                                    transition: 'all 0.1s ease',
                                }
                            }}
                            onClick={() => {
                                setOpenDescription(true)
                            }}
                >
                    {artistDetail.artist.briefDesc}
                </Typography>
                <Stack direction="row" spacing={2}>
                    <RoundedIconButton showBorder={true} icon={<FavoriteBorder/>}/>
                </Stack>
                <CustomDialog open={openDescription} setOpen={setOpenDescription} title={t('artist-brief-desc')}
                              content={artistDetail.artist.briefDesc}/>
            </Box>
        </Box>
    );
}

function ArtistHotSong({artistId}: { artistId: number | undefined }) {
    const [hotSongs, setHotSongs] = useState<Song[]>([]);
    const [expanded, setExpanded] = useState(false);

    const currentMusicData = useMusicStore(state => state.currentMusicData)
    const setCurrentMusicData = useMusicStore(state => state.setCurrentMusicData)
    const setCurrentMusicIds = useMusicStore(state => state.setCurrentMusicIds)
    const start = useMusicStore(state => state.start)

    const [songLoading, setSongLoading] = useState<boolean>(true)
    const navigate = useNavigate();
    useEffect(() => {
        if (typeof artistId !== "number") return;
        setSongLoading(true);

        getArtistHotSongs(artistId).then(res => {
            if (!res) {
                setSongLoading(false);
                return;
            }
            const ids = res.map(song => song.id);
            setCurrentMusicIds(ids);
            getSongDetail(ids).then(res => {
                setHotSongs(res.songs);
                setSongLoading(false);
            }).catch(() => setSongLoading(false));
        }).catch(() => setSongLoading(false));
    }, [artistId]);

    // 决定展示多少首歌
    const displayedSongs = expanded ? hotSongs : hotSongs.slice(0, 10);

    return <>
        <Box sx={{display: "flex", justifyContent: "flex-start", alignItems: "center", mt: 2, gap: 2}}>
            <Typography variant="h5"
                        color="textPrimary"
                        fontWeight={"bold"}
            >
                {t('hot-songs')}
            </Typography>
            {hotSongs.length > 8 && (
                <RoundedIconButton
                    title={expanded ? t('unexpand') : t('show-more')}
                    icon={expanded ? <ExpandLess/> : <ExpandMore/>}
                    onClick={() => setExpanded(!expanded)}
                >
                </RoundedIconButton>
            )}
            <RoundedIconButton
                title={t('show-all')}
                icon={<ReadMore/>}
                onClick={() => navigate(`/artist/songs/${artistId}`)}
            />
        </Box>


        <Grid container spacing={2} sx={{mt: 2}}>
            {songLoading ? (
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
                displayedSongs.map(song => (
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


    </>
}
