import { Outlet } from "react-router-dom";
import Header from "../header/Header";
import Main from "../main/Main";


const AppLayout = () => {
    return <div style={{
        padding: '50px 0px 0px 370px'
    }}>
        <Header />
        <Main />
        <Outlet />
    </div>;
};

export default AppLayout;
