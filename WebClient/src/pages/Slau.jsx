import React from "react";
import FillButtonBack from "../components/FillButtonBack";
import FillButton from "../components/FillButton";

const Slau = () => {
    return (
        <div className="wrapper" style={{
            width: "98%",
            padding: "2rem",
            overflow: "hidden",
            display: "grid",
            gridTemplateColumns: "30% 30% 30%",
            gap: "2rem" }}>
            <div className="sidebar">
                <FillButtonBack />
                <h1 style={{ letterSpacing: "0.35rem" }}>СЛАУ</h1>
                <div className="sidebar-body">
                    
                </div>
            </div>
        </div>
    )
}

export default Slau