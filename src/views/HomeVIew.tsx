import {Box, Grid, IconButton, Link, Skeleton, ToggleButton, Typography} from "@mui/material";
import {useEffect, useState} from "react";
import type {RecommendPlaylist} from "../api/user/RecommendPlaylistModel.ts";
import {getUserDailyRecommendSongs, getUserRecommendPlaylist} from "../api/user/userApis.ts";
import {LazyAvatar} from "./PlaylistView.tsx";
import {ExpandLess, ExpandMore, PlayArrow} from "@mui/icons-material";
import {t} from "i18next";
import {useNavigate} from "react-router-dom";
import {getPlaylistDetail} from "../api/playlist/playListApis.ts";
import {useMusicStore} from "../store/MusicStore.ts";
import {getSongDetail} from "../api/track/songApis.ts";
import type {Song} from "../api/track/SongDetailResponse.ts";
import {getTransformScaleStyles} from "../css/CommonStyle.ts";
import RoundedIconButton from "../components/RoundedIconButton.tsx";

export function HomeView() {

    return <>
        <Box display={"flex"} flexDirection={"column"} gap={2}>
            <ForYou/>
            <RecommendPlaylist/>
        </Box>
    </>
}


function RecommendPlaylist() {
    const [recommendPlaylist, setRecommendPlaylist] = useState<RecommendPlaylist[]>([])
    const setCurrentMusicIds = useMusicStore((state) => state.setCurrentMusicIds)
    const setCurrentMusicData = useMusicStore((state) => state.setCurrentMusicData)
    const start = useMusicStore((state) => state.start)
    const [loading, setLoading] = useState(false)
    useEffect(() => {
        setLoading(true)
        getUserRecommendPlaylist().then((res) => {
            setRecommendPlaylist(res.result)
        }).finally(() => {
            setLoading(false)
        })
    }, []);
    const navigate = useNavigate();
    return <>
        {
            loading ? <></> : <>
                <Typography variant="h4" fontWeight="bold" mb={2}>{t('recomment-playlist')}</Typography>

                <Grid container spacing={2}>

                    {
                        recommendPlaylist.map((playlist: RecommendPlaylist) => {
                            return <>
                                <Grid key={playlist.id} width={'15%'} component={"div"}>
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
                                                navigate(`/playlist/${playlist.id}`)
                                            }}>
                                                <LazyAvatar src={playlist.picUrl || ""} size={'15rem'}/>

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
                                                onClick={async () => {
                                                    const res = await getPlaylistDetail(playlist.id);
                                                    setCurrentMusicIds(res.playlist.trackIds.map(item => item.id));

                                                    const songRes = await getSongDetail([res.playlist.trackIds[0].id]);
                                                    setCurrentMusicData(songRes.songs[0]);
                                                    start();
                                                }}
                                            >
                                                <PlayArrow fontSize="large"/>
                                            </IconButton>
                                        </Box>

                                        <Box mt={2}>
                                            <Typography variant="subtitle2" fontWeight="bold">
                                                <Link
                                                    underline="hover"
                                                    color="textPrimary"
                                                    sx={{'&:hover': {cursor: 'pointer'}}}
                                                    onClick={() => {
                                                        navigate(`/playlist/${playlist.id}`)
                                                    }}
                                                >
                                                    {playlist.name}
                                                </Link>
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Grid>
                            </>
                        })
                    }
                </Grid>
            </>


        }

    </>
}

function ForYou() {
    const [dailySongs, setDailySongs] = useState<Song[]>([])
    const [loading, setLoading] = useState(false)
    const [expanded, setExpanded] = useState(false)
    const setCurrentMusicIds = useMusicStore((state) => state.setCurrentMusicIds)
    const setCurrentMusicData = useMusicStore((state) => state.setCurrentMusicData)
    const start = useMusicStore((state) => state.start)
    const currentMusicData = useMusicStore((state) => state.currentMusicData)
    useEffect(() => {
        setLoading(true)
        getUserDailyRecommendSongs().then((res) => {
            setDailySongs(res.data.dailySongs)
        }).finally(() => {
            setLoading(false)
        })
    }, []);
    const displayedSongs = expanded ? dailySongs : dailySongs.slice(0, 5);
    return <>
        <Box sx={{display: "flex", justifyContent: "flex-start", alignItems: "center", mt: 2, gap: 2}}>
            <Typography variant="h4" fontWeight="bold"
            >
                {t('daily-recommend-songs')}
            </Typography>
            {dailySongs.length > 8 && (
                <RoundedIconButton
                    title={expanded ? t('unexpand') : t('show-more')}
                    icon={expanded ? <ExpandLess/> : <ExpandMore/>}
                    onClick={() => setExpanded(!expanded)}
                >
                </RoundedIconButton>
            )}
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
                                setCurrentMusicIds(dailySongs.map(song => song.id));
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