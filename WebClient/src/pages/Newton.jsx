import React, { useEffect, useState } from "react";
import FillButtonBack from "../components/FillButtonBack";
import FillButton from "../components/FillButton";
import LineChart from "../components/chart/LineChart";
import toast from "react-hot-toast";

const Newton = () => {
    const [ fun, setFun ] = useState("")
    const [ approach, setApproach ] = useState("")
    const [ ratioA, setRatioA ] = useState("")
    const [ ratioB, setRatioB ] = useState("")
    const [ epsilon, setEpsilon ] = useState("")
    const [ points, setPoints ] = useState([])
    const [ highlightPoint, setHighlightPoint ] = useState(null)

    const isValidFun = (f) => {
        try {
            return /^[0-9x\+\-\*\/\^\(\)e\.a-z]+$/i.test(f);
        } catch {
            return false
        }
    }
    
    useEffect(() => {
        if (!fun || !isValidFun(fun)) return

        const timer = setTimeout(() => {
            drawFunction(fun)
        }, 1000)

        return () => clearTimeout(timer)
    }, [fun])

    useEffect(() => {
        if (!window.chrome?.webview) return;

        const handler = (event) => {
            const msg = event.data
            console.log(event.data)
            if (!msg) return

            switch (msg.type) {
                case "DRAW_RESULT":
                    const receivedPoints = event.data?.payload?.points || []
                    setPoints(receivedPoints.map(pt => ({ x: pt["Item1"], y: pt["Item2"] })))
                    break

                case "NEWTON_RESULT":
                    const pt = event.data.payload
                    setHighlightPoint({ x: pt.x, y: pt.y })
                    break

                case "NEWTON_RESULT_ERROR":
                    toast.error(event.data.payload.message)
                    break

                default:
                    toast.error("Unknown message type: ", msg.type)
            }
        }

        window.chrome.webview.addEventListener("message", handler)

        return () => {
            window.chrome.webview.removeEventListener("message", handler)
        }
    }, [])
    
    const drawFunction = async (func) => {
        const data = {
            type: "DRAW_FUNCTION",
            payload: {
                "function": func
            }
        }

        await window.chrome.webview.postMessage(JSON.stringify(data))
    }

    const handleSolve = () => {
        if (!fun || !approach || !epsilon) return toast.error("Заполните данные")
        if (Number(epsilon) > 0.98) return toast.error("Точность не может быть больше 1")
        
        const data = {
            type: "FIND_POINT_NEWTON",
            payload: {
                "function": fun,
                "ratioA": Number(ratioA),
                "ratioB": Number(ratioB),
                "approach": Number(approach),
                "epsilon": Number(epsilon),
            }
        }
        try {
            window.chrome.webview.postMessage(JSON.stringify(data))
        } catch (e) {
            console.log(e)
        }
    }

    const handleClearAll = () => {
        setFun("")
        setApproach("")
        setRatioA("")
        setRatioB("")
        setEpsilon("")
        setPoints([])
        setHighlightPoint(null)
    }

    return (
        <div className="wrapper" style={{
            width: "98%",
            padding: "2rem",
            overflow: "hidden",
            display: "grid",
            gridTemplateColumns: "30% 70%",
            gap: "2rem" }}>
            <div className="sidebar">
                <FillButtonBack />
                <h1 style={{ letterSpacing: "0.35rem" }}>Метод Ньютона</h1>
                <div className="sidebar-body">
                    <div className="sidebar-section">
                        <h2>Введите функцию*</h2>
                        <input type="text" placeholder="x^2+10*x-9" value={fun} onChange={ e => setFun(e.target.value)} />
                    </div>
                    <div className="sidebar-section">
                        <h2>Введите интервал*</h2>
                        <div style={{
                            width: "100%",
                            display: "grid",
                            gridTemplateColumns: "repeat(2, 1fr)",
                            gap: "2rem"
                        }}>
                            <input type="text" placeholder="A" style={{ width: "100%", textAlign: "center" }} value={ratioA} onChange={ e => setRatioA(e.target.value) } />
                            <input type="text" placeholder="B" style={{ width: "100%", textAlign: "center" }} value={ratioB} onChange={ e => setRatioB(e.target.value) } />
                        </div>
                        <h2>Начальное приближение*</h2>
                        <input type="text" placeholder="25" value={approach} onChange={ e => setApproach(e.target.value)} />
                    </div>
                    <div className="sidebar-section">
                        <h2>Введите точность*</h2>
                        <input type="text" placeholder="0.001" value={epsilon} onChange={ e => setEpsilon(e.target.value)} />
                    </div>
                    <div className="sidebar-section">
                        <h2>Ответ</h2>
                        <div style={{
                            width: "100%",
                            display: "grid",
                            gridTemplateColumns: "repeat(2, 1fr)",
                            gap: "2rem"
                        }}>
                            <input
                                type="text"
                                placeholder="X"
                                style={{ width: "100%", textAlign: "center" }}
                                disabled
                                value={highlightPoint ? highlightPoint.x : ""}
                            />
                            <input
                                type="text"
                                placeholder="Y"
                                style={{ width: "100%", textAlign: "center" }}
                                disabled
                                value={highlightPoint ? highlightPoint.y : ""}
                            />
                        </div>
                    </div>
                </div>
                <FillButton onClick={handleSolve}>Рассчитать</FillButton>
                <FillButton onClick={handleClearAll}>Очистить</FillButton>
            </div>
            <div className="chart">
                <LineChart points={points} ratioA={ratioA} ratioB={ratioB} highlightPoint={highlightPoint} />
            </div>
        </div>
    )
}

export default Newton