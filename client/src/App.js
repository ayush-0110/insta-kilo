import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useState } from "react";
import "./App.css";
import Home from "./components/home";
import Main from "./components/main";
function App() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Main
              username={username}
              setUsername={setUsername}
              email={email}
              setEmail={setEmail}
              phone={phone}
              setPhone={setPhone}
            />
          }
        />
        <Route
          path="/home"
          element={<Home username={username} email={email} phone={phone} />}
        />
      </Routes>
    </BrowserRouter>
    // <div className="App">
    // Hii
    // </div>
  );
}

export default App;
