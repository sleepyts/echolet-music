import {create} from "zustand";
import {persist, type PersistOptions} from "zustand/middleware";
import i18n from "i18next";

interface SettingsState {
    language: string;
}

interface SettingsAction {

    setLanguage: (language: string) => void;
}

export const useSettingsStore = create<SettingsState & SettingsAction, [["zustand/persist", PersistOptions<SettingsState>]]>(
    persist<SettingsState & SettingsAction, [], [], PersistOptions<SettingsState>>(
        (set) => ({
            language: "zh-CN",

            setLanguage: (language) => {

                i18n.changeLanguage(language).then(() => {
                    window.location.reload();
                })
                set(() => ({language}))
            }
        }),
        {
            partialize: (state) => ({
                name: "settings-store",
                version: 1,
                language: state.language
            }),
            name: "settings-store"
        }
    )
)