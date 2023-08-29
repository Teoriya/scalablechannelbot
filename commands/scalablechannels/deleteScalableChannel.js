const { SlashCommandBuilder, ChannelType } = require("discord.js");
const scalableChannels = require("../../scalablevcs");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("remove-scalable-vc")
    .setDescription("Resets a channel as non-scalable")
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("The channel to reset.")
        .addChannelTypes(ChannelType.GuildVoice)
        .setRequired(true)
    ),

  async execute(interaction) {
    const channel = interaction.options.getChannel("channel");
    interaction.reply(await scalableChannels.removeChannel(channel));
  },
};
