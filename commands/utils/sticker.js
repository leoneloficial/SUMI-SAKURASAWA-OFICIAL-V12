import { spawn } from 'child_process'

export default {
command: ['sticker', 's'],
category: 'utils',
run: async (client, m) => {

try {
const quoted = m.quoted ? m.quoted : m
const mime = (quoted.msg || quoted).mimetype || ''

let user = globalThis.db.data.users[m.sender]
const name = user.name
let text1 = user.metadatos || `S'ᴛᴇʟʟᴀʀ 🧠 WᴀBᴏᴛ`
let text2 = user.metadatos2 || `@${name}`

if (mime === 'image/webp') {
const input = await quoted.download()

const ff = spawn('ffmpeg', [
'-i', 'pipe:0',
'-movflags', 'faststart',
'-pix_fmt', 'yuv420p',
'-f', 'mp4',
'pipe:1'
])

let buffer = Buffer.alloc(0)

ff.stdout.on('data', chunk => {
buffer = Buffer.concat([buffer, chunk])
})

ff.stdin.write(input)
ff.stdin.end()

ff.on('close', async () => {
await client.sendVideoAsSticker(
m.chat,
buffer,
m,
{ packname: text1, author: text2 }
)
})

return
}

if (/image/.test(mime)) {
const media = await quoted.download()
let enc = await client.sendImageAsSticker(m.chat, media, m, { packname: text1, author: text2 })
return
}

if (/video/.test(mime)) {
if ((quoted.msg || quoted).seconds > 20) return m.reply('ꕥ El video no puede ser muy largo')
const media = await quoted.download()
let enc = await client.sendVideoAsSticker(m.chat, media, m, { packname: text1, author: text2 })
return
}

return client.reply(m.chat, '✐ Por favor, envia una imagen, video o sticker animado.', m)

} catch (e) {
m.reply('Error: ' + e)
}}
}