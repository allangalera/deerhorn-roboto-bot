'use strict';

const Telegraf = require('telegraf');
const AWS = require('aws-sdk');
const pug = require('pug');
const moment = require('moment');
const hash = require('object-hash');
const puppeteer = require('puppeteer-core');
const chromium = require('chrome-aws-lambda');
const ramda = require('ramda');

const s3 = new AWS.S3();
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const ddb = new AWS.DynamoDB();
const utils = require('./utils');

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

// add aiming level
// example: deer add_aim_lv 1 50 180 3 20
bot.hears(/^deer\sadd\_aim\_lv\s(\d+)\s(\d+)\s(\d+)\s(\d+)\s(\d+)$/i, async ctx => {
  let options = {};

  if (ctx.update.message.chat.type != 'private') {
    options.reply_to_message_id = ctx.update.message.message_id;
  }

  if (ctx.update.message.from.id !== 141347758) {
    return ctx.replyWithHTML('You are not an <b>Admin</b>!', options);
  }

  try {
    let response = await dynamoDb
      .get({
        TableName: process.env.SKILLS_TABLE_NAME,
        Key: {
          skillName: 'aiming',
          skillLevel: parseInt(ctx.match[1]),
        },
      })
      .promise();
    if (!ramda.isEmpty(response)) {
      return ctx.reply('Aiming level already added.', options);
    }
  } catch (e) {
    return ctx.reply('Error!', options);
  }
  const timeStamp = moment().toISOString();
  const aimingInfo = {
    TableName: process.env.SKILLS_TABLE_NAME,
    Item: {
      skillName: 'aiming',
      skillLevel: parseInt(ctx.match[1]),
      info: {
        bonus: parseInt(ctx.match[2]),
        timeToCharge: parseInt(ctx.match[3]),
      },
      spCost: parseInt(ctx.match[4]),
      unlockAt: parseInt(ctx.match[5]),
      createdAt: timeStamp,
      updatedAt: timeStamp,
    },
  };
  console.log(aimingInfo);
  try {
    let response = await dynamoDb.put(aimingInfo).promise();
    console.log(response);
    return ctx.reply('aiming level added', options);
  } catch (e) {
    console.log(e);
    return ctx.reply('Error!', options);
  }
});
// edit aiming level
bot.hears(/^deer\sedit\_aim\_lv\s(\d+)\s(\d+)\s(\d+)\s(\d+)\s(\d+)$/i, async ctx => {
  let options = {};

  if (ctx.update.message.chat.type != 'private') {
    options.reply_to_message_id = ctx.update.message.message_id;
  }

  if (ctx.update.message.from.id !== 141347758) {
    return ctx.replyWithHTML('You are not an <b>Admin</b>!', options);
  }

  try {
    let response = await dynamoDb
      .get({
        TableName: process.env.SKILLS_TABLE_NAME,
        Key: {
          skillName: 'aiming',
          skillLevel: parseInt(ctx.match[1]),
        },
      })
      .promise();
    if (ramda.isEmpty(response)) {
      return ctx.reply("Aiming level doens't exist. Try adding a new one.", options);
    }
  } catch (e) {
    return ctx.reply('Error!', options);
  }
  const timeStamp = moment().toISOString();
  const aimingInfo = {
    TableName: process.env.SKILLS_TABLE_NAME,
    Item: {
      skillName: 'aiming',
      skillLevel: parseInt(ctx.match[1]),
      info: {
        bonus: parseInt(ctx.match[2]),
        timeToCharge: parseInt(ctx.match[3]),
      },
      spCost: parseInt(ctx.match[4]),
      unlockAt: parseInt(ctx.match[5]),
      createdAt: timeStamp,
      updatedAt: timeStamp,
    },
  };
  console.log(aimingInfo);
  try {
    let response = await dynamoDb.put(aimingInfo).promise();
    console.log(response);
    return ctx.reply('aiming level edited', options);
  } catch (e) {
    console.log(e);
    return ctx.reply('Error!', options);
  }
});
// add mobility level
// bot.hears(/^deer\sadd\_mob\_lv\s(\d+)\s(\d+)$/i, async ctx => {
//   let options = {};

