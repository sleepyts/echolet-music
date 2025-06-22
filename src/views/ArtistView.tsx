import {useNavigate, useParams} from "react-router-dom";
import type {ArtistData} from "../api/artist/ArtistDetailModel.ts";
import {useEffect, useState} from "react";
import {getArtistDetail, getArtistHotAlbums, getArtistHotSongs} from "../api/artist/artistApis.ts";
import {Avatar, Box, Grid, IconButton, Link, Stack, ToggleButton, Typography} from "@mui/material";
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

export function ArtistView() {
    const artistId = useParams().id;
    const [artistDetail, setArtistDetail] = useState<ArtistData>();

    useEffect(() => {
        if (!artistId) {
            return;
        }

        getArtistDetail(Number(artistId)).then(res => {
            setArtistDetail(res.data)
        })

        return () => {
            setArtistDetail(undefined);
        }
    }, [artistId]);
    return <>
        <Box p={2} sx={{display: "flex", flexDirection: "column"}}>
            <ArtistInfo artistDetail={artistDetail}/>
            <ArtistHotSong artistId={Number(artistId)}/>
            <ArtistsAlbums artistId={Number(artistId)}/>
        </Box>
    </>
}

export function ArtistsAlbums({artistId}: { artistId: number }) {
    const [albums, setAlbums] = useState<HotAlbum[]>([]);

    const navigate = useNavigate();
    useEffect(() => {
        getArtistHotAlbums(artistId).then(res => {
            setAlbums(res);
        });
    }, [artistId]);

    return (
        <Box mt={4}>
            <Box display="flex" flexDirection="row" alignItems="center" mb={2} gap={2}>
                <Typography variant="h5" fontWeight="bold" color="text.primary">
                    {t("album-ep-single")}
                </Typography>
                <RoundedIconButton
                    title={t('show-all')}
                    icon={<ReadMore/>}
                />
            </Box>


            {albums.length === 0 ? (
                <Typography color="text.secondary">{t("noAlbumsAvailable")}</Typography>
            ) : (
                <Grid container spacing={3}>
                    {albums.map(album => (
                        <Grid key={album.id} width={'15rem'} component={"div"}>

                            <Box>
                                <Box
                                    sx={(theme) => ({
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
                                    <Box onClick={()=>{
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
            )}
        </Box>
    );
}

export function ArtistInfo({artistDetail}: { artistDetail: ArtistData | undefined }) {
    if (!artistDetail) return null;
    return <>
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
                <Typography variant="h3"
                            color="textPrimary"
                            fontWeight={"bold"}
                >{artistDetail.artist.name}</Typography>
                <Typography variant="subtitle2" color="textSecondary">{artistDetail.artist.musicSize} {t('song-count')}
                    · {artistDetail.artist.albumSize} {t('album-count')} · {artistDetail.artist.mvSize} {t('mv-count')}</Typography>
                <Typography variant="body2" color="text.secondary"
                            sx={{
                                display: '-webkit-box',
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                                WebkitLineClamp: 2, // 限制最大3行
                            }}
                >
                    {artistDetail.artist.briefDesc}
                </Typography>
                <Stack direction="row" spacing={2}>
                    <RoundedIconButton showBorder={true} icon={<FavoriteBorder/>}/>
                </Stack>

            </Box>
        </Box>
    </>
}

function ArtistHotSong({artistId}: { artistId: number | undefined }) {
    const [hotSongs, setHotSongs] = useState<Song[]>([]);
    const [expanded, setExpanded] = useState(false);

    const currentMusicData = useMusicStore(state => state.currentMusicData)
    const setCurrentMusicData = useMusicStore(state => state.setCurrentMusicData)
    const setCurrentMusicIds = useMusicStore(state => state.setCurrentMusicIds)
    const start = useMusicStore(state => state.start)
    useEffect(() => {
        getArtistHotSongs(typeof artistId === "number" ? artistId : 0).then(res => {
            if (!res) {
                return;
            }
            const numbers = res.map(song => song.id);
            setCurrentMusicIds(numbers)
            getSongDetail(numbers).then(res => {
                setHotSongs(res.songs)
            })
        });
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
            />
        </Box>


        <Grid container spacing={2} sx={{mt: 2,}}>
            {displayedSongs.map(song => (
                <Grid key={song.id} sx={{width: "17%"}} component={"div"}>
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
                        <Box sx={{
                            width: "100%",
                        }}>
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

                            <Typography fontSize={"0.7rem"}
                                        color="text.secondary"
                                        align={"left"}
                                        title={song.ar.map(artist => artist.name).join("/")}
                                        sx={{
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            width: "10rem",
                                        }}
                                        textTransform="capitalize">
                                {song.ar.map(artist => artist.name).join("/")}
                            </Typography>
                        </Box>
                    </ToggleButton>
                </Grid>
            ))}
        </Grid>


    </>
}
