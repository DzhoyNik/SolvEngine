import Dichotomy from "./pages/Dichotomy"
import GoldSection from "./pages/GoldSection"
import Interval from "./pages/Interval"
import Menu from "./pages/Menu"
import Newton from "./pages/Newton"
import Slau from "./pages/Slau"
import Sort from "./pages/Sort"
import { DICHOTOMY_ROUTE, GOLDSECTION_ROUTE, INTERVAL_ROUTE, MENU_ROUTE, NEWTON_ROUTE, SLAU_ROUTE, SORT_ROUTE } from "./utils/consts"

export const publicRoutes = [
    { path: MENU_ROUTE, Component: Menu },
    { path: DICHOTOMY_ROUTE, Component: Dichotomy },
    { path: SLAU_ROUTE, Component: Slau },
    { path: GOLDSECTION_ROUTE, Component: GoldSection },
    { path: NEWTON_ROUTE, Component: Newton },
    { path: SORT_ROUTE, Component: Sort },
    { path: INTERVAL_ROUTE, Component: Interval }
]