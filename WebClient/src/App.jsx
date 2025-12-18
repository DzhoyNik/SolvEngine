import React, { useEffect, useState } from "react";
import { BrowserRouter } from "react-router-dom";
import AppRouter from "./components/AppRouter";
import useNotifyHostOnRoute from "./hooks/useNotifyHostOnRoute";
import { Toaster, toast } from "react-hot-toast";

const getSizeForRoute = ( location ) => {
    switch (location.pathname) {
        case "/":
            return { width: 900, height: 600, durationMs: 350, fullScreen: false }
        
        default:
            return { fullScreen: true }
    }
}

const App = () => {
    const [msg, setMsg] = useState("No messages yet")
    
    useEffect(() => {
        window.onHostMessage = (data) => {
            console.log(`From host: ${data}`)
            setMsg(JSON.stringify(data))
        }

        const askHost = () => {
            if (window.chrome && window.chrome.webview) {
                window.chrome.webview.postMessage(JSON.stringify({ type: "getData", seq: 1 }))
            }
        }

        askHost()
    }, [])

    const AppContent = () => {
        useNotifyHostOnRoute(getSizeForRoute)
        return (
            <>
                <AppRouter />
                <Toaster position="top-center" toastOptions={{
                    success: {
                    style: {
                        background: 'green',
                    },
                    },
                    error: {
                    style: {
                        color: "#fff",
                        background: '#1c1c1cff',
                    },
                    },
                }} />
            </>
        )
    }

    return (
        <BrowserRouter>
            <AppContent />
        </BrowserRouter>
    )
}

export default App