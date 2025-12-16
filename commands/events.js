import chalk from 'chalk'
import moment from 'moment-timezone'

export default async (client, m) => {
  client.ev.on('group-participants.update', async (anu) => {
  //  console.log(anu)
    try {
      const metadata = await client.groupMetadata(anu.id)
      const chat = global.db.data.chats[anu.id]
      const botId = client.user.id.split(':')[0] + '@s.whatsapp.net'
      const primaryBotId = chat?.primaryBot

      for (const p of anu.participants) {
        const jid = p.phoneNumber
        const phone = p.phoneNumber?.split('@')[0] || jid.split('@')[0]
        const pp = await client.profilePictureUrl(jid, 'image').catch(_ => 'https://cdn.stellarwa.xyz/files/1755559736781.jpeg')

        const fakeContext = {
          contextInfo: {
            externalAdReply: {
              title: global.db.data.settings[botId].namebot,
              body: dev,
              mediaUrl: null,
              description: null,
              previewType: 'PHOTO',
              thumbnailUrl: pp,
              sourceUrl: global.db.data.settings[client.user.id.split(':')[0] + "@s.whatsapp.net"].link,
              mediaType: 1,
              renderLargerThumbnail: false
            },
            mentionedJid: [jid]
          }
        }

        if (anu.action === 'add' && chat?.welcome && (!primaryBotId || primaryBotId === botId)) {
  const caption = `🦩 Welcome!!! @${phone}`
          await client.reply(m.chat, caption, m, fakeContext)
        }

        if ((anu.action === 'remove' || anu.action === 'leave') && chat?.welcome && (!primaryBotId || primaryBotId === botId)) {
          const caption = `🦩 Adiós!!! @${phone}`
          await client.reply(m.chat, caption, m, fakeContext)
        }

        if (anu.action === 'promote' && chat?.alerts && (!primaryBotId || primaryBotId === botId)) {
          const usuario = anu.author
          await client.sendMessage(anu.id, {
            text: `「✎」 *@${phone}* ha sido promovido a Administrador por *@${usuario.split('@')[0]}.*`,
            mentions: [jid, usuario]
          })
        }

        if (anu.action === 'demote' && chat?.alerts && (!primaryBotId || primaryBotId === botId)) {
          const usuario = anu.author
          await client.sendMessage(anu.id, {
            text: `「✎」 *@${phone}* ha sido degradado de Administrador por *@${usuario.split('@')[0]}.*`,
            mentions: [jid, usuario]
          })
        }
      }
    } catch (err) {
      console.log(chalk.gray(`[ BOT  ]  → ${err}`))
    }
  })
}