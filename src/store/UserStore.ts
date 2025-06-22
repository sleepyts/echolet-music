import {create} from "zustand";
import {persist, type PersistOptions} from "zustand/middleware";
import type {Profile} from "../api/user/UserAccountResponse.ts";

interface UserState {
    userProfile: Profile | undefined

    isLoggedIn: boolean
}

interface UserActions {

    login: (userProfile: Profile, afterLogin: () => void) => void;

    notLoggedIn: () => void;
}


export const useUserStore = create<UserState & UserActions, [["zustand/persist", PersistOptions<UserState>]]>(
    persist<UserState & UserActions, [], [], PersistOptions<UserState>>((set, get) => ({
            userProfile: undefined,
            isLoggedIn: false,
            login: (userProfile, afterLogin = () => {
            }) => {
                set(() => ({userProfile, isLoggedIn: true}));
                afterLogin();
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