//   if (ctx.update.message.chat.type != 'private') {
//     options.reply_to_message_id = ctx.update.message.message_id;
//   }

//   if (ctx.update.message.from.id !== 141347758) {
//     return ctx.replyWithHTML('You are not an <b>Admin</b>!', options);
//   }

//   try {
//     let response = await dynamoDb
//       .get({
//         TableName: process.env.SKILLS_TABLE_NAME,
//         Key: {
//           skillName: 'mobility',
//           skillLevel: parseInt(ctx.match[1]),
//         },
//       })
//       .promise();
//     if (!ramda.isEmpty(response)) {
//       return ctx.reply('Mobility level already added.', options);
//     }
//   } catch (e) {
//     return ctx.reply('Error!', options);
//   }
//   const timeStamp = moment().toISOString();
//   const mobilityInfo = {
//     TableName: process.env.SKILLS_TABLE_NAME,
//     Item: {
//       skillName: 'mobility',
//       skillLevel: parseInt(ctx.match[1]),
//       info: {
//         returnBonus: parseInt(ctx.match[2]),
//         minutesToFullBonus: parseInt(ctx.match[3]),
//       },
//       spCost: parseInt(ctx.match[4]),
//       unlockAt: parseInt(ctx.match[5]),
//       createdAt: timeStamp,
//       updatedAt: timeStamp,
//     },
//   };
//   console.log(mobilityInfo);
//   try {
//     let response = await dynamoDb.put(mobilityInfo).promise();
//     console.log(response);
//     return ctx.reply('MObility level added', options);
//   } catch (e) {
//     console.log(e);
//     return ctx.reply('Error!', options);
//   }
// });
// edit mobility level
// bot.hears(/^deer\sedit\_mob\_lv\s(\d+)\s(\d+)$/i, async ctx => {
//   let options = {};

//   if (ctx.update.message.chat.type != 'private') {
//     options.reply_to_message_id = ctx.update.message.message_id;
//   }

//   if (ctx.update.message.from.id !== 141347758) {
//     return ctx.replyWithHTML('You are not an <b>Admin</b>!', options);
//   }

