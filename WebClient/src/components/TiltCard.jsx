import React, { useRef } from "react";

const TiltCard = ({ children, maxTilt = 5 }) => {
    const cardRef = useRef(null)

    const HandleMouseMove = (e) => {
        const card = cardRef.current
        const rect = card.getBoundingClientRect()

        const x = e.clientX - rect.left
        const y = e.clientY - rect.top

        const centerX = rect.width / 2
        const centerY = rect.height / 2

        const rotateX = -((y - centerY) / centerY) * maxTilt
        const rotateY = -((centerX - x) / centerX) * maxTilt

        card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
    }

    const HandleMouseLeave = () => {
        const card = cardRef.current
        card.style.transform = "rotateX(0deg) rotateY(0deg)"
        card.style.transition = "transform 0.3s ease"
        setTimeout(() => (card.style.transition = ""), 300)
    }

    return(
        <div style={{ overflow: "hidden", borderRadius: "15px", perspective: "1000px", display: "inline-block" }}>
            <div
                ref={cardRef}
                onMouseMove={HandleMouseMove}
                onMouseLeave={HandleMouseLeave}
                style={{
                    overflow: "hidden",
                    width: "100%",
                    height: "100%",
                    borderRadius: "15px",
                    transition: "transform 0.1s ease",
                    transformStyle: "preserve-3d"
                }}
            >
                {children}    
            </div>
        </div>
    )
}

export default TiltCard