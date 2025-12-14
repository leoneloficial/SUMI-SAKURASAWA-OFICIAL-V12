export default {
  command: ['setlink'],
  category: 'socket',
  run: async (client, m, args) => {
    const idBot = client.user.id.split(':')[0] + '@s.whatsapp.net'
    const config = global.db.data.settings[idBot]

    const isOwner2 = [idBot, ...global.owner.map(num => num + '@s.whatsapp.net')].includes(m.sender)
    if (!isOwner2 && m.sender !== owner) return m.reply(mess.socket)

    const value = args.join(' ').trim()

    if (!value || (!value.startsWith('https://') && !value.startsWith('http://'))) {
      return m.reply(
        `❀ Ingresa un enlace válido que comience con *https://* o *http://*.`
      )
    }

    config.link = value

    return m.reply(`❀ Se actualizó el link del Socket correctamente.\n✎ Nuevo link:\n> ${config.link}`)
  },
};