//   try {
//     let response = await dynamoDb
//       .get({
//         TableName: process.env.SKILLS_TABLE_NAME,
//         Key: {
//           skillName: 'mobility',
//           skillLevel: parseInt(ctx.match[1]),
//         },
//       })
//       .promise();
//     if (ramda.isEmpty(response)) {
//       return ctx.reply("Mobility level doens't exist. Try adding a new one.", options);
//     }
//   } catch (e) {
//     return ctx.reply('Error!', options);
//   }
//   const timeStamp = moment().toISOString();
//   const aimingInfo = {
//     TableName: process.env.SKILLS_TABLE_NAME,
//     Item: {
//       skillName: 'mobility',
//       skillLevel: parseInt(ctx.match[1]),
//       info: {
//         returnBonus: parseInt(ctx.match[2]),
//         minutesToFullBonus: parseInt(ctx.match[3]),
//       },
//       spCost: parseInt(ctx.match[4]),
//       unlockAt: parseInt(ctx.match[5]),
//       createdAt: timeStamp,
//       updatedAt: timeStamp,
//     },
//   };
//   console.log(aimingInfo);
//   try {
//     let response = await dynamoDb.put(aimingInfo).promise();
//     console.log(response);
//     return ctx.reply('Mobility level edited', options);
//   } catch (e) {
//     console.log(e);
//     return ctx.reply('Error!', options);
//   }
// });
// send aiming table
bot.hears(/^deer\s(?:\s+)?(?:aiming|aim)\s(?:\s+)?(?:level|levels|lv|lvl|lvls|table)$/i, async ctx => {
  let options = {};

  if (ctx.update.message.chat.type != 'private') {
    options.reply_to_message_id = ctx.update.message.message_id;
  }

  let tableData = {
    title: 'Skill: Aiming',
    headers: ['Level', 'Bonus', 'Time', 'SP', 'Unlock at'],
  };
  try {
    let response = await dynamoDb
      .query({
        TableName: process.env.SKILLS_TABLE_NAME,
        KeyConditionExpression: 'skillName = :skill',
        ExpressionAttributeValues: {
          ':skill': 'aiming',
        },
      })
      .promise();
    console.log(JSON.stringify(response.Items));
    tableData.rows = response.Items.map(item => {
      return [item.skillLevel, `${item.info.bonus}%`, `${item.info.timeToCharge} min`, item.spCost, item.unlockAt];
    });
  } catch (e) {
    console.log(e);
    return ctx.reply('Error!', options);
  }

  const fileName = `${hash(tableData)}.png`;

  let fileUrl = `https://${process.env.BUCKET_NAME}.s3.amazonaws.com/${fileName}`;

  // test if file already exist
  try {
    let doesFileExist = await s3
      .headObject({
        Bucket: process.env.BUCKET_NAME,
        Key: fileName,
      })
      .promise();

    if (doesFileExist) {
      return ctx.replyWithPhoto(fileUrl, options);
    }
  } catch (e) {
    console.log('FILE NOT FOUNT -> CREATING A NEW ONE');
  }

  try {
    const executablePath = await chromium.executablePath;

    const browser = await puppeteer.launch({
      args: chromium.args,
      executablePath,
    });

    const page = await browser.newPage();

    const template = pug.compileFile('./table.pug');

    const html = template(tableData);

    await page.setContent(html);

    let selector = '#elementToPrint';
    let padding = 10;

    const rect = await page.evaluate(selector => {
      const element = document.querySelector(selector);
      const { x, y, width, height } = element.getBoundingClientRect();
      return { left: x, top: y, width, height, id: element.id };
    }, selector);

    await page.setViewport({
      width: Math.ceil(rect.left + rect.width + padding * 2),
      height: Math.ceil(rect.top + rect.height + padding * 2),
    });

    let b64string = await page.screenshot({
      encoding: 'base64',
      clip: {
        x: rect.left - padding,
        y: rect.top - padding,
        width: rect.width + padding * 2,
        height: rect.height + padding * 2,
      },
    });

    const b64Data = new Buffer.from(b64string, 'base64');

    let response = await s3
      .upload({
        Bucket: process.env.BUCKET_NAME,
        Key: fileName,
        Body: b64Data,
        ACL: 'public-read',
        ContentType: 'image/png',
        ContentEncoding: 'base64',
      })
      .promise();

    return ctx.replyWithPhoto(fileUrl, options);
  } catch (e) {
    console.log(e);
    return ctx.reply('Error!', options);
  }
});
// send mobility table
// bot.hears(/^deer\s(?:\s+)?(?:mobility|mob)\s(?:\s+)?(?:level|levels|lv|lvl|lvls|table)$/i, async ctx => {
//   let options = {};

//   if (ctx.update.message.chat.type != 'private') {
//     options.reply_to_message_id = ctx.update.message.message_id;
//   }

