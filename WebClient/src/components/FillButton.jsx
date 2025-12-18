import React, { useRef } from "react";
import "../style/FillButton.css"

const FillButton = ({ children, onClick }) => {
    const buttonRef = useRef(null)

    const HandleMouseMove = (e) => {
        const button = buttonRef.current
        const rect = button.getBoundingClientRect()
        
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top

        button.style.setProperty("--x", `${x}px`)
        button.style.setProperty("--y", `${y}px`)
    }

    return (
        <button
            ref={buttonRef}
            onMouseMove={HandleMouseMove}
            onClick={onClick}
            className="fill-button"
        >
            <span>{children}</span>
        </button>
    )
}

export default FillButton