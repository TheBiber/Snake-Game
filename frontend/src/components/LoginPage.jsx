import React, { useState } from "react";
import { useNavigate } from "react-router"; // (או react-router-dom)

export const LoginPage = () => {
  // 1. הגדרת משתני מצב (State) עבור השדות בטופס
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate(); // משתנה שמאפשר לנו להעביר את המשתמש לדף המשחק אחרי ה-Login

  // 2. פונקציה שמופעלת בזמן לחיצה על כפתור LOGIN
  const handleSubmit = async (e) => {
    e.preventDefault(); // מונע מהדף להתרענן ולמחוק את הנתונים
    setErrorMessage("");

    if (!username || !password) {
      setErrorMessage("Please enter both username and password");
      return;
    }

    try {
      // פנייה לשרת ה-Backend החיצוני שלך (נניח שיצרת שם נתיב /api/login)
      const response = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Login successful!", data);
        // שמירת ה-ID של המשתמש שחזר מהשרת ב-Local Storage כדי שהמשחק ידע מי משחק כרגע
        localStorage.setItem("userId", data.user.id);

        // העברת המשתמש ישירות לדף המשחק!
        navigate("/game");
      } else {
        setErrorMessage(data.message || "Invalid username or password");
      }
    } catch (error) {
      console.error("Login connection error:", error);
      setErrorMessage(
        "Cannot connect to server. Make sure Backend is running!",
      );
    }
  };

  return (
    <div className="login-body">
      <main className="login-page">
        <div className="grid"></div>
        <div className="sun"></div>

        <section className="content">
          <header className="login-logo">
            <h1 className="login-h1">Biber's</h1>
            <h2 className="login-h2">RETRO</h2>
          </header>

          {/* הוספת onSubmit לטופס */}
          <form className="login-box" onSubmit={handleSubmit}>
            {/* הצגת הודעת שגיאה במידה ויש */}
            {errorMessage && (
              <p
                style={{
                  color: "red",
                  textAlign: "center",
                  marginBottom: "10px",
                }}
              >
                {errorMessage}
              </p>
            )}

            <div className="input-group">
              <span className="icon">👤</span>
              <input
                type="text"
                placeholder="Username"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)} // עדכון ה-State בכל הקלדה
              />
            </div>

            <div className="input-group">
              <span className="icon">🔒</span>
              <input
                type="password"
                placeholder="Password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)} // עדכון ה-State בכל הקלדה
              />
            </div>

            <button type="submit" className="login-button">
              LOGIN
            </button>

            <div className="slogan">
              <span></span>
              <p>
                GOOD GAMES
                <br />
                BETTER TIMES
              </p>
              <span></span>
            </div>
          </form>
        </section>

        <div className="arcade left">
          <div className="arcade-screen">
            PRESS
            <br />
            START
          </div>
          <div className="joystick"></div>
        </div>

        <div className="monitor">
          <div className="monitor-screen">
            <p>BIBER'S</p>
            <p>RETRO</p>
            <div className="alien">👾</div>
          </div>
        </div>
      </main>
    </div>
  );
};
