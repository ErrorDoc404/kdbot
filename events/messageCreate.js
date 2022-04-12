const GuildConfig = require("../mongoose/database/schemas/GuildConfig");
const RankRole = require("../mongoose/database/schemas/RankRole");
const Level = require("../mongoose/database/schemas/Level");
const client = require("../library/DiscordModerationBot");

/**
 *
 * @param {import("../library/DiscordModerationBot")} client
 */
module.exports = async (client, message) => {
  if (message.author.bot || message.channel.type === "dm") return;
  const serverGuildConfig = await GuildConfig.findOne({guildId: message.guild.id});
  let prefix = serverGuildConfig.prefix;

  let GuildDB = await client.GetGuild(message.guild.id);
  if (GuildDB && GuildDB.prefix) prefix = GuildDB.prefix;

  const prefixMention = new RegExp(`^<@!?${client.user.id}> `);
  prefix = message.content.match(prefixMention) ? message.content.match(prefixMention)[0] : prefix;

  try{
    let xpAdd = Math.floor(Math.random() * 5) + 15;
    let user_data = await Level.findOne({guildId: message.guild.id, userID: message.author.id });
    if(!message.content.startsWith(`${prefix}`)){
      if(user_data){
        let xp = user_data.xp;
        let level = user_data.level;
        let levelXp = 5 * (level ^ 2) + (50 * level) + 100;
        let totalXp = user_data.totalXp;
        totalXp = totalXp + xpAdd;
        xp = xp + xpAdd;
        if(xp > levelXp){
          xp = xp - levelXp;
          level++;

          const findRankRole = await RankRole.findOne({guildId: GuildDB.guildId, level: level });

          if(findRankRole){
            if(user_data.rankRole)
              message.member.roles.remove(user_data.rankRole).catch((err) => client.error(`${err}`));
            await Level.findOneAndUpdate({guildId: message.guild.id, userID: message.author.id },{
              rankRole: findRankRole.roleId,
            },{new: true});
            message.member.roles.add(findRankRole.roleId).catch((err) => {
              client.error(`Missing Access: ${err}`);

              message.member.user.send(`You didnt get levelXp earn role in ${message.member.guild.name}. Please talk to server admins for this issue`)
              .catch((err) => client.error(`${err}`));
            });
          }
        }
        var rank = parseInt(user_data.rank);
        let pre_user = await Level.findOne({guildId: message.guild.id, rank: (rank-1) });
        if(pre_user){
          if(totalXp > pre_user.totalXp){
            await Level.findOneAndUpdate({guildId: message.guild.id, userID: pre_user.userID },{
              rank: (parseInt(pre_user.rank) + 1)
            });

            await Level.findOneAndUpdate({guildId: message.guild.id, userID: message.author.id },{
              rank: (rank-1)
            });
          }
        }
        await Level.findOneAndUpdate({guildId: message.guild.id, userID: message.author.id },{
          xp: xp,
          totalXp: totalXp,
          level: level
        });
      }else {
        const totalUser = await Level.find({guildId: message.guild.id});
        const newUserRank = totalUser.length + 1;
        const newUser = await Level.create({
          guildId: message.guild.id,
          userID: message.author.id,
          xp: xpAdd,
          totalXp: xpAdd,
          level: 1,
          rank: newUserRank
        });

        const findRankRole = await RankRole.findOne({guildId: GuildDB.guildId, level: 1 });

        if(findRankRole){
          await Level.findOneAndUpdate({guildId: message.guild.id, userID: message.author.id },{
            rankRole: findRankRole.roleId,
          },{new: true});
          message.member.roles.add(findRankRole.roleId).catch((err) => {
            client.error(`Missing Access: ${err}`);

            message.member.user.send(`You didnt get levelXp earn role in ${message.member.guild.name}. Please talk to server admins for this issue`)
            .catch((err) => client.error(`${err}`));
          });
        }

      }
    }

  } catch(err){
    console.log(err);
  }

  if (message.content.indexOf(prefix) !== 0) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  //Making the command lowerCase because our file name will be in lowerCase
  const command = args.shift().toLowerCase();

  //Searching a command
  const cmd =
    client.commands.get(command) ||
    client.commands.find((x) => x.aliases && x.aliases.includes(command));

  //Executing the codes when we get the command or aliases
  if (cmd) {
    if(message.channel.permissionsFor(message.member).has([`${cmd.permissions.member}`])){

    }
    else if (
      (cmd.permissions &&
        cmd.permissions.channel &&
        !message.channel
          .permissionsFor(client.user)
          .has(cmd.permissions.channel)) ||
      (cmd.permissions &&
        cmd.permissions.member &&
        !message.channel
          .permissionsFor(message.member)
          .has(cmd.permissions.member)) ||
      (cmd.permissions &&
        GuildDB.modRole &&
        !message.channel
          .permissionsFor(message.member)
          .has(["ADMINISTRATOR"]) &&
        !message.member.roles.cache.has(GuildDB.modRole))
    )
      return client.sendError(
        message.channel,
        "Missing Permissions!" + GuildDB.modRole
          ? " You need the Special role to access this command. Ask Guild Admins for help"
          : ""
      );

      if(cmd.premium){
        return client.premuimError(
          message.channel,
          "This feature is only available on Premium servers."
        );
      }
    cmd.run(client, message, args, { GuildDB });
    client.CommandsRan++;
  } else return;



};
