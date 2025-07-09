// const passport = require('passport');
// const JwtStrategy = require('passport-jwt').Strategy;
// const ExtractJwt = require('passport-jwt').ExtractJwt;
// const prisma = require('./prisma');
// require('dotenv').config();

// const opts = {
//   jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//   secretOrKey: process.env.JWT_SECRET,
// };

// passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
//   try {
//     console.log("entered")
//     if (!jwt_payload.role) {
//         return done(null, false);
//       }
  
//       let user;
  
//       if (jwt_payload.role === 'client') {
//         user = await prisma.client.findUnique({
//           where: { id: jwt_payload.id }
//         });
//       } else if (jwt_payload.role === 'admin') {
//         user = await prisma.admin.findUnique({
//           where: { id: jwt_payload.id }
//         });
//       } else {
//         return done(null, false);
//       }
//      console.log(user)
//      user.password = null;
//     if (user) {
//       return done(null, user);
//     } else {
//       return done(null, false);
//     }
//   } catch (error) {
//     return done(error, false);
//   }
// }));



const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const prisma = require('./prisma'); // Adjust path if needed
require('dotenv').config();

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

passport.use(
  new JwtStrategy(opts, async (jwt_payload, done) => {
    try {

      if (!jwt_payload.role) {
        return done(null, false);
      }

      let user;

      if (jwt_payload.role === 'client') {
        user = await prisma.client.findUnique({
          where: { id: jwt_payload.id },
        });
      } else if (['admin', 'editor'].includes(jwt_payload.role)) {
        user = await prisma.admin.findUnique({
          where: { id: jwt_payload.id },
        });
      } else {
        return done(null, false);
      }

      if (user) {
        user.password = null; // Optional: remove password before attaching to req.user
        return done(null, user);
      } else {
        return done(null, false);
      }

    } catch (error) {
      console.error("Passport error:", error);
      return done(error, false);
    }
  })
);

module.exports = passport;
