const { SlashCommandBuilder, ChannelType } = require("discord.js");
const channelModel = require("../../models/channels.model");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("view-scalable-vcs")
    .setDescription("view all scalable channles on the server."),

  async execute(interaction) {
    const guildId = interaction.guild.id;
    const channels = await channelModel.find({
      guildId
    })

    if(channels.length === 0) {
      return interaction.reply({
        content: "No scalable channel exists on this server",
        ephemeral: true,
      });
    }

    return interaction.reply({
      content: channels.map((channel) => `${channel.name} in <#${channel.parentChannelId}>`).join(", "),
      ephemeral: true,
    })
  },
};
