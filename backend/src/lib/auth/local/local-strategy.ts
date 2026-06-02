import passport from "passport";
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';
import { UserIdentityModel } from "./user-identity.model";

passport.use(
    new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password',
            session: false
        },
        async (email, password, done) => {
            try {
                const identity = await UserIdentityModel.findOne({'credentials.email': email});
                if (!identity) {
                    return done(null, false, { message: `invalid email` });
                }

                const match = await bcrypt.compare(password, identity.credentials.hashedPassword);

                if (match) {
                    return done(null, identity.toObject().user);
                }
                return done(null, false, { message: 'password supplied' });
            } catch(err) {
                return done(err);
            }
        }
    )
);