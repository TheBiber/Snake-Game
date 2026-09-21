import { Router, Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";

const router = Router();
const userRepository = AppDataSource.getRepository(User);

// 1. קבלת כל המשתמשים (GET)
router.get("/users", async (req: Request, res: Response) => {
  try {
    // שליפת כל המשתמשים מהטבלה ב-Postgres
    const users = await userRepository.find({
      order: {
        highScore: "DESC", // כדאי להחזיר אותם כבר ממוינים מהציון הגבוה לנמוך!
      },
    });

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
});

// 2. יצירת משתמש חדש (POST)
router.post("/users", async (req: Request, res: Response) => {
  try {
    const newUser = userRepository.create(req.body); // מייצר אובייקט זמני
    const result = await userRepository.save(newUser); // שומר בפועל ב-Postgres
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ message: "שגיאה בשמירת המשתמש", error });
  }
});

// --- הנתיב החדש לעדכון ה-HighScore ---
router.put("/users/:id/highscore", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { highScore } = req.body; // הניקוד החדש שהשחקן השיג עכשיו

  try {
    // 1. נחפש את המשתמש במסד הנתונים לפי ה-ID שלו
    const user = await userRepository.findOneBy({ id: Number(id) });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // 2. נמיר את הניקוד הישן והחדש למספרים כדי להשוות ביניהם
    const currentScore = parseInt(user.highScore || "0");
    const newScore = parseInt(highScore);

    // 3. נעדכן רק אם הניקוד החדש גבוה יותר מהשיא הנוכחי
    if (newScore > currentScore) {
      user.highScore = newScore.toString();
      await userRepository.save(user);
      res.json({ message: "New High Score saved!", user });
    } else {
      res.json({
        message: "Score is not higher than current High Score",
        user,
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Error updating highscore", error });
  }
});

export default router;
