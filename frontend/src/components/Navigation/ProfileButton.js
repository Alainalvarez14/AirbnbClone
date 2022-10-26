import { useState, useEffect } from "react";
import { useDispatch } from 'react-redux';
import { Redirect } from "react-router-dom";
import * as sessionActions from '../../store/session';
// import createSpotForm from "../CreateSpotForm/createSpotForm";

function ProfileButton({ user }) {
    const dispatch = useDispatch();
    const [showMenu, setShowMenu] = useState(false);
    const [showCreateSpotForm, setShowCreateSpotForm] = useState(false);

    const openMenu = () => {
        if (showMenu) return;
        setShowMenu(true);
    };

    const openCreateSpotForm = () => {
        if (showCreateSpotForm) return;
        setShowCreateSpotForm(true);
    }

    useEffect(() => {
        if (!showMenu) return;

        const closeMenu = () => {
            setShowMenu(false);
        };

        document.addEventListener('click', closeMenu);

        return () => document.removeEventListener("click", closeMenu);
    }, [showMenu]);

    const logout = (e) => {
        e.preventDefault();
        dispatch(sessionActions.logout());
        // <Redirect to='/' /> // not working ask zaviar.
    };

    const hostASpot = (e) => {
        e.preventDefault();
        // <createSpotForm />
    }

    return (
        <>
            <button onClick={openMenu} id='profileButton'>
                {/* <i className="fas fa-user-circle"></i> */}
                {user.username}
            </button>
            {showMenu && (
                <ul className="profile-dropdown">
                    <li>{user.username}</li>
                    <li>{user.email}</li>
                    <li>
                        <button onClick={openCreateSpotForm}>Host a Spot</button>
                    </li>
                    <li>
                        <button onClick={logout}>Log Out</button>
                    </li>
                </ul>
            )}
            {showCreateSpotForm && (
                <div>hi</div>
            )}
        </>
    );
}

export default ProfileButton;
