import React, { useContext } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import Topbar from "./Topbar";
import HostTopbar from "./HostTopbar";
import EventPage from "./EventPage";
import EventDetailsPage from "./EventDetailsPage";
import TicketsPage from "./TicketsPage";
import TicketPage from "./TicketDetailsPage";
import Login from "./authentication/Login";
import PrivateRoute from "./authentication/PrivateRoute";
import { AuthContext, AuthProvider } from "./authentication/Auth";
import { CartProvider } from "./Cart";
import CartPage from "./CartPage";
import CartButton from "./CartButton";
import MainPage, { HostMainPage } from "./MainPage";
import SignUp from "./authentication/SignUp";
import CompanySignUp from "./authentication/CompanySignUp";
import ConfirmPage from "./PurchaseConfirmPage";
import HostEventsPage from "./HostEventsPage";
import HostEventReport from "./HostEventReport";
import AddEventPage from "./AddEventPage";
import AddEventButton from "./AddEventButton";
import Loading from "./Loading";
import { TopbarDiv } from "./TopbarComponents";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div style={{ background: "#222", minHeight: "100vh" }}>
            <TopbarSelection />
            <ButtonSelection />
            <MainSwitch />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

function TopbarSelection(props) {
  const { isHost, pending } = useContext(AuthContext);
  return !pending ? isHost ? <HostTopbar /> : <Topbar /> : <TopbarDiv />;
}

function MainContainer(props) {
  return <div className="main-container">{props.children}</div>;
}

function MainSwitch(props) {
  const { isHost, pending } = useContext(AuthContext);
  return (
    <MainContainer>
      {!pending ? (
        isHost ? (
          <Switch>
            <PrivateRoute exact path="/" component={HostMainPage} />
            <PrivateRoute exact path="/event" component={HostEventsPage} />
            <PrivateRoute path="/event/:eventId" component={HostEventReport} />
            <PrivateRoute exact path="/addEvent" component={AddEventPage} />
            <PrivateRoute path="/editEvent/:eventId" component={AddEventPage} />
            <Route
              path="/tmp"
              component={() => (
                <div style={{ color: "white" }}>Nie znaleziono strony</div>
              )}
            />
            <Route path="/*" component={() => <Redirect to="/tmp" />} />
          </Switch>
        ) : (
          <Switch>
            <Route exact path="/" component={MainPage} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/signup" component={SignUp} />
            <Route exact path="/signup-company" component={CompanySignUp} />
            <Route exact path="/event" component={EventPage} />
            <Route path="/event/:eventId" component={EventDetailsPage} />
            <PrivateRoute exact path="/cart" component={CartPage} />
            <PrivateRoute path="/ticket/:ticketId" component={TicketPage} />
            <PrivateRoute
              exact
              path="/mytickets"
              component={() => <TicketsPage showPast={true} />}
            />
            <PrivateRoute exact path="/purchase" component={ConfirmPage} />
            <Route path="/*" component={() => <Redirect to="/" />} />
          </Switch>
        )
      ) : (
        <Loading />
      )}
    </MainContainer>
  );
}

function ButtonSelection(props) {
  const { isHost, pending } = useContext(AuthContext);
  return !pending ? isHost ? <AddEventButton /> : <CartButton /> : <></>;
}

export default App;
