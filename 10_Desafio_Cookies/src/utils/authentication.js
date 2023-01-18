export function auth (req, res, next) {
    return req.session.name ? next() : res.redirect("/signin");
}