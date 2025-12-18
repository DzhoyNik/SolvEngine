import { useEffect } from "react";

const useNotifyHostOnCheckFunction = ( funToCheck, callback ) => {
    useEffect(() => {
        if (!funToCheck) return

        if (window.chrome && window.chrome.webview) {
            const msg = {
                type: "checkFunction",
                seq: 200,
                fun: funToCheck
            }

            const HandleMessage = (event) => {
                let data
                try {
                    if (typeof event.data === "string") {
                        data = JSON.parse(event.data)
                    } else {
                        data = event.data
                    }

                    if (data.seq === msg.seq && data.type === "functionResult") {
                        callback(data.points)
                    }
                } catch (e) {
                    console.error("Invalid message from host", e);
                }
            }

            window.chrome.webview.addEventListener("message", HandleMessage)
            window.chrome.webview.postMessage(JSON.stringify(msg))

            return () => {
                window.chrome.webview.removeEventListener("message", HandleMessage)
            }
        }
    }, [funToCheck, callback])
}

export default useNotifyHostOnCheckFunction