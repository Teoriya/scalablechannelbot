const { SlashCommandBuilder, ChannelType } = require("discord.js");
const scalableChannels = require("../../scalablevcs");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("add-scalable-vc")
    .setDescription("Sets a channel as scalable")
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("The channel to scale.")
        .addChannelTypes(ChannelType.GuildVoice)
        .setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName("max")
        .setDescription("Maximum number of channels")
        .setMinValue(1)
        .setMaxValue(10)
    ),

  async execute(interaction) {
    const max = interaction.options.getString("max") ?? "10";
    const channel = interaction.options.getChannel("channel");
    interaction.reply(await scalableChannels.addChannel(channel, max));
  },
};
