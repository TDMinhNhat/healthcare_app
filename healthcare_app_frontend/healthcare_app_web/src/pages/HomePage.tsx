import {Container} from "@mui/material";
import HeadersComponent from "../components/HeadersComponent.tsx";
import {useState} from "react";

function HomePage({ language } : { language: object }) {

    const [tab, setTab] = useState("home");

    return (
        <Container maxWidth={false} disableGutters={true}>
            <HeadersComponent language={language.headers} tab={tab} setTab={setTab} />
        </Container>
    )
}

export default HomePage;