import {useLocation, useNavigate} from "react-router-dom";
import {useEffect, useRef, useState} from "react";

export function useNavigationStack(limit = 50) {
    const navigate = useNavigate();
    const location = useLocation();

    const stackRef = useRef<string[]>([]);
    const pointerRef = useRef<number>(-1);

    const [canGoBack, setCanGoBack] = useState(false);
    const [canGoForward, setCanGoForward] = useState(false);

    // 每次 location 变化时加入栈
    useEffect(() => {
        const path = location.pathname + location.search;
        const current = stackRef.current[pointerRef.current];

        if (path !== current) {
            stackRef.current = stackRef.current.slice(0, pointerRef.current + 1);
            stackRef.current.push(path);

            if (stackRef.current.length > limit) {
                stackRef.current.shift();
            } else {
                pointerRef.current++;
            }

            updateControls();
        }
    }, [location]);

    const updateControls = () => {
        setCanGoBack(pointerRef.current > 0);
        setCanGoForward(pointerRef.current < stackRef.current.length - 1);
    };

    const goBack = () => {
        if (pointerRef.current > 0) {
            pointerRef.current--;
            navigate(stackRef.current[pointerRef.current]);
            updateControls();
        }
    };

    const goForward = () => {
        if (pointerRef.current < stackRef.current.length - 1) {
            pointerRef.current++;
            navigate(stackRef.current[pointerRef.current]);
            updateControls();
        }
    };

    return {
        goBack,
        goForward,
        canGoBack,
        canGoForward,
        historyStack: stackRef.current,
    };
}
