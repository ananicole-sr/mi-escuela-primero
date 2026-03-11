import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import Lobby from "../components/Lobby";
import TrustBuilding from "../components/TrustBuilding";

export default function Home(){
    return(
        <>
        <NavBar/>
        <Lobby/>
        <TrustBuilding/>
        <Footer/>
        </>
    );
}