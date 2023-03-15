import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from "react-router-dom";
import * as sessionActions from "../../store/session";
import './SignupForm.css';

const SignupFormPage = () => {

    const dispatch = useDispatch();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState("");
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [errors, setErrors] = useState([]);
    const sessionUser = useSelector((state) => state.session.user);

    if (sessionUser) return <Redirect to="/" />;
    console.log(sessionActions);
    const handleSubmit = (e) => {
        e.preventDefault();
        if (password === confirmPassword) {
            setErrors([]);
            return dispatch(sessionActions.signup({ email, username, firstName, lastName, password }))
                .catch(async (res) => {
                    const data = await res.json();
                    if (data && data.errors) setErrors(data.errors);
                });
        }
        return setErrors(['Confirm Password field must be the same as the Password field']);
    };

    return (
        <div className='SignupFormWrapper'>
            <form onSubmit={handleSubmit} className='SignUpForm'>
                <div className='SignUpHereMessage'>Signup Here</div>
                <ul>
                    {errors.map((error, idx) => <li key={idx}>{error}</li>)}
                </ul>
                <label className='textLabelWrapper'>
                    {/* <div className='textLabel'>Email</div> */}
                    <input
                        type="text"
                        value={email}
                        placeholder='Email'
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className='InputBox'
                    />
                </label>
                <label className='textLabelWrapper'>
                    {/* <div className='textLabel'>First Name</div> */}
                    <input
                        type="text"
                        value={firstName}
                        placeholder='First Name'
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                        className='InputBox'
                    />
                </label>
                <label className='textLabelWrapper'>
                    {/* <div className='textLabel'>Last Name</div> */}
                    <input
                        type="text"
                        value={lastName}
                        placeholder='Last Name'
                        onChange={(e) => setLastName(e.target.value)}
                        required
                        className='InputBox'
                    />
                </label>
                <label className='textLabelWrapper'>
                    {/* <div className='textLabel'>Username</div> */}
                    <input
                        type="text"
                        value={username}
                        placeholder='Username'
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className='InputBox'
                    />
                </label>
                <label className='textLabelWrapper'>
                    {/* <div className='textLabel'>Password</div> */}
                    <input
                        type="password"
                        value={password}
                        placeholder='Password'
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className='InputBox'
                    />
                </label>
                <label className='textLabelWrapper'>
                    {/* <div className='textLabel'>Confirm Password</div> */}
                    <input
                        type="password"
                        value={confirmPassword}
                        placeholder='Confirm Password'
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className='InputBox'
                    />
                </label>
                <button type="submit" className='SignupButton'>Sign Up</button>
            </form>
        </div>
    );
};

export default SignupFormPage;
