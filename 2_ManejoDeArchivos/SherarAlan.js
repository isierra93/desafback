const fs = require('fs')

class Contenedor{

    static ruta

    constructor(ruta){
        this.ruta = ruta
    }


    /* save(Object): Number - Recibe un objeto, lo guarda en el archivo, devuelve el id asignado */
    async save(prod){
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
        .then( () => {
            console.log(`se guardó exitosamente el producto: ${prod.title}`)
        })
        .catch( err => {
            console.log(err)
        })
        
        return idnum
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

const productos = new Contenedor('./productos.txt')

async function ejecutar(){
    /* let todos = await productos.getAll()
    console.log(JSON.stringify(todos,null,2)) */

    console.log('\nRevisemos si el contenedor traía productos:')
    console.log(await productos.getAll())

    await productos.save({title:'Remera', precio: 1500.99, thumbnail:'http://d3ugyf2ht6aenh.cloudfront.net/stores/001/719/894/products/remera_lisa_amarilla1-ad7aabde36568fbb6316249901780168-640-0.png'})

    await productos.save({title:'Pantalon', precio: 3500.99, thumbnail:'https://media.istockphoto.com/photos/mens-trousers-picture-id510615049?k=20&m=510615049&s=612x612&w=0&h=V2qWdnou1w6ctJnfiRlYxQp6QwgX8yRMBBOCMxm7ei0='})

    await productos.save({title:'Campera', precio: 15000.99, thumbnail:'https://static.dafiti.com.ar/p/aloud-2878-140437-1-product.jpg'})
    
    await productos.save({title:'Zapatillas', precio: 10500.99, thumbnail:'https://http2.mlstatic.com/D_NQ_NP_841231-MLA31356610949_072019-O.jpg'})

    //chequeo que se agregaron todos los productos
    console.log('\nRevisemos si el contenedor recibió todos los productos:')
    console.log(await productos.getAll())

    //Elimino el que tiene el id = 3
    console.log('\nQuiero eliminar el producto con id = 3:')
    await productos.deleteById(3)
    console.log(await productos.getAll())

    //Quiero ver los atributos del producto id = 1
    console.log('\nQuiero ver los atributos del producto con id = 1:')
    console.log(await productos.getById(1))

    //Quiero ver el nombre del producto con id = 2
    console.log('\nQuiero ver el nombre del producto con id = 2:')
    console.log((await productos.getById(2)).title)

    //Quiero eliminar todos los productos.
    console.log('\nEliminemos todos los productos...')
    await productos.deleteAll()

    //Quiero corroborar que estan todos los productos eliminados
    console.log('\nQuiero corroborar que estan todos los productos eliminados:')
    console.log(await productos.getAll())
    
}
    
ejecutar()