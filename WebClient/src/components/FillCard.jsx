import React, { useRef } from "react";
import "../style/FillCard.css"

const FillCard = ({ children }) => {
    const cardRef = useRef(null)

    const HandleMouseMove = (e) => {
        const card = cardRef.current
        const rect = card.getBoundingClientRect()
        
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top

        card.style.setProperty("--x", `${x}px`)
        card.style.setProperty("--y", `${y}px`)
    }

    return (
        <div
            ref={cardRef}
            onMouseMove={HandleMouseMove}
            className="fill-card"
            style={{ 
                    overflow: "hidden",
                    width: "100%",
                    height: "100%"
                }}
        >
            {children}
        </div>
    )
}

export default FillCard