import knex from "knex"

export class DBCliente{

  constructor(options, tabla){
    this.options = options;
    this.table = tabla;
  }

  #connectDb() {
    return this.knex = knex(this.options)
  }
  async #destroyDb() {
    return await this.knex.destroy()
  }

  async crearTablaProductos(){
    this.#connectDb()
    if (!await this.knex.schema.hasTable(this.table)){
      return this.knex.schema.createTable(this.table, table => {
        table.increments("id").primary()
        table.string("title", 15).notNullable()
        table.double("price", 10).notNullable()
        table.string("thumbnail").notNullable()
      })
      .finally(()=>{
        this.#destroyDb()
      })
    }
  }
  async crearTablaMensajes(){
    this.#connectDb()
    if (!await this.knex.schema.hasTable(this.table)){
      return this.knex.schema.createTable(this.table, table => {
        table.increments("id").primary()
        table.string("author", 35).notNullable()
        table.string("text").notNullable()
        table.string("time")
      })
      .catch(err=>{console.log(err)})
      .finally(()=>{
        this.#destroyDb()
      })
    }
  }

  /* save(Object): Number - Recibe un objeto, lo guarda en el DB, devuelve el id asignado */
  async save(prod) {
    this.#connectDb()
    return this.knex(this.table).insert(prod)
      .then(() => {console.log("Ingresado/s correctamente")})
      .catch(err => {console.log(err)})
      .finally(()=>{
        this.#destroyDb()
      })
  }

  /* getById(Number): Object - Recibe un id y devuelve el objeto con ese id, o null si no está. */
  async getById(id) {
    this.#connectDb()
    return this.knex(this.table).select("*").where("id", "=", id)
      .finally(()=>{
        this.#destroyDb()
      })
  }

  /* getAll(): Object[] - Devuelve un array con los objetos presentes en el DB */
  async getAll() {
    this.#connectDb()
    return this.knex(this.table).select()
      .finally(()=>{
        this.#destroyDb()
      })
  }

  /* deleteById(Number): void - Elimina del DB el objeto con el id buscado. */
  async deleteById(id) {
    this.#connectDb()
    return this.knex(this.table).del().where("id", "=", id)
      .finally(()=>{
        this.#destroyDb()
      })
  }

  /* deleteAll(): void - Elimina todos los objetos presentes en el DB */
  async deleteAll(){
    this.#connectDb()
    return this.knex(this.table).del()
      .finally(()=>{
        this.#destroyDb()
      })
  }

}
