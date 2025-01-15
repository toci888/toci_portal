import passport from "passport";
import { Strategy as FacebookStrategy } from "passport-facebook";

passport.use(
  new FacebookStrategy(
    {
      clientID: "8964301736992564",
      clientSecret: "c542194693e5b32f2044282fb38c4307",
      callbackURL: "http://localhost:3000/auth/facebook/callback",
      profileFields: ["id", "displayName", "email"],
    },
    (accessToken, refreshToken, profile, done) => {
      // Tutaj możesz obsłużyć użytkownika, np. zapisać go w bazie danych
      console.log("Profil użytkownika:", profile);
      done(null, profile);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});
