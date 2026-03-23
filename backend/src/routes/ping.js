import { Router } from "express";

const pingRouter = Router();

pingRouter.get("/", (req, res) => {
  console.log("I was just pinged");
  res.json({ message: "Hey Buddy, we are good!" });
});

export default pingRouter;
