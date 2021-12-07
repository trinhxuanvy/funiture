const passport = require("passport");
const Admin = require("../models/admin.model");
const Customer = require("../models/customer.model");
const LocalStrategy = require("passport-local").Strategy;

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  Admin.findById(id, function (err, user) {
    done(err, user);
  });

  Customer.findById(id, function (err, user) {
    done(err, user);
  });
});

passport.use(
  "local.admin.login",
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password",
      passReqToCallback: true,
    },
    function (req, username, password, done) {
      Admin.findOne({ username: username }, function (err, user) {
        if (err) {
          return done(err);
        }

        if (!user) {
          return done(null, false, {
            message: "Admin Not Found",
            type: "error",
          });
        }

        if (!user.validPassword(password)) {
          return done(null, false, {
            message: "Incorrect Password",
            type: "error",
          });
        }

        if (user.status == false) {
          return done(null, false, {
            message: "This account has been locked",
            type: "warning",
          });
        }

        return done(null, user);
      });
    }
  )
);

passport.use(
  "local.customer.login",
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password",
      passReqToCallback: true,
    },
    function (req, username, password, done) {
      Customer.findOne({ username: username }, function (err, user) {
        if (err) {
          return done(err);
        }

        if (!user) {
          return done(null, false, {
            message: "User Not Found",
            type: "error",
          });
        }

        if (!user.validPassword(password)) {
          return done(null, false, {
            message: "Incorrect Password",
            type: "error",
          });
        }

        if (user.status == false) {
          return done(null, false, {
            message: "This account has been locked",
            type: "warning",
          });
        }

        return done(null, user);
      });
    }
  )
);