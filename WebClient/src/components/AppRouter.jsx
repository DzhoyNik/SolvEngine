import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { publicRoutes } from "../routes";

const AppRouter = () => {
    const location = useLocation()
    
    return(
        <Routes location={location} key={location.pathname}>
            {publicRoutes.map(({path, Component}) =>
                <Route key={path} path={path} element={<Component />} exact />
            )}
        </Routes>
    )
}

export default AppRouter