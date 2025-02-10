import {Container} from "@mui/material";
import {useState} from "react";
import HeaderComponent from "../components/HeaderComponent.tsx";
import HomeComponent from "../components/HomeComponent.tsx";
import OurServiceComponent from "../components/OurServiceComponent.tsx";
import FindDoctorComponent from "../components/FindDoctorComponent.tsx";
import ReviewsComponent from "../components/ReviewsComponent.tsx";
import FooterComponent from "../components/FooterComponent.tsx";

function HomePage({ language, setLanguage, languageType } : { language: object, setLanguage: void, languageType: string }) {

    const [tab, setTab] = useState("home");

    return (
        <Container maxWidth={false} disableGutters={true}>
            <HeaderComponent language={language.header} tab={tab} setTab={setTab} />

            <Container disableGutters={true} sx={{marginTop: 10, width: "100%", height: "100%"}}>
                { tab === "home" && <HomeComponent language={language.body.home} />}
                { tab === "our_services" && <OurServiceComponent language={language.body.our_services} />}
                { tab === "find_doctors" && <FindDoctorComponent language={language.body.find_doctors} />}
                { tab === "reviews" && <ReviewsComponent language={language.body.reviews} />}
            </Container>

            <FooterComponent footer={language.footer} setLanguage={setLanguage} languageType={languageType} />
        </Container>
    )
}

export default HomePage;