//   return ctx.reply('wow...it works', options);
// });
// all user commands
bot.hears(/^deer\s(?:\s+)?commands/i, async ctx => {
  let options = {};

  if (ctx.update.message.chat.type != 'private') {
    options.reply_to_message_id = ctx.update.message.message_id;
  }

  let message = [
    `🦌</b>Deerhorn Roboto Commands</b>🦌`,
    ``,
    `<b>Basic:</b>deer aim <code>aiming_level</code>`,
    `<b>Description:</b> Tells how much aiming charge by the time of the command until battle time`,
    `<b>Example:</b> deer aim 12`,
    `=> <code>aiming_level</code> = 12`,
    `<b>Example:</b> deer aim 15`,
    `=> <code>aiming_level</code> = 15`,
    ``,
    `<b>Time Based:</b> deer add_aim_lv <code>aiming_level</code> <code>time_remainig</code>`,
    `<b>Description:</b> Tells how much aiming charge calculated using the <code>aiming_level</code> and <code>time_remainig</code>`,
    `<b>Example:</b> deer aim 12 12`,
    `=> <code>aiming_level</code> = 12`,
    `=> <code>time_remainig</code> = 12 minutes`,
    `<b>Example:</b> deer aim 12 1h`,
    `=> <code>aiming_level</code> = 12`,
    `=> <code>time_remainig</code> = 60 minutes`,
    `<b>Example:</b> deer aim 17 1h12`,
    `=> <code>aiming_level</code> = 17`,
    `=> <code>time_remainig</code> = 72 minutes`,
  ].join('\n');

  return ctx.replyWithHTML(message, options);
});
// all admin commands
bot.hears(/^deer\s(?:\s+)?admin(?:\s+)?commands/i, async ctx => {
  let options = {};

  if (ctx.update.message.chat.type != 'private') {
    options.reply_to_message_id = ctx.update.message.message_id;
  }

  if (ctx.update.message.from.id !== 141347758) {
    return ctx.reply('You are not an Admin', options);
  }

  let message = [
    `🦌</b>Deerhorn Roboto Admin Commands</b>🦌`,
    ``,
    `<b>Edit:</b> deer edit_aim_lv <code>aiming_level</code> <code>max_charge</code> <code>time_to_charge</code> <code>sp_cost</code> <code>unlock_at</code>`,
    `<b>Description:</b> Edit aiming level`,
    `<b>Example:</b> deer edit_aim_lv 20 68 40 3 70`,
    `=> <code>aiming_level</code> = 20`,
    `=> <code>max_charge</code> = 68`,
    `=> <code>time_to_charge</code> = 40`,
    `=> <code>sp_cost</code> = 3`,
    `=> <code>unlock_at</code> = 70`,
    ``,
    `<b>Add:</b> deer add_aim_lv <code>aiming_level</code> <code>max_charge</code> <code>time_to_charge</code> <code>sp cost</code> <code>unlock lvl</code>`,
    `<b>Description:</b> Add aiming level`,
    `<b>Example:</b> deer add_aim_lv 20 68 40 3 70`,
    `=> <code>aiming_level</code> = 20`,
    `=> <code>max_charge</code> = 68`,
    `=> <code>time_to_charge</code> = 40`,
    `=> <code>sp_cost</code> = 3`,
    `=> <code>unlock_at</code> = 70`,
  ].join('\n');

  return ctx.replyWithHTML(message, options);
});
// calculate aiming
bot.hears(/^deer\s(?:\s+)?(?:aiming|aim)\s(?:\s+)?(\d+)\s(?:\s+)?(\d+)(?:\s+)?h(?:\s+)?(\d+)$/i, async ctx => {
  let options = {};

  if (ctx.update.message.chat.type != 'private') {
    options.reply_to_message_id = ctx.update.message.message_id;
  }

  try {
    let response = await dynamoDb
      .get({
        TableName: process.env.SKILLS_TABLE_NAME,
        Key: {
          skillName: 'aiming',
          skillLevel: parseInt(ctx.match[1]),
        },
      })
      .promise();
    if (ramda.isEmpty(response)) {
      return ctx.reply("Aiming level doens't exist.", options);
    }

    let result = utils.calculateAimingBonus(
      response.Item.info.bonus,
      response.Item.info.timeToCharge,
      (parseInt(ctx.match[2]) * 60 + parseInt(ctx.match[3])) * 60,
    );

    console.log(result);

    let message = [
      `<b>Aiming lvl:</b> ${ctx.match[1]}`,
      `<b>Result:</b> ${result.bonus}%`,
      `<b>Time left:</b> ${result.timeLeft} minute(s)`,
    ].join('\n');

    return ctx.replyWithHTML(message, options);
  } catch (e) {
    console.log('ERROR ', e);
    return ctx.reply('Error!', options);
  }
});
// calculate aiming
bot.hears(/^deer\s(?:\s+)?(?:aiming|aim)\s(?:\s+)?(\d+)\s(?:\s+)?(\d+)$/i, async ctx => {
  let options = {};

  if (ctx.update.message.chat.type != 'private') {
    options.reply_to_message_id = ctx.update.message.message_id;
  }

  try {
    let response = await dynamoDb
      .get({
        TableName: process.env.SKILLS_TABLE_NAME,
        Key: {
          skillName: 'aiming',
          skillLevel: parseInt(ctx.match[1]),
        },
      })
      .promise();
    if (ramda.isEmpty(response)) {
      return ctx.reply("Aiming level doens't exist.", options);
    }

    let result = utils.calculateAimingBonus(
      response.Item.info.bonus,
      response.Item.info.timeToCharge,
      parseInt(ctx.match[2]) * 60,
    );

    console.log(result);

    let message = [
      `<b>Aiming lvl:</b> ${ctx.match[1]}`,
      `<b>Result:</b> ${result.bonus}%`,
      `<b>Time left:</b> ${result.timeLeft} minute(s)`,
    ].join('\n');

    return ctx.replyWithHTML(message, options);
  } catch (e) {
    console.log('ERROR ', e);
    return ctx.reply('Error!', options);
  }
});
// calculate aiming deer aim aiming_level hours_remainging
bot.hears(/^deer\s(?:\s+)?(?:aiming|aim)\s(?:\s+)?(\d+)\s(?:\s+)?(\d+)(?:\s+)?h$/i, async ctx => {
  let options = {};

  if (ctx.update.message.chat.type != 'private') {
    options.reply_to_message_id = ctx.update.message.message_id;
  }

  try {
    let response = await dynamoDb
      .get({
        TableName: process.env.SKILLS_TABLE_NAME,
        Key: {
          skillName: 'aiming',
          skillLevel: parseInt(ctx.match[1]),
        },
      })
      .promise();
    if (ramda.isEmpty(response)) {
      return ctx.reply("Aiming level doens't exist.", options);
    }

    let result = utils.calculateAimingBonus(
      response.Item.info.bonus,
      response.Item.info.timeToCharge,
      parseInt(ctx.match[2]) * 60 * 60,
    );

    console.log(result);

    let message = [
      `<b>Aiming lvl:</b> ${ctx.match[1]}`,
      `<b>Result:</b> ${result.bonus}%`,
      `<b>Time left:</b> ${result.timeLeft} minute(s)`,
    ].join('\n');

    return ctx.replyWithHTML(message, options);
  } catch (e) {
    console.log('ERROR ', e);
    return ctx.reply('Error!', options);
  }
});
// calculate aiming -> deer aim aiming_level
bot.hears(/^deer\s(?:\s+)?(?:aiming|aim)\s(?:\s+)?(\d+)$/i, async ctx => {
  let options = {};

  if (ctx.update.message.chat.type != 'private') {
    options.reply_to_message_id = ctx.update.message.message_id;
  }

  try {
    let response = await dynamoDb
      .get({
        TableName: process.env.SKILLS_TABLE_NAME,
        Key: {
          skillName: 'aiming',
          skillLevel: parseInt(ctx.match[1]),
        },
      })
      .promise();
    if (ramda.isEmpty(response)) {
      return ctx.reply("Aiming level doens't exist.", options);
    }

    let result = utils.calculateAimingBonus(
      response.Item.info.bonus,
      response.Item.info.timeToCharge,
      utils.timeUntilNextBattle(),
    );

    console.log(result);

    let message = [
      `<b>Aiming lvl:</b> ${ctx.match[1]}`,
      `<b>Result:</b> ${result.bonus}%`,
      `<b>Time left:</b> ${result.timeLeft} minute(s)`,
    ].join('\n');

    return ctx.replyWithHTML(message, options);
  } catch (e) {
    console.log('ERROR ', e);
    return ctx.reply('Error!', options);
  }
});

module.exports.webhook = async event => {
  console.log(event.body);

  await bot.handleUpdate(JSON.parse(event.body));

  return {
    statusCode: 200,
    body: '',
  };
};
