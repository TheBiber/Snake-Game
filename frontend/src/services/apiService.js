const API_BASE_URL = "http://localhost:3000/api";

export const createUser = async (username, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: username,
        passwordHash: password,
        highScore: "0", // מתחיל מ-0
      }),
    });
    const data = await response.json();
    console.log("Test user response:", data);
    return data;
  } catch (error) {
    console.error("Error creating test user:", error);
  }
};

export const updateHighScore = async (userId, score) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/highscore`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        highScore: score.toString(),
      }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating highscore:", error);
    return { message: "Connection error" };
  }
};
