import fetch from 'node-fetch'
import FormData from 'form-data'

export default {
  command: ['tourl'],
  category: 'utils',
  run: async (client, m, args) => {
    try {
      const q = m.quoted || m
      const mime = q.mimetype || q.msg?.mimetype || ''

      if (!mime) return m.reply(`《✧》 Envía una *imagen* junto al comando *${prefa}tourl*`)
      if (!/image\/(jpe?g|png)/.test(mime)) {
        return m.reply(`《✧》 El formato *${mime}* no es compatible`)
      }

      const buffer = await q.download()
      const url = await uploadToUguu(buffer)

      if (!url) return m.reply('《✧》 No se pudo *subir* la imagen')

      return m.reply(`✅ *Imagen subida correctamente*\n${url}`)
    } catch (err) {
      console.error(err)
      return m.reply(magglobal)
    }
  },
}

async function uploadToUguu(buffer) {
  const body = new FormData()
  body.append('files[]', buffer, 'image.jpg')

  const res = await fetch('https://uguu.se/upload.php', {
    method: 'POST',
    body,
    headers: body.getHeaders(),
  })

  const json = await res.json()
  return json.files?.[0]?.url
}