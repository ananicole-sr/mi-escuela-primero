import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import Lobby from "../components/Lobby";
import Testimonies from "../components/Testimonies";
import "../pages/Home.css"
import Pre_footer from "../components/Pre_footer";
import Explainer from "../components/explainer";

export default function Home(){
    return(
        <>
        <NavBar/>
        <Lobby/>
        <Explainer/>
        <Testimonies/>
        <Pre_footer/>
        <Footer/>
        </>
    );
}