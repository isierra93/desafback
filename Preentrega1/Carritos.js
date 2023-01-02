const fs = require('fs')

class Carritos {
  
  constructor(ruta){
    this.ruta = ruta
  }

  async create(){
    //recibo el archivo como array de objetos
    const file = await this.getAll()

    //decidimos id
    let idnum = 1
    if (file.length > 0) {
      idnum = file[file.length - 1].id + 1
    }
        
    //añadimos id y timestamp al objeto
    const carrito = {id: idnum, timestamp: Date.now(), productos:[]}
    
    //pusheo objeto al array
    file.push(carrito)

    await fs.promises.writeFile(this.ruta, JSON.stringify(file, null, 2))
    .then(() => {
      console.log(`Se creó exitosamente:\n${JSON.stringify(carrito, null, 3)}`)
    })
    .catch( err => {
      console.log(err)
    })
    
  return idnum
  }
  /* save(Object): Number - Recibe un objeto, lo guarda en el archivo, devuelve el id asignado */
  async addProd(id, obj) {
    if(obj != null||undefined){
      //recibo los carritos como array de objetos
      const file = await this.getAll()
    
      //señalo el carrito especifico
      let i = 0
      while (i < file.length && i != id+1){
        if(file[i].id == id){

          //pusheo objeto en productos
          file[i].productos.push(obj)

          //guardo archivo
          await fs.promises.writeFile(this.ruta, JSON.stringify(file, null, 2))
          .then( () => {
            console.log(`Se guardó exitosamente: ${JSON.stringify(obj)}`)
          })
          .catch( err => {
            console.log(err)
          })
        }
        i++;
      }
    }
    
  }
  /* getById(Number): Object - Recibe un id y devuelve el objeto con ese id, o null si no está. */
  async getById(id) {
    //recibo el archivo como array de objetos
    try {
        const file = await this.getAll()
        
        let prod = null

        let i = 0
        while (i<=file.length && i<id) {
            if ( (file[i]) && (file[i].id == id) ) {
                prod = file[i]
            }
            i++
        }
        
        return prod
        
    } catch (error) {
        
    }
  }
  /* Recibe un id y un objeto, actualiza el objeto con ese id, y lo devuelve como objeto */
  async putById(id, obj){
    const database = await this.getAll();
    if(database.length == 0){
      return {error:"No se encontraron productos"}
    }
    /* Bucle buscando ids iguales y si encuentra actualizo atributos del producto en i*/
    let i = 1;
    while (i <= database.length && i != id) {
      if (database[i].id == id) {
        database[i].timestamp = Date.now();
        database[i].Nombre = obj.Nombre;
        database[i].Descripcion = obj.Descripcion;
        database[i].Codigo = obj.Codigo;
        database[i].Foto = obj.Foto;
        database[i].Precio = obj.Precio;
        database[i].Stock = obj.Stock;

        await fs.promises.writeFile(this.ruta, JSON.stringify(productos), null, 2)
        return obj
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
            if (file[i].id == id) {
                console.log(`Carrito: ${(await this.getById(id)).id}. Eliminado con éxito.`)
                file.splice(i,1)
            }
            i++
        }
        
        await fs.promises.writeFile(this.ruta, JSON.stringify(file, null, 2))


    } catch (error) {
        throw new Error(error)
    }
  }
  async deleteProdById(id, prodId) {
    //recibo los carritos como array de objetos
    const file = await this.getAll();
    
    //señalo el carrito especifico
    let i = 0;
    while (i < file.length && i != id){
      if(file[i].id == id){
        //señalo el producto especifico 
        let j = 0;
        while (j < file[i].productos.length && j != file[i].productos[j].id){
          if(file[i].productos[j].id == prodId){
            file[i].productos.splice(j,1);
          }
          j++;
        }


        //guardo archivo
        await fs.promises.writeFile(this.ruta, JSON.stringify(file, null, 2))
        .then( () => {
          console.log(`Se guardó exitosamente: ${JSON.stringify(obj)}`)
        })
        .catch( err => {
          console.log(err)
        })
      }
      i++;
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



module.exports = Carritos
