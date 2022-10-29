import LoginFormPage from "./components/LoginFormPage";
import SignupFormPage from "./components/SignupFormPage";
import { Route, Switch } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import LandingPage from "./components/LandingPage/landingPage";
import SpecificSpotDetails from "./components/SpecificSpotDetails/specificSpotDetails";
import UserProfile from "./components/UserProfile/userProfile";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return isLoaded && (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && (
        <Switch>
          <Route exact path='/'>

          </Route>
          <Route exact path='/home'>
            <LandingPage />
          </Route>
          <Route path='/login'>
            <LoginFormPage />
          </Route>
          <Route path="/signup">
            <SignupFormPage />
          </Route>
          <Route path='/spots/:spotId'>
            <SpecificSpotDetails />
          </Route>
          <Route path='/user-profile'>
            <UserProfile />
          </Route>
        </Switch>
      )}
    </>
  );
}

export default App;
