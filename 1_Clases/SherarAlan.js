class Usuario {

    constructor (nombre ="", apellido ="", libros = [{}], mascotas = []) {
        this.firstName = nombre;
        this.lastName = apellido;
        this.libros = libros;
        this.mascotas = mascotas;    
    }

    getFullName(){
    //     //String. Retorna el completo del usuario. Utilizar template strings.
        let fullName = `${this.firstName} ${this.lastName}`;
        return fullName;        
    }
    addMascota(nombreMascota){
        //void. Recibe un nombre de mascota y lo agrega al array de mascotas.
        this.mascotas.push(nombreMascota);
    }
    countMascotas(){
        //Number. Retorna la cantidad de mascotas que tiene el usuario.
        return this.mascotas.length;
    }
    addBook(nombreLibro ="", autorLibro=""){
        //void. Recibe un string 'nombre' y un string 'autor' y debe agregar un objeto: { nombre: String, autor: String } al array de libros.
        this.libros.push({nombre: nombreLibro, autor: autorLibro});
    }
    getBookNames(){
        // String[]. Retorna un array con sólo los nombres del array de libros del usuario.
        const bookNames = [];
        let i = 0;
        while (i < (this.libros.length)) {
            bookNames.push(this.libros[i].nombre);
            i++;
        }
        return bookNames;
    }    

}

const usuario1 = new Usuario("Alan", "Sherar", [{nombre: "Crónicas de una muerte anunciada", autor: "Gabriel García Márquez"},{nombre:"Viaje al centro de la Tierra",autor:"Julio Verne"}], ["Firulais","Lupita","Waffles"])

console.log(usuario1.getFullName());
usuario1.addMascota("Luna");
console.log(usuario1.countMascotas());
usuario1.addBook("Harry Potter y la piedra filosofal","J. K. Rowling");
console.log(usuario1.getBookNames());
