import { NavLink } from "react-router-dom";
import ProfileButton from "./ProfileButton";
import { useSelector } from "react-redux";
import './Navigation.css';
import SearchBar from "../SearchBar/SearchBar";

const Navigation = ({ isLoaded }) => {
    const sessionUser = useSelector(state => state.session.user);

    let sessionLinks;
    if (sessionUser) {
        sessionLinks = (
            <ProfileButton user={sessionUser} />
        );
    } else {
        sessionLinks = (
            <>
                <NavLink to="/login" className='loginButton'>Log In</NavLink>
                <NavLink to="/signup" className='signupButton'>Sign Up</NavLink>
            </>
        );
    }

    return (
        <ul className="logoContainer">
            <li>
                <NavLink exact to='/' className='logoText'>airbnb</NavLink>
                {isLoaded && sessionLinks}
                <SearchBar />
            </li>
        </ul>
    );
}

export default Navigation;
