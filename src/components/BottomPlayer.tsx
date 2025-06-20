// src/components/GlobalPlayer.tsx
import {Box, Slider, Typography} from '@mui/material';
import {Pause, PlayArrow, SkipNext, SkipPrevious} from '@mui/icons-material';
import {useMusicStore} from "../store/MusicStore.ts";
import {fromSstoTime} from "../utils/MusicDataUtil.ts";
import RoundedIconButton from "./RoundedIconButton.tsx";

function GlobalPlayer() {
    const currentSong = useMusicStore(state => state.currentMusicData);
    const currentTime = useMusicStore(state => state.currentTime);
    const duration = useMusicStore(state => state.duration);
    const seek = useMusicStore(state => state.seek);
    const paused = useMusicStore(state => state.paused);
    const pauseOrPlay = useMusicStore(state => state.pauseOrPlay);
    const playNext = useMusicStore(state => state.playNext);
    const playPrev = useMusicStore(state => state.playPrev);
    return (currentSong !== null &&
        <Box sx={{
            position: "fixed",
            bottom: 0,
            left: 0,
            width: "100%",
            height: `6rem`,
            backgroundColor: (theme) => theme.palette.background.default,
            zIndex: (theme) => theme.zIndex.drawer,
        }}>
            <Box padding={2} sx={{display: 'flex', alignItems: 'center'}}>
                <Box sx={{display: 'flex', alignItems: 'center'}} flex={0.5}>
                    <img src={currentSong?.al.picUrl} alt={currentSong?.name} width={64} height={64}/>
                    <Box sx={{display: 'flex', flexDirection: 'column'}}>
                        <Typography sx={{marginLeft: 2, fontSize: 12}}>{currentSong?.name}</Typography>
                        <Typography
                            sx={{
                                marginLeft: 2,
                                fontSize: 10
                            }}><a>{currentSong?.ar.map(a => a.name).join(' / ')}</a></Typography>
                    </Box>
                </Box>
                <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}} flex={2}>
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
                    </Box>
                    <Box sx={{display: 'flex', flexDirection: 'row', width: '50%', alignItems: 'center'}}>
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
                            sx={{
                                width: '100%',
                                '& .MuiSlider-track': {
                                    border: 'none',
                                    borderRadius: 2,
                                },
                                '& .MuiSlider-rail': {
                                    opacity: 0.3,
                                    borderRadius: 2,
                                },
                                '&:hover .MuiSlider-thumb': {
                                    width: 6,
                                    height: 6,
                                },
                                '& .MuiSlider-thumb': {
                                    width: 0,
                                    height: 0,
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                                    transition: 'width 0.2s ease, height 0.2s ease, box-shadow 0.3s ease',
                                    '&:hover, &.Mui-focusVisible, &.Mui-active': {
                                        width: 6,
                                        height: 6,
                                        boxShadow: '0 4px 8px rgba(0,0,0,0.4)',
                                    },
                                    '&::before': {
                                        display: 'none',
                                    },
                                },
                            }}
                        />

                        <Typography sx={{ml: 1, fontSize: 12}}>{fromSstoTime(duration)}</Typography>
                    </Box>
                </Box>
            </Box>
        </Box>
    )
        ;
}


export default GlobalPlayer;
