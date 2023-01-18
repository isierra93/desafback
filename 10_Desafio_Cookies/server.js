import * as dotenv from 'dotenv'
dotenv.config()
import express from 'express';
import { createServer } from 'http';
import { Server } from "socket.io";
import handlebars from "express-handlebars";
import { toSocketMessages, insertMessage } from './src/controllers/messages.controller.js';
import { toSocketProducts, insertProduct, fakeProducts } from './src/controllers/products.controller.js';
import { auth } from './src/utils/authentication.js';
import { renderSignIn, setCredentials, destroyCredentials } from './src/controllers/session.controller.js';
import cookieParser from "cookie-parser";
import session from "express-session";
import MongoStore from "connect-mongo";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

const PORT = 8080;
app.use('/static', express.static('/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine('handlebars', handlebars.engine())
app.use(express.static('./public'))

app.set('views', './views')
app.set('view engine', 'handlebars')

app.use(cookieParser());

app.use(
    session({
        secret: process.env.SECRETMONGO,
        saveUninitialized: false,
        resave: false,
        rolling: true,
        store: MongoStore.create({
            mongoUrl: process.env.MONGOURL,
            mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
            ttl: process.env.TTL,
        }),
        cookie: {
            maxAge: process.env.TTL * 1000,
        },
    })
);

app
    .get("/", auth, (req, res) => {
        res.render('index', { script: 'main' });
    })
    .get("/api/productos-test", auth, fakeProducts)
    .post("/login", setCredentials)
    .get("/signin", renderSignIn)
    .get('/logout', destroyCredentials);


httpServer.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto http://localhost:${PORT}`)
})

httpServer.on("error", (error) => console.log("Error en servidor", error));

io.on("connection", async (socket) => {
    let messages = await toSocketMessages();
    let products = await toSocketProducts();

    socket.emit("products", products);

    socket.on("newProduct", async (data) => {
        await insertProduct(data)
        products = await toSocketProducts();
        io.sockets.emit("products", products);
    });

    socket.emit("messages", messages);

    socket.on("newMessage", async (data) => {
        await insertMessage(data);
        messages = await toSocketMessages();
        io.sockets.emit("messages", messages);
    });
});
