import React from "react";
import Logo from "../assets/solvengine.png"
import TiltCard from "../components/TiltCard";
import FillCard from "../components/FillCard";
import { NavLink, useNavigate } from "react-router-dom";
import { DICHOTOMY_ROUTE, GOLDSECTION_ROUTE, INTERVAL_ROUTE, NEWTON_ROUTE, SLAU_ROUTE, SORT_ROUTE } from "../utils/consts";

const Menu = () => {
    const navigate = useNavigate()

    const HandleNavigate = (route) => {
        navigate(route)
    }

    return(
        <div className="wrapper">
            <div className="topbar">
                <img src={Logo} />
            </div>
            <div className="wrapper-body">
                <NavLink to={DICHOTOMY_ROUTE}>
                    <TiltCard>
                        <FillCard>
                            <div className="section">
                                <h1>Метод Дихотомии</h1>
                            </div>
                        </FillCard>
                    </TiltCard>
                </NavLink>
                <NavLink to={SLAU_ROUTE}>
                    <TiltCard>
                        <FillCard>
                            <div className="section">
                                <h1>СЛАУ</h1>
                            </div>
                        </FillCard>
                    </TiltCard>
                </NavLink>
                <NavLink to={GOLDSECTION_ROUTE}>
                    <TiltCard>
                        <FillCard>
                            <div className="section">
                                <h1>Метод Золотого Сечения</h1>
                            </div>
                        </FillCard>
                    </TiltCard>
                </NavLink>
                <NavLink to={NEWTON_ROUTE}>
                    <TiltCard>
                        <FillCard>
                            <div className="section">
                                <h1>Метод Ньютона</h1>
                            </div>
                        </FillCard>
                    </TiltCard>
                </NavLink>
                <NavLink to={SORT_ROUTE}>
                    <TiltCard>
                        <FillCard>
                            <div className="section">
                                <h1>Сортировка</h1>
                            </div>
                        </FillCard>
                    </TiltCard>
                </NavLink>
                <NavLink to={INTERVAL_ROUTE}>
                    <TiltCard>
                        <FillCard>
                            <div className="section">
                                <h1>Интеграл</h1>
                            </div>
                        </FillCard>
                    </TiltCard>
                </NavLink>
            </div>
        </div>
    )
}

export default Menu