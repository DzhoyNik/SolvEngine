import React, { useEffect, useState } from "react";
import "../style/sort.css";
import FillButton from "../components/FillButton";
import FillButtonBack from "../components/FillButtonBack";
import BarChart from "../components/chart/BarChart";
import toast from "react-hot-toast";

const Sort = () => {
    const [inputValue, setInputValue] = useState("");
    const [counts, setCounts] = useState([]);
    const [sort, setSort] = useState({
        bubble: false,
        insert: false,
        shaker: false,
        quick: false,
        bogo: false,
    });
    const [sortedResults, setSortedResults] = useState({});
    const [sortTimes, setSortTimes] = useState({});
    const [ascending, setAscending] = useState(true); // Новое состояние направления

    useEffect(() => {
        if (!window.chrome?.webview) return;

        const handler = (event) => {
            const msg = event.data;
            if (!msg) return;

            switch (msg.type) {
                case "SORT_RESULT":
                    setSortedResults(msg.payload.results);
                    setSortTimes(msg.payload.times);
                    toast.removeAll();
                    toast.success("Сортировка завершена!");
                    break;
                default:
                    toast.error("Unknown message type: ", msg.type);
            }
        };

        window.chrome.webview.addEventListener("message", handler);

        return () => {
            window.chrome.webview.removeEventListener("message", handler);
        };
    }, []);

    const selectedSorts = Object.entries(sort)
        .filter(([_, isActive]) => isActive)
        .map(([name]) => name);

    const sortLabels = {
        bubble: "Пузырьковая",
        insert: "Вставками",
        shaker: "Шейкерная",
        quick: "Быстрая",
        bogo: "BOGO",
    };

    const toggleSort = (type) => {
        setSort((prev) => ({
            ...prev,
            [type]: !prev[type],
        }));
    };

    const updateCounts = () => {
        const array = inputValue
            .split(",")
            .map((item) => item.trim())
            .filter((item) => item !== "")
            .map(Number);
        setCounts(array);
    };

    const handleSort = () => {
        if (!counts.length) return toast.error("Заполните данные");
        if (selectedSorts.length === 0) return toast.error("Выберите метод сортировки");

        const data = {
            type: "SORT_ARRAY",
            payload: {
                Array: counts,
                Methods: selectedSorts,
                Ascending: ascending,
            },
        };

        toast.loading("Сортировка началась...");

        try {
            window.chrome.webview.postMessage(JSON.stringify(data));
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <div
            className="wrapper"
            id="sort"
            style={{
                width: "98%",
                padding: "2rem",
                overflow: "hidden",
                display: "grid",
                gridTemplateColumns: "30% 70%",
                gap: "2rem",
            }}
        >
            <div className="sidebar" style={{ overflowY: "scroll" }}>
                <FillButtonBack />
                <h1 style={{ letterSpacing: "0.35rem" }}>Сортировки</h1>
                <div className="sidebar-body">
                    <div className="sidebar-section">
                        <h2>Введите список*</h2>
                        <input
                            type="text"
                            placeholder="Введите список"
                            value={inputValue}
                            onChange={(e) =>
                                setInputValue(
                                    e.target.value.replace(/[^0-9, ]/g, "")
                                )
                            }
                            onBlur={updateCounts}
                        />
                    </div>
                    <div className="sidebar-section">
                        <h2>Направление сортировки*</h2>
                        <div style={{ display: "flex", justifyContent: "center", gap: "2rem", color: "#fff" }}>
                            <label>
                                <input
                                    type="radio"
                                    checked={ascending}
                                    onChange={() => setAscending(true)}
                                />{" "}
                                По возрастанию
                            </label>
                            <br />
                            <label>
                                <input
                                    type="radio"
                                    checked={!ascending}
                                    onChange={() => setAscending(false)}
                                />{" "}
                                По убыванию
                            </label>
                        </div>
                    </div>
                    <div className="sidebar-section">
                        <h2>Способ сортировки*</h2>
                        {Object.keys(sort).map((key) => (
                            <div
                                key={key}
                                className={`way-section ${
                                    sort[key] ? "active" : ""
                                }`}
                                onClick={() => toggleSort(key)}
                            >
                                <h2>{sortLabels[key]}</h2>
                            </div>
                        ))}
                    </div>
                </div>
                <FillButton onClick={handleSort}>Отсортировать</FillButton>
            </div>
            <div className="chart">
                <div className="chart-section chart-top">
                    <h2>Исходный список</h2>
                    <div className="chart-original">
                        <BarChart counts={counts} />
                    </div>
                    <h2>Отсортированные списки</h2>
                    <div className="chart-list">
                        {selectedSorts.map((sortType) => (
                            <BarChart
                                key={sortType}
                                counts={sortedResults?.[sortType] || []}
                            />
                        ))}
                    </div>
                </div>
                <div className="chart-section chart-bottom">
                    <h2>Время сортировки</h2>
                    <div className="chart-stats">
                        <div className="stats-chart">
                            <BarChart
                                labels={selectedSorts.map(
                                    (type) => sortLabels[type]
                                )}
                                counts={selectedSorts.map(
                                    (type) => sortTimes?.[type] || 0
                                )}
                                axis="y"
                            />
                        </div>
                        <div className="stats-text">
                            {selectedSorts.map((sortType) => (
                                <div key={sortType}>
                                    <h2>• {sortLabels[sortType]}</h2>
                                    <p>{sortTimes?.[sortType] || 0} ms</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sort;
