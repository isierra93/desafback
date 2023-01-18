function renderSignIn(req, res) {
    return req.session.name ? res.redirect("/") : res.render("login");
}

function setCredentials(req, res) {
    const { name } = req.body;
    if (name) {
        req.session.name = name;
        return res.render('index', { script: 'main', user: req.session.name });
    }
}

function destroyCredentials(req, res) {
    const { name } = req.session;
    req.session.destroy((err) => {
        if (err) console.error(err);
        else
            return res
                .clearCookie("connect.sid")
                .render("disconnect_user", { user: name, script:'redirect' });
    });
}

export {
    renderSignIn,
    setCredentials,
    destroyCredentials
};

