const {Schema, model} = require('mongoose');

const channelSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    guildId: {
        type: String,
        required: true,
    },
    parentChannelId: {
        type: String,
        required: true,
    },
    max: {
        type: Number,
        required: true,
    }
},
{
    timestamps: true,
});

module.exports = model('channel', channelSchema, 'channels');