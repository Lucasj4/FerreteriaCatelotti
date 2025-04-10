import passport from "passport";
import local from "passport-local";
import jwt from 'passport-jwt';


const LocalStrategy = local.Strategy;
const JWTStrategy = jwt.Strategy;
const ExtractJwt = jwt.ExtractJwt;

export const initializePassport = () => {


    passport.use('jwt', new JWTStrategy({

        
        
        jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
        secretOrKey: "ferreteria",
    }, async (jwt_payload, done) => {
        try {
            return done(null, jwt_payload);
        } catch (error) {
            return done(error);
        }
    }));




    passport.use("register", new LocalStrategy({
        passReqToCallback: true,
        usernameField: "email"
    }, async (req, username, password, done) => {
        const { first_name, last_name, email, age, rol } = req.body;
    
        try {
            let user = await UserModel.findOne({ email });
            if (user) {
                // Si el usuario ya existe, devolver un error personalizado
                return done(null, false, { message: "El usuario ya existe" });
            }
    
            // Si no existe, voy a crear un registro de usuario nuevo
            let newUser = {
                first_name,
                last_name,
                email,
                age,
                password: createHash(password),
                rol
            }
            let result = await UserModel.create(newUser);
            // Si todo resulta bien, podemos mandar done con el usuario generado. 
            return done(null, result);
        } catch (error) {
            return done(error);   
        }
    }));
    



    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        let user = await UserModel.findById({ _id: id });
        done(null, user);
    })

   
}

const cookieExtractor = (req) => {
  

    
    let token = null;
    if (req && req.cookies) {
        token = req.cookies["ferreteriaCookieToken"];
    }
   
    return token;
}