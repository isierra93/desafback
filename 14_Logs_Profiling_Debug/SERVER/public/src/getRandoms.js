process.on("message", async msg => {
  const objeto = await getRandoms(msg.cant)
  process.send(objeto)
})

async function getRandoms(cant = 100000000) {
  const objeto = {}
  for (let i = 0; i < cant; i++) {
    const num = getRandomInt()
    if(objeto[num.valueOf()]){
      objeto[num.valueOf()]++
    }else{
      objeto[num.valueOf()] = 1
    }
  }
  return objeto
}

function getRandomInt(max = 1000) {
  return Math.ceil(Math.random() * 1000 )
}