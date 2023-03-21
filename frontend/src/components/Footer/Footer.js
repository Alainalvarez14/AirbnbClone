import githubLogo from "./githubLogo.png"
import angellistLogo from "./angelList-1.svg"
import linkedinLogo from "./linkedinLogo.png"
import "./Footer.css";
import logo from "../../Logos/nomadTransparentBackground.png"

const Footer = () => {
    return (
        <div>
            <nav class="navbar fixed-bottom navbar-light bg-light entireFooter">
                <a class="navbar-brand" href="#" target="blank"><img src={`${logo}`} style={{ marginLeft: '2vw', height: '3vh', width: '10vw' }}></img></a>
                <div>
                    <a class="navbar-brand" href="https://github.com/Alainalvarez14" target="blank"><img src={`${githubLogo}`} class="logo"></img></a>
                    <a class="navbar-brand" href="https://wellfound.com/u/alain-alvarez-1" target="blank"><img src={`${angellistLogo}`} class="logo"></img></a>
                    <a class="navbar-brand" href="https://www.linkedin.com/in/alain-alvarez-84400523a/" target="blank"><img src={`${linkedinLogo}`} class="logo"></img></a>
                </div>
            </nav>
        </div>
    )
}

export default Footer;
