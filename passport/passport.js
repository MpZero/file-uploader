const LocalStrategy = require("passport-local").Strategy;
const passport = require("passport");
const { validPassword } = require("../utils/passwordUtils");
const { findUser } = require("../queries/userQueries");

// const prisma = new PrismaClient();
const prisma = require("../prisma");

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    done(null, user);
  } catch (err) {
    done(err);
  }
});

module.exports = (passport) => {
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        console.log(`passport`);

        const user = await findUser(username);
        if (!user) return done(null, false, { message: "Incorrect username" });

        const isValid = await validPassword(password, user.password);
        if (!isValid)
          return done(null, false, { message: "Incorrect password" });

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    })
  );
};
