import express from 'express';
import handlebars from 'express-handlebars';
import __dirname from './utils.js';
import { Server } from 'socket.io';
import dbController from './models/DBController.js';

const app = express();
const PORT = 8080;
const tableProducts = 'products';
const tableChat = 'chat';

const server = app.listen(PORT, () => {
    console.log(`Servidor HTTP escuchando en el puerto ${server.address().port}`);
});
server.on("Error", error => console.log(`Error en servidor ${error}`));

const io = new Server(server);

app.use(express.json());
app.use(express.urlencoded({ extended : true }))
app.use(express.static(__dirname+'/public'))

app.engine(
    "handlebars",
    handlebars.engine()
);

app.set('views', './views');
app.set('view engine', 'handlebars');

io.on('connection', async(socket) => {
    console.log('Un cliente se ha conectado');
    socket.emit('messages', await dbController.getAll(tableChat));//await db(tableChat).select('*'));
    socket.emit('products', {products : await dbController.getAll(tableProducts)});//await db(tableProducts).select('*')});

    socket.on('new-message', async(data) => {
        try {
            await dbController.save(data, tableChat);//await db(tableChat).insert(data);
            io.sockets.emit('messages', [data]);
        } catch (error) {
            console.error("new-product",error);
        }
    });

    socket.on('new-product', async(data) => {
        try {
            await dbController.save(data, tableProducts);//await db(tableProducts).insert(data);

            try {
                let productosAll = await dbController.getAll(tableProducts);//await db('products').select('*');
                io.sockets.emit('products', {products : productosAll});
            } catch (error) {
                console.error("products-socket-emit",error);
            }
        } catch (error) {
            console.error("new-product",error);
        }
    });
})

app.get("/", async(req, res) => {
    try {
        let productosAll = await dbController.getAll(tableProducts);//await db('products').select('*');
        res.render('indexForm');
    } catch (error) {
        console.error("/",error)
    }
});
