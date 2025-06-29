// src/components/GlobalPlayer.tsx
import {Box, Link, Slider, Stack, Typography} from '@mui/material';
import {
    KeyboardArrowUp,
    Pause,
    PlayArrow,
    Repeat,
    RepeatOne,
    Shuffle,
    SkipNext,
    SkipPrevious,
    VolumeDown,
    VolumeOff
} from '@mui/icons-material';
import {PlayMode, useMusicStore} from "../store/MusicStore.ts";
import {fromSstoTime} from "../utils/MusicDataUtil.ts";
import RoundedIconButton from "./RoundedIconButton.tsx";
import {SliderStyles} from "../css/CommonStyle.ts";
import {useState} from "react";
import {PlayerDetail} from "./PlayerDetail.tsx";
import {useNavigate} from "react-router-dom";

function GlobalPlayer() {
    const currentSong = useMusicStore(state => state.currentMusicData);
    const navigate = useNavigate()
    return (currentSong !== null && currentSong !== undefined &&
        <Box sx={{
            position: "fixed",
            bottom: 0,
            left: 0,
            width: "100vw",
            height: `6rem`,
            backgroundColor: (theme) => theme.palette.background.paper,
            zIndex: (theme) => theme.zIndex.drawer,
        }}>
            <Box padding={2} sx={{display: 'flex', alignItems: 'center', width: '100%', m: 'auto'}}>
                <Box sx={{display: 'flex', alignItems: 'center'}} flex={1}>
                    <img src={currentSong?.al?.picUrl} alt={currentSong?.name} width={64} height={64}/>
                    <Box sx={{display: 'flex', flexDirection: 'column'}} ml={2}>
                        <Typography fontSize={14}>{currentSong?.name}</Typography>
                        <Typography variant="body2" color="text.secondary" noWrap
                                    textTransform="capitalize">
                            {currentSong?.ar.map((artist, index) => (
                                <span key={artist.id || artist.name}>
                                                    <Link
                                                        underline="hover"
                                                        color="textSecondary"
                                                        variant="caption"
                                                        onClick={() => {
                                                            navigate('/artist/' + artist.id)
                                                        }}
                                                        sx={{
                                                            '&:hover':{
                                                                cursor: 'pointer',
                                                            }
                                                        }}
                                                    >
                                                        {artist.name}
                                                    </Link>
                                    {index < currentSong?.ar.length - 1 && ' / '}
                                </span>
                            ))}
                        </Typography>
                    </Box>
                </Box>
                <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}} flex={4}>
                    <MusicMainController/>
                    <Box sx={{display: 'flex', flexDirection: 'row', width: '50%', alignItems: 'center'}}>
                        <MusicSlider/>
                    </Box>
                </Box>
                <Box flex={1}>
                    <RightController/>
                </Box>
            </Box>
        </Box>
    )
        ;
}

export function MusicMainController() {
    const paused = useMusicStore(state => state.paused);
    const pauseOrPlay = useMusicStore(state => state.pauseOrPlay);
    const playNext = useMusicStore(state => state.playNext);
    const playPrev = useMusicStore(state => state.playPrev);
    return <>
        <Box sx={{display: 'flex', flexDirection: 'row', gap: 2, alignItems: 'center'}}>
            <RoundedIconButton icon={<SkipPrevious/>} onClick={() => {
                playPrev()
            }}/>
            <RoundedIconButton icon={paused ? <PlayArrow/> : <Pause/>} onClick={() => {
                pauseOrPlay()
            }}/>
            <RoundedIconButton icon={<SkipNext/>} onClick={() => {
                playNext()
            }}/>
        </Box></>
}

export function MusicSlider() {
    const currentTime = useMusicStore(state => state.currentTime);
    const duration = useMusicStore(state => state.duration);
    const seek = useMusicStore(state => state.seek);
    return <>
        <Typography sx={{mr: 1, fontSize: 12}}>{fromSstoTime(currentTime)}</Typography>
        <Slider
            size="small"
            aria-label="audio progress"
            min={0}
            max={duration}
            value={currentTime}
            onChange={(_e, newValue) => {
                seek(newValue);
            }}
            sx={SliderStyles}
        />

        <Typography sx={{ml: 1, fontSize: 12}}>{fromSstoTime(duration)}</Typography>
    </>
}

export function RightController({canExpand = true}: { canExpand?: boolean }) {
    const playMode = useMusicStore(state => state.playMode);
    const changePlayMode = useMusicStore(state => state.changePlayMode);
    const volume = useMusicStore(state => state.volume);
    const changeVolume = useMusicStore(state => state.changeVolume);

    const [prevVolume, setPrevVolume] = useState(volume)
    const [expandDetail, setExpandDetail] = useState<boolean>(false)
    return <>
        <PlayerDetail expand={expandDetail} setExpand={setExpandDetail}/>
        <Stack direction="row" spacing={2} alignItems={"center"}>
            <RoundedIconButton
                icon={playMode === PlayMode.SHUFFLE ? <Shuffle/> : playMode === PlayMode.REPEAT ? <Repeat/> :
                    <RepeatOne/>} onClick={() => {
                changePlayMode()
            }}/>
            <RoundedIconButton icon={volume === 0 ? <VolumeOff/> : <VolumeDown/>} onClick={() => {
                if (volume > 0) {
                    changeVolume(0);
                } else {
                    changeVolume(prevVolume);
                }
            }}/>
            <Slider
                size="small"
                aria-label="audio progress"
                min={0}
                step={0.01}
                value={volume}
                max={1}
                onChange={(_e, newValue) => {
                    setPrevVolume(volume);
                    changeVolume(newValue);
                }}
                sx={SliderStyles}
            />
            {canExpand && <RoundedIconButton icon={<KeyboardArrowUp/>} onClick={() => {
                setExpandDetail(true)
            }}/>}
        </Stack>
    </>
}

export default GlobalPlayer;
