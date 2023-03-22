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
import { getAllSpots } from "./store/spots";
import SpecificCity from "./components/SpecificCity/SpecificCity";
import Footer from "./components/Footer/Footer";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
    dispatch(getAllSpots());
  }, [dispatch]);

  return isLoaded && (
    <>
      <Navigation isLoaded={isLoaded} />
      <Footer />
      {isLoaded && (
        <Switch>
          <Route exact path='/'>
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
          <Route path='/:cityState'>
            <SpecificCity />
          </Route>
        </Switch>
      )}
    </>
  );
}

export default App;
