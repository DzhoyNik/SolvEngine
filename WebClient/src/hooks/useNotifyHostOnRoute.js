import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const useNotifyHostOnRoute = ( getTargetSize ) => {
    const location = useLocation()

    useEffect(() => {
        const target = getTargetSize(location) || {}

        if (target.fullScreen) {
            const msg = { type: "fullScreen", seq: 100 }
            window.chrome?.webview?.postMessage(JSON.stringify(msg))
        } else {
            const msg = { type: "exitFullScreen", seq: 101 }
            window.chrome?.webview?.postMessage(JSON.stringify(msg))

            const resizeMsg = {
                type: "resizeWindow",
                seq: 102,
                width: target.width ?? null,
                height: target.height ?? null,
                durationMs: target.durationMs ?? 350
            }

            window.chrome?.webview?.postMessage(JSON.stringify(resizeMsg))
        }
    }, [ location, getTargetSize ])
}

export default useNotifyHostOnRoute