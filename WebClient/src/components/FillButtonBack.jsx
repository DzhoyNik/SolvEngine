import React, { useRef } from "react";
import "../style/FillButton.css"
import { useNavigate } from "react-router-dom";
import { MENU_ROUTE } from "../utils/consts";

const FillButtonBack = () => {
    const buttonRef = useRef(null)
    const navigate = useNavigate()

    const HandleMouseMove = (e) => {
        const button = buttonRef.current
        const rect = button.getBoundingClientRect()
        
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top

        button.style.setProperty("--x", `${x}px`)
        button.style.setProperty("--y", `${y}px`)
    }

    const HandleMouseClick = () => {
        navigate(MENU_ROUTE)
    }

    return (
        <button
            ref={buttonRef}
            onMouseMove={HandleMouseMove}
            onClick={HandleMouseClick}
            className="fill-button fill-back"
        >
            <span>Назад</span>
        </button>
    )
}

export default FillButtonBack