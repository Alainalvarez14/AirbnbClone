import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import * as sessionActions from '../../store/session';
import './LoginForm.css';

const LoginFormPage = () => {
    const dispatch = useDispatch();
    const [credential, setCredential] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState([]);
    const sessionUser = useSelector(state => state.session.user);

    if (sessionUser) return (
        <Redirect to='/home' />
    );

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors([]);
        return dispatch(sessionActions.login({ credential, password }))
            .catch(async (res) => {
                const data = await res.json();
                if (data && data.errors) setErrors(data.errors);
            });
    };

    return (
        <div className="formWrapper">
            <form onSubmit={handleSubmit} className='loginForm'>
                <div className="welcomeMessage">Welcome to Airbnb</div>
                <ul>
                    {errors.map((error, idx) => <li key={idx}>{error}</li>)}
                </ul>
                <label className="textLabelWrapper">
                    {/* <div className="textLabel">Username or Email</div> */}
                    <input
                        type="text"
                        value={credential}
                        placeholder='Username or email'
                        onChange={(e) => setCredential(e.target.value)}
                        required
                        className="inputBox"
                    />
                </label>
                <label className="textLabelWrapper">
                    {/* <div className="textLabel">Password</div> */}
                    <input
                        type="password"
                        value={password}
                        placeholder='Password'
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="inputBox"
                    />
                </label>
                <button type="submit" className="LoginButton">Log In</button>
            </form>
        </div>

    );

}

export default LoginFormPage;
