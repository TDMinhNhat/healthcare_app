import "../../node_modules/bootstrap/dist/css/bootstrap.css";
import "../../node_modules/bootstrap/dist/js/bootstrap.js";
import "../styles/headers.scss"
import {Link} from "react-router";
import { Avatar, Box, Stack, Typography } from "@mui/material";

function HeaderComponent({ language, tab, setTab } : { language: object, tab: string, setTab: void }) {

    function checkTabEnable(value: string, type: string) {
        if(tab === value) {
            return type === "text" ? "menu_item_text_active" : "menu_item_active";
        } else return "";
    }

    return (
        <Box id={"menu"} className={"bg-opacity-10 bg-black fixed-top w-100"}>
            <Stack direction={"row"} className={"ms-5 me-5 d-flex align-items-center justify-content-between"}>
                <Box>
                    <Link to={"/"} className={"d-flex align-items-center"}>
                        <img
                            alt={"Logo"}
                            src={"logo.png"}
                            width={250}
                            height={75}
                        />
                    </Link>
                </Box>
                <Stack direction={"row"} className={"d-flex align-items-center justify-content-between w-50"}>
                    <Box className={"d-flex align-items-center menu_item " + checkTabEnable("home", "item")} onClick={() => setTab("home")}>
                        <Typography variant={"h6"} className={"fw-bold menu_item_text " + checkTabEnable("home", "text")}>{ language.home }</Typography>
                    </Box>
                    <Box className={"d-flex align-items-center menu_item " + checkTabEnable("our_services", "item")} onClick={() => setTab("our_services")}>
                        <Typography variant={"h6"} className={"fw-bold menu_item_text "  + checkTabEnable("our_services", "text")}>{ language.our_services }</Typography>
                    </Box>
                    <Box className={"d-flex align-items-center menu_item " + checkTabEnable("find_doctors", "item")} onClick={() => setTab("find_doctors")}>
                        <Typography variant={"h6"} className={"fw-bold menu_item_text "  + checkTabEnable("find_doctors", "text")}>{ language.find_doctors }</Typography>
                    </Box>
                    <Box className={"d-flex align-items-center menu_item " + checkTabEnable("reviews", "item")} onClick={() => setTab("reviews")}>
                        <Typography variant={"h6"} className={"fw-bold menu_item_text "  + checkTabEnable("reviews", "text")}>{ language.reviews }</Typography>
                    </Box>
                </Stack>
                <Box>
                    <Link to={"/login"} className={"d-flex align-items-center"} style={{ textDecorationLine: "none", color: "purple" }}>
                        <Avatar>G</Avatar>
                        <Typography variant={"h6"} className={"ms-2 fw-bold menu_item_text"}>
                            { language.login }
                        </Typography>
                    </Link>
                </Box>
            </Stack>
        </Box>
    )
}

export default HeaderComponent;