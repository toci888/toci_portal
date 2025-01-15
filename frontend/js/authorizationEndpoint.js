import express from "express";
import session from "express-session";

const app = express();

app.use(session({ secret: "sekret", resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// Endpoint do rozpoczęcia logowania
app.get("/auth/facebook", passport.authenticate("facebook", { scope: ["email"] }));

// Endpoint powrotu po autoryzacji
app.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", { failureRedirect: "/" }),
  (req, res) => {
    res.send(`Witaj, ${req.user.displayName}!`);
  }
);

app.listen(3000, () => {
  console.log("Aplikacja działa na http://localhost:3000");
});
