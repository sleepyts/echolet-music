import {RouterProvider} from "react-router-dom";
import {AppRouter} from "./router/AppRouter.tsx";
import {useMusicStore} from "./store/MusicStore.ts";
import {useEffect} from "react";
import {getAccountInfo} from "./api/user/userApis.ts";
import {useUserStore} from "./store/UserStore.ts";

function App() {
    const whenRefreshed = useMusicStore((state) => state.whenRefreshed);
    const login = useUserStore((state) => state.login);
    const notLoggedIn = useUserStore((state) => state.notLoggedIn);
    useEffect(() => {
        whenRefreshed();
    })

    useEffect(() => {
        getAccountInfo().then((res) => {
            if (res.profile !== null && res.profile !== undefined) {
                login(res.profile, () => {
                });
            } else {
                notLoggedIn();
            }
        })
    }, []);

    return (
        <>
            <RouterProvider router={AppRouter}/>
        </>
    )
}

export default App
