const input = process.argv.slice(2)

const id = input[0]

const data = {
  title : input[1],
  price : Number(input[2]),
  thumbnail : input[3]
}
export {
  id,
  data
}