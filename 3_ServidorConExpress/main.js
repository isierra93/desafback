const express = require('express')
const fs = require('fs')

//////////////////////////////////////////////////////////////////////////////////////

class Contenedor{
    constructor(ruta){
        this.ruta = ruta
    }
    /* save(Object): Number - Recibe un objeto, lo guarda en el archivo, devuelve el id asignado */
    async save(prod){
        try{
            //recibo el archivo como array de objetos
            const file = await this.getAll()
            //decidimos id
            let idnum
            if (file.length == 0) {
                idnum = 1
            } else {
                idnum = file[file.length - 1].id + 1
            }
            //añadimos id a producto
            prod = {...prod, id: idnum}
            //pusheo producto al array
            file.push(prod)
            await fs.promises.writeFile(this.ruta, JSON.stringify(file, null, 2))            
            console.log(`se guardó exitosamente el producto: ${prod.title}`)
            return idnum
        }
        catch (error){
            throw new Error(error)
        }
    }
    /* getById(Number): Object - Recibe un id y devuelve el objeto con ese id, o null si no está. */
    async getById(id){
        //recibo el archivo como array de objetos
        try {
            const file = await this.getAll()
            let prod = null    
            let i = 0
            while (i<id) {
                if ( (file[i]) && (file[i].id = id) ) {
                    prod = file[i]
                }
                i++
            }
            return prod
        } catch (error) {
            
        }
    }
    /* getAll(): Object[] - Devuelve un array con los objetos presentes en el archivo */
    async getAll(){
        let file
        try {
            file = await fs.promises.readFile(this.ruta, 'utf-8')
            return JSON.parse(file)
        }
        catch {
            try {
                await fs.promises.writeFile(this.ruta, '[]')
                file = await fs.promises.readFile(this.ruta, 'utf-8')
                return JSON.parse(file)
            } catch (error) {
                throw new Error(error)
            }
        }        
    }
    async getAllNames(){
        try {
            const arr = await this.getAll()
            const nombres =[]
            for(const elem of arr ){
                nombres.push(elem.title)
            }
            //devuelve un array con los nombres
            return nombres
        } catch (error) {
            console.log('Hubo algun error buscando los todos los nombres.\n' + error)
        }
    }
    /* deleteById(Number): void - Elimina del archivo el objeto con el id buscado. */
    async deleteById(id){
        try {
            const file = await this.getAll()
            let i = 0
            while (i<id) {
                if ((file[i]) && (file[i].id == id)) {
                    console.log(`Producto: ${(await this.getById(id)).title}. Eliminado con éxito.`)
                    file.splice(i,1)
                }
                i++
            }            
            await fs.promises.writeFile(this.ruta, JSON.stringify(file), null, 2)
        } catch (error) {
            throw new Error(error)
        }
    }
    /* deleteAll(): void - Elimina todos los objetos presentes en el archivo */
    async deleteAll(){
        try {
            await fs.promises.writeFile(this.ruta,'[]')
            console.log('Eliminados todos los productos con éxito.')
        } catch (error) {
            throw new Error(error)
        }
    }
}
const contenedor1 = new Contenedor('./productos.txt')

/* let prodArr
let prodNamesArr
let prodNamesList */

async function guardarProductos(contenedor) {
  await contenedor.save({title:'Remera', precio: 1500.99, thumbnail:'http://d3ugyf2ht6aenh.cloudfront.net/stores/001/719/894/products/remera_lisa_amarilla1-ad7aabde36568fbb6316249901780168-640-0.png'})
  await contenedor.save({title:'Pantalon', precio: 3500.99, thumbnail:'https://media.istockphoto.com/photos/mens-trousers-picture-id510615049?k=20&m=510615049&s=612x612&w=0&h=V2qWdnou1w6ctJnfiRlYxQp6QwgX8yRMBBOCMxm7ei0='})
  await contenedor.save({title:'Campera', precio: 15000.99, thumbnail:'https://static.dafiti.com.ar/p/aloud-2878-140437-1-product.jpg'})
  
  /* prodArr = await contenedor.getAll()
  prodNamesArr = await contenedor.getAllNames()
  prodNamesList = prodNamesArr.join(', ') */
}

guardarProductos(contenedor1)
////////////////////////////////////////////////////////////////////////////////////////////

const app = express()
const PORT = 8080

const server = app.listen(PORT, () => {
  console.log(`El servidor fue iniciado con exito desde el puerto : ${PORT}`)
})

///////////////////////////////////////////////////////////////////////////////////////

app.get('/productos', async (req, res) => {
  res.send(await contenedor1.getAll())
})

app.get('/productoRandom', async (req,res) => {
  const prodArr = await contenedor1.getAll()

  res.send(prodArr[Math.floor(Math.random() * prodArr.length)])
})

app.get('/', async (req, res) => {
  res.send(`Los productos disponibles en este momento son: ${(await contenedor1.getAllNames()).join(', ')}.`)
})






///////////////////////////////////////////////////////////////////////////////////////
server.on("error" , error => {console.log(`Hubo un error en el servidor: ${error}`)})