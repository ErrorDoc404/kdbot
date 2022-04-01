module.exports = async (client, guild) => {

  try{
    const findGuild = await Module.findOneAndUpdate({guildId: guild.id }, {
      channelCreate: false,
      channelDelete: false,
      channelUpdate: false,
      guildMemberAdd: false,
      guildMemberAddRemove: false,
      guildMemberUpdate: false,
      messageReactionAdd: false,
      messageReactionRemove: false,
      messageUpdate: false,
      voiceStateUpdate: false,
    }, {new: true});
    if(findGuild){
      console.log('Module found');
    } else {
      const newGuild = await Module.create({
        guildId: guild.id,
      });
    }
  }catch (err){
    console.log(err);
  }

  try{
    const findGuildConfig = await GuildConfig.findOne({guildId: guild.id });
    if(findGuildConfig){
      console.log('Guild found');
    } else {
      const newGuildConfig = await GuildConfig.create({
        guildId: guild.id,
        prefix: '!',
      });
    }
  }catch (err){
    console.log(err);
  }
};
