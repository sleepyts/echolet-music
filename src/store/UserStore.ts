import {create} from "zustand";
import {persist, type PersistOptions} from "zustand/middleware";
import type {Profile} from "../api/user/UserAccountResponse.ts";
import {logout} from "../api/user/userApis.ts";

interface UserState {
    userProfile: Profile | undefined

    isLoggedIn: boolean
}

interface UserActions {

    login: (userProfile: Profile, afterLogin: () => void) => Promise<void>;

    logout: () => void;

    notLoggedIn: () => void;
}


export const useUserStore = create<UserState & UserActions, [["zustand/persist", PersistOptions<UserState>]]>(
    persist<UserState & UserActions, [], [], PersistOptions<UserState>>((set, get) => ({
            userProfile: undefined,
            isLoggedIn: false,

            login: (userProfile, afterLogin = () => {
            }) => {
                return new Promise((resolve) => {
                    set(() => ({userProfile: userProfile, isLoggedIn: true}));
                    // 使用微任务队列确保回调在状态设置之后
                    queueMicrotask(() => {
                        afterLogin();
                        resolve();
                    });
                });
            },
            logout: () => {
                logout().then(() => {
                    document.cookie = "MUSIC_U=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=.music.163.com";
                    document.cookie = "NMTID=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=.music.163.com";
                    get().notLoggedIn()
                })
            },

            notLoggedIn: () => {
                set(() => ({userProfile: undefined, isLoggedIn: false}));
            }

        }),

        {
            name: "user-store",
            version: 1,
            partialize: (state) => ({
                userProfile: state.userProfile,
                isLoggedIn: state.isLoggedIn,
                name: "user-store",
            })

        }
    )
)