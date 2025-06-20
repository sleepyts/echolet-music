import {create} from "zustand";

import {getMusicData} from "../api/track/songApis.ts";
import type {Song} from "../api/track/SongDetailResponse.ts";

const GlobalAudio = new Audio();

interface MusicState {

    currentPlaylistId: number;

    currentMusicData: Song | undefined;
}


interface MusicAction {
    setCurrentMusicData: (currentMusicData: Song) => void;

    setCurrentPlaylistId: (id: number) => void;
}

interface AudioState {
    currentTime: number;
    duration: number;
    paused: boolean;
    volume: number;
}

interface AudioAction {

    readyForNext: () => void;

    pauseOrPlay: () => void;

    start: () => void;
}

export const useMusicStore = create<MusicState & MusicAction & AudioAction & AudioState>((set, get) => ({
    currentPlaylistId: 0,
    currentTime: 0,
    currentMusicData: undefined,
    duration: 0,
    paused: true,
    volume: 1,

    setCurrentMusicData: (newData: Song) => {
        set(() => ({
            currentMusicData: newData,
        }))
    },

    setCurrentPlaylistId: (id: number) => set(() => ({
        currentPlaylistId: id,
    })),

    readyForNext: () => {
        GlobalAudio.pause()
        GlobalAudio.currentTime = 0
        GlobalAudio.src = ""
        GlobalAudio.load()
        set(() => ({
            currentTime: 0,
            duration: 0,
            paused: true,
        }))
    },
    pauseOrPlay: () => {
        if (GlobalAudio.paused) {
            GlobalAudio.play().then(() => {
                set(() => ({
                    paused: false,
                }))
            })
        } else {
            GlobalAudio.pause()
            set(() => ({
                paused: true,
            }))
        }
    },

    start: () => {
        const currentMusicData = get().currentMusicData;
        if (!currentMusicData) return;
        get().readyForNext()
        getMusicData([currentMusicData.id]).then((musicData) => {
            const url = musicData.data[0].url
            GlobalAudio.src = url
            GlobalAudio.load()
            GlobalAudio.play().then(() => {

            })

        })
    }
}))