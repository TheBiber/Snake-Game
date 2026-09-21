import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { LoginPage } from "./components/LoginPage";
import { SnakeGame } from "./components/SnakeGame";
// import SnakeGame from "./components/SnakeGame"; // שחרר את ההערה כשקומפוננטת המשחק תהיה מוכנה

const router = createBrowserRouter([
  {
    path: "/snake",
    element: <SnakeGame />,
  },
  {
    path: "/", // נתיב ברירת המחדל של האתר יציג גם הוא את דף הלוגין
    element: <LoginPage />,
  },
  // {
  //   path: "/game",
  //   element: <SnakeGame />,
  // }
]);

const App = () => {
  return <RouterProvider router={router} />;
};

// השורה שחסרה לך והיא חובה:
export default App;
