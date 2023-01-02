const express = require("express");
const {Router} = express;
const Productos = require("./Productos");
const Carritos = require("./Carritos");

const PORT = process.env.PORT || 8080;

const app = express();

//Middlewares

  //login
const isAdmin = (req, res , next) => {
  if (adminAcc){
    next();
  } else {
    return res.json({error:-1 , descripcion: "No tiene los permisos"});
  }
}
const adminAcc = true;

  //productdb
const putProdById = async (req, res, next) => {
  const {prod_id} = req.params
  const obj = req.body

  req.body = await productDB.putById(prod_id, obj);
  next()
}
const checkProdById = async (req, res, next) => {
  const productos = await productDB.getAll();
  /* Si no hay productos */
  if(productos.length == 0){
    return res.json({ error:'No se encontraron productos'});
  }
  const {prod_id} = req.params
  /* Bucle buscando ids iguales y guardo el producto en req*/
  let i = 0
  while (i < productos.length && i < prod_id) {
    if (productos[i].id == prod_id) {
      return next()
    }
    i++
  }
  /* Si sale del bucle sin disparar next() */
  return res.json({ error:'Producto no encontrado'})
}
const deleteProdWithId = async (req, res, next) => {
  await productDB.deleteById(req.params.prod_id);
  next()
}
  //carritosdb
const checkCarrById = async (req, res, next) => {
  const carritos = await carritosDB.getAll();
  /* Si no hay productos */
  if(carritos.length == 0){
    return res.json({ error:'No se encontraron carritos'});
  }
  const {id} = req.params
  /* Bucle buscando ids iguales y guardo el producto en req*/
  let i = 0
  while (i < carritos.length && i < id) {
    if (carritos[i].id == id) {
      return next()
    }
    i++
  }
  /* Si sale del bucle sin disparar next() */
  return res.json({ error:'Carrito no encontrado'})
}
const deleteCarrWithId = async (req, res, next) => {
  await carritosDB.deleteById(req.params.id);
  next()
}
const getCarrProds = async (req, res, next) => {
  let carr = await carritosDB.getById(req.params.id);
  req.body = carr.productos;
  next();
}
const carrAddProdById = async (req, res, next) => {
  const prodId = req.body.id;
  const prod = await productDB.getById(prodId);

  await carritosDB.addProd(req.params.id,prod);
  next();
}
const carrDelProdById = async (req, res, next) => {
  await carritosDB.deleteProdById(req.params.id, req.params.prod_id);
  next()
}

//Routers
const routerProductos = new Router();
const routerCarrito = new Router();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use('/', express.static(__dirname+'/public'))
app.use("/api/productos", routerProductos);
app.use("/api/carrito", routerCarrito);

// DataBases
const productDB = new Productos("./public/productDB.txt");
const carritosDB = new Carritos("./public/carritosDB.txt");

// ROUTER PRODUCTOS

routerProductos.get("/:prod_id?", async (req, res) => {

  let respuesta = await productDB.getAll();

  if(req.params.prod_id) {
    respuesta = await productDB.getById(req.params.prod_id);
    if(respuesta == null){
      res.json({error: "No hay un producto con el id solicitado"});
    }
  }
  
  res.json(respuesta);
});
routerProductos.post("/", isAdmin, async (req, res) => {
  const prod = req.body;
  await productDB.save(prod);
  res.redirect("/api/productos");
});
routerProductos.put("/:prod_id", isAdmin, putProdById , async (req, res) => {
  res.json({Producto: req.body})
});
routerProductos.delete('/:prod_id', checkProdById, deleteProdWithId, (req, res) => {
  res.json({Producto: `Eliminado id:${req.params.prod_id}`})
});

// ROUTER CARRITO

routerCarrito.post("/", async (req, res) => {
  res.json({"Carrito creado con id": await carritosDB.create()});
})
routerCarrito.delete("/:id", checkCarrById, deleteCarrWithId, (req,res) => {
  res.json({"Carrito eliminado correctamente": req.params.id})
})
routerCarrito.get("/:id/productos", checkCarrById, getCarrProds, (req, res) => {
  const carrito = req.body;
  res.json({productos: carrito})
})
routerCarrito.post("/:id/productos", checkCarrById, carrAddProdById, async (req,res) => {
  res.json({"Añadido producto": await productDB.getById(req.body.id)})
})
routerCarrito.delete("/:id/productos/:prod_id", checkCarrById, carrDelProdById, async (req, res) => {
  res.json({Borrado: await productDB.getById(req.params.prod_id)});
})


app.get('*',  (req, res) =>  {
  res.json({error: -2, descripcion:`ruta:'${req.url}' con 'GET' no implementado`});
})
app.post('*',  (req, res) =>  {
  res.json({error: -2, descripcion:`ruta:'${req.url}' con 'GET' no implementado`});
})
app.put('*',  (req, res) =>  {
  res.json({error: -2, descripcion:`ruta:'${req.url}' con 'GET' no implementado`});
})
app.delete('*',  (req, res) =>  {
  res.json({error: -2, descripcion:`ruta:'${req.url}' con 'GET' no implementado`});
})

// Inicio server
const server = app.listen(PORT,()=>{
  console.log(`Server escuchando correctamente desde puerto ${PORT}`)
})
server.on('error', err => {console.log(err)})