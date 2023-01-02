const fs = require('fs')

class Productos {
  
  constructor(ruta){
    this.ruta = ruta
  }

  /* save(Object): Number - Recibe un objeto, lo guarda en el archivo, devuelve el id asignado */
  async save(obj) {

    //recibo el archivo como array de objetos
    const file = await this.getAll()

    //decidimos id
    let idnum = 1
    if (file.length > 0) {
      idnum = file[file.length - 1].id + 1
    }
    //creamos su timestamp
    let timestamp = Date.now();
    
    //añadimos id y timestamp al objeto
    obj = {id: idnum, timestamp: timestamp, ...obj}
    
    //pusheo objeto al array
    file.push(obj)

    await fs.promises.writeFile(this.ruta, JSON.stringify(file, null, 2))
    .then( () => {
      console.log(`se guardó exitosamente: ${JSON.stringify(obj)}`)
    })
    .catch( err => {
      console.log(err)
    })
    
  return idnum
  }

  /* getById(Number): Object - Recibe un id y devuelve el objeto con ese id, o null si no está. */
  async getById(id) {
    //recibo el archivo como array de objetos
    try {
        const file = await this.getAll()
        
        let prod = null

        let i = 0
        while (i<file.length) {
            if ( file[i] && file[i].id == id) {
                prod = file[i];
            }
            i++
        }
        
        return prod
        
    } catch (error) {
        
    }
  }
  
  /* Recibe un id y un objeto, actualiza el objeto con ese id, y lo devuelve como objeto */
  async putById(id, obj){
    const productos = await this.getAll();
    if(productos.length == 0){
      return {error:"No se encontraron productos"}
    }
    /* Bucle buscando ids iguales y si encuentra actualizo atributos del producto en i*/
    let i = 0;
    while (i < productos.length && i != id) {
      if (productos[i].id == id) {
        productos[i].timestamp = Date.now();
        productos[i].nombre = obj.nombre;
        productos[i].descripcion = obj.descripcion;
        productos[i].codigo = obj.codigo;
        productos[i].foto = obj.foto;
        productos[i].precio = obj.precio;
        productos[i].stock = obj.stock;

        await fs.promises.writeFile(this.ruta, JSON.stringify(productos, null, 2))
        return productos[i]
      }
      i++
    }
    /* Si sale del bucle sin ejecutar next() */
    return { error:'Producto no encontrado'};

  }
  /* getAll(): Object[] - Devuelve un array con los objetos presentes en el archivo */
  async getAll() {
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
  async deleteById(id) {
    try {

        const file = await this.getAll()

        let i = 0
        while (i < file.length && i<id) {
            if (file[i] && file[i].id == id) {
                console.log(`Producto: ${(await this.getById(id)).nombre}. Eliminado con éxito.`)
                file.splice(i,1)
            }
            i++
        }
        
        await fs.promises.writeFile(this.ruta, JSON.stringify(file, null, 2))


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



module.exports = Productos
