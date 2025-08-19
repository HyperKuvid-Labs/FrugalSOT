import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import HomePage from "./pages/homePage";
// import SignInPage from "./pages/signIn";
// import SignUpPage from "./pages/signUp";
import DocumentationPage from "./pages/documentation";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/documentation" element={<DocumentationPage />} />
      </Routes>
    </Router>
  );
}

export default App;
