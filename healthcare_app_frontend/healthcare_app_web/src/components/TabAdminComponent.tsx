import {Box, Stack, Tab, Tabs, Typography} from "@mui/material";
import "../styles/tab-admin.scss"
function TabAdminComponent({ tab, setTab, tabsLanguage }:{ tab: string, setTab: void, tabsLanguage: object }) {

    const list = tabsLanguage.list;

    return (
        <Stack direction={"column"} className={"position-fixed top-0 start-0 d-flex flex-column align-items-center justify-content-between h-100 bg-white"}>
            <Stack direction={"column"}>
                <Box className={"w-100 p-3"}>
                    <img
                        id={"logo"}
                        src={"logo.png"}
                        width={"200px"}
                        height={"75px"}
                    />
                </Box>

                <Stack className={"w-100 d-flex flex-column align-items-start"}>
                    { list.map((item: object, index: number) => {
                        return (
                            <Box key={index} className={"d-flex flex-row justify-content-start align-items-center p-3 tab-item w-100"} onClick={() => setTab(item.value)}>
                                <img src={item.image} width={"40px"} height={"40px"}/>
                                <Typography className={"ms-2"}>{item.name}</Typography>
                            </Box>
                        )
                    })}
                </Stack>
            </Stack>

            <Box>

            </Box>
        </Stack>
    )
}

export default TabAdminComponent;