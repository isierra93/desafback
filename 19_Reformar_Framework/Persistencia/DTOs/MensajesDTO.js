class MensajesDto {
  constructor({ id, time, text, autor }) {
    this.id = id
    this.time = time
    this.text = text
    this.autor = {
      email: autor.email,
      alias: autor.alias,
      avatar: autor.avatar
    }
  }
}

export default function getMensajesDTO(data) {
  if (Array.isArray(data)) {
    return data.map(e => new MensajesDto(e))
  } else {
    return new MensajesDto(data)
  }
}