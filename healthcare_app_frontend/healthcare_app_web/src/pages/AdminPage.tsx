import {useState} from "react";
import {Box, Stack} from "@mui/material";
import TabAdminComponent from "../components/TabAdminComponent.tsx"
import DashboardAdminComponent from "../components/admin/DashboardAdminComponent.tsx";
import UsersAdminComponent from "../components/admin/UsersAdminComponent.tsx";
import AppointmentsAdminComponent from "../components/admin/AppointmentsAdminComponent.tsx";

function AdminPage({adminLanguage}: { adminLanguage: object }) {

    const [tab, setTab] = useState<string>("dashboard");

    return (
        <Stack direction={"row"} className="">
            <Box sx={{width: "200px", height: "100%"}}>
                <TabAdminComponent tab={tab} setTab={setTab} tabsLanguage={adminLanguage.tabs}/>
            </Box>
            <Box className={"container-fluid ms-5 w-100 h-100"} sx={{backgroundColor: "#8D78FF68"}}>
                {tab === "dashboard" && <DashboardAdminComponent/>}
                {tab === "users" &&
                    <UsersAdminComponent tabUserContentLanguage={adminLanguage.tabs.tab_users_content}/>}
                {tab === "appointments" && <AppointmentsAdminComponent/>}
            </Box>
        </Stack>
    )
}

export default AdminPage;