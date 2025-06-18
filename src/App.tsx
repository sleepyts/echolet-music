import {RouterProvider} from "react-router-dom";
import {AppRouter} from "./router/AppRouter.tsx";

function App() {

    return (
        <RouterProvider router={AppRouter}/>
    )
}

export default App
