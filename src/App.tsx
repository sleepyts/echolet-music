import {RouterProvider} from "react-router-dom";
import {AppRouter} from "./router/AppRouter.tsx";
import {useMusicStore} from "./store/MusicStore.ts";
import {useEffect} from "react";

function App() {
    const whenRefreshed = useMusicStore((state) => state.whenRefreshed);
    useEffect(() => {
        whenRefreshed();
    })

    return (
        <>
            <RouterProvider router={AppRouter}/>
        </>
    )
}

export default App
