const channelModel = require("./models/channels.model");
const { ChannelType } = require("discord.js");

class ScalableChannels{
    channels = [];
    constructor(){
        channelModel.find().then(channels => {
            this.channels = channels.map(channel => `${channel.guildId}-${channel.parentChannelId}-${channel.name}`);
        })
    }
    async addChannel(channel,max){

        const channelExists = this.channels.includes(`${channel.guildId}-${channel.parentChannelId}-${channel.name}`) || await channelModel.findOne({
            guildId: channel.guildId,
            parentChannelId: channel.parentId,
        })
        if(channelExists){
            return "Channel is already scalable or some other scalable channel exists in the category.";
        }

        //check for giving permissions

        await channelModel.create({
            name: channel.name,
            guildId: channel.guildId,
            parentChannelId: channel.parentId,
            max: max
        })
        this.channels.push(`${channel.guildId}-${channel.parentId}-${channel.name}`);

        return "Channel set to scale.";

    }
    async removeChannel(channel){
        if(!channel.parentId)return "Channel is not scalable.";
        const channelExists = await channelModel.findOne({
            guildId: channel.guildId,
            parentChannelId: channel.parentId,
            name: channel.name
        })
        if(!channelExists){
            return "Channel is not scalable.";
        }

        await channelModel.deleteOne({
            guildId: channel.guildId,
            parentChannelId: channel.parentId,
            name: channel.name
        })
        this.channels = this.channels.filter(c => c !== `${channel.guildId}-${channel.parentId}-${channel.name}`);
        return "Channel removed.";
    }

    categoryExtraCheck(channel){
        if(channel?.parent.type !== ChannelType.GuildCategory)return;
        if(!this.channels.includes(`${channel.guildId}-${channel.parentId}-${channel.name}`)) return;
        const finalChannels = channel.parent.children.cache.filter(chan => (chan.type === ChannelType.GuildVoice && chan.members.size === 0 && channel.name == chan.name));
        return finalChannels.size
    }

    async handleVoiceStateUpdate(oldState, newState){
        if(!oldState?.channel?.parentId && !newState?.channel?.parentId)return;
        if(oldState?.channel?.id === newState?.channel?.id)return;
        if(oldState?.channel?.members.size === 0 && this.categoryExtraCheck(oldState.channel) > 1)
                await oldState.channel.delete();
        if(newState?.channel?.members.size === 1 && this.categoryExtraCheck(newState.channel) < 1)
                await newState.channel.clone();
    }

}

const scalableChannels = new ScalableChannels();
module.exports = scalableChannels;