import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<div>Home page</div>}></Route>
      </Routes>
    </Router>
  );
}

export default App;
