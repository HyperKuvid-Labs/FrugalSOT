import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import HomePage from "./pages/homePage";
import SignInPage from "./pages/signIn";
import SignUpPage from "./pages/signUp";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/sign-in" element={<SignInPage />} />
        <Route path="/sign-up" element={<SignUpPage />} />
      </Routes>
    </Router>
  );
}

export default App;
