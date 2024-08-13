import passport from "passport";
import local from "passport-local";
import jwt from 'passport-jwt';


const LocalStrategy = local.Strategy;
const JWTStrategy = jwt.Strategy;
const ExtractJwt = jwt.ExtractJwt;