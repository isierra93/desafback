import passport from "koa-passport"
import passportService from "../../Service/passport/passportService.js"

passport.use("login", passportService.Login )

passport.use("signin", passportService.Signin )

passport.serializeUser( passportService.Serialize )

passport.deserializeUser( passportService.Deserialize )

export default passport