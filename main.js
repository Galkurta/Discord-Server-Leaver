const { Client } = require("discord.js-selfbot-v13");
const readline = require("readline");
const banner = require("./config/banner");
require("dotenv").config();

const client = new Client({
  checkUpdate: false,
});

// Constants
const LEAVE_DELAY = 5000; // 5 seconds delay between each leave

// Display banner when program starts
console.log(banner);

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Enable raw mode for reading key presses
readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);

// Utility function for delay
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Promise wrapper for readline question
function question(query) {
  return new Promise((resolve) => rl.question(query, resolve));
}

// Function to clear console and move cursor to top
function clearConsole() {
  console.clear();
  process.stdout.write("\x1B[0f");
  // Show banner again after clearing
  console.log(banner);
}

// Function to format join date
function formatDate(date) {
  const options = {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  return date.toLocaleDateString("en-US", options).replace(",", "");
}

// Function to display servers with pagination
function displayServers(servers, currentPage, selectedServers, currentIndex) {
  clearConsole();
  const itemsPerPage = 10;
  const totalPages = Math.ceil(servers.length / itemsPerPage);
  const start = currentPage * itemsPerPage;
  const end = Math.min(start + itemsPerPage, servers.length);

  console.log(`Logged in as ${client.user.tag}!`);
  console.log(`Total Servers: ${servers.length}`);
  console.log(`Servers to leave: ${selectedServers.length}\n`);

  console.log(
    "Server List (Use arrow keys ↑↓ to navigate, Space to select, Enter to confirm):"
  );
  console.log(`Page ${currentPage + 1}/${totalPages}\n`);

  // Find longest server name for padding
  const longestName = Math.max(...servers.map((s) => s.name.length));

  for (let i = start; i < end; i++) {
    const server = servers[i];
    const isSelected = selectedServers.some((s) => s.id === server.id);
    const isCurrent = i === currentIndex;
    const marker = isSelected ? "[✓]" : "[ ]";
    const indicator = isCurrent ? ">" : " ";
    const paddedName = server.name.padEnd(longestName);
    console.log(
      `${indicator} ${marker} ${String(i + 1).padEnd(
        3
      )}. ${paddedName} │ Joined: ${server.joinedAt}`
    );
  }

  if (selectedServers.length > 0) {
    console.log("\nSelected servers:");
    selectedServers.forEach((server) => {
      console.log(`- ${server.name} (Joined: ${server.joinedAt})`);
    });
  }
}

client.on("ready", async () => {
  // Sort guilds by name and include join date
  const servers = Array.from(client.guilds.cache.values())
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((guild, index) => ({
      index: index + 1,
      id: guild.id,
      name: guild.name,
      joinedAt: formatDate(guild.joinedAt),
    }));

  let currentPage = 0;
  let currentIndex = 0;
  let selectedServers = [];
  let isSelecting = true;

  displayServers(servers, currentPage, selectedServers, currentIndex);

  // Handle key presses
  process.stdin.on("keypress", (str, key) => {
    if (!isSelecting) return;

    const itemsPerPage = 10;
    const totalPages = Math.ceil(servers.length / itemsPerPage);

    if (key.name === "up") {
      if (currentIndex > 0) {
        currentIndex--;
        if (currentIndex < currentPage * itemsPerPage) {
          currentPage--;
        }
      }
    } else if (key.name === "down") {
      if (currentIndex < servers.length - 1) {
        currentIndex++;
        if (currentIndex >= (currentPage + 1) * itemsPerPage) {
          currentPage++;
        }
      }
    } else if (key.name === "space") {
      const server = servers[currentIndex];
      const isSelected = selectedServers.some((s) => s.id === server.id);
      if (isSelected) {
        selectedServers = selectedServers.filter((s) => s.id !== server.id);
      } else {
        selectedServers.push(server);
      }
    } else if (key.name === "return") {
      isSelecting = false;
      process.stdin.setRawMode(false);
      handleConfirmation();
      return;
    } else if (key.name === "c" && key.ctrl) {
      process.exit();
    }

    displayServers(servers, currentPage, selectedServers, currentIndex);
  });

  async function handleConfirmation() {
    if (selectedServers.length > 0) {
      console.log("\nServers to leave:");
      console.log(`Total: ${selectedServers.length} servers\n`);
      selectedServers.forEach((server) => {
        console.log(`- ${server.name} (Joined: ${server.joinedAt})`);
      });

      const confirm = await question("\nProceed with leaving servers? (y/n): ");

      if (confirm.toLowerCase() === "y") {
        console.log("\nStarting server leave process...");
        console.log(
          `Adding ${
            LEAVE_DELAY / 1000
          } seconds delay between each leave to avoid bans.\n`
        );

        for (let i = 0; i < selectedServers.length; i++) {
          const server = selectedServers[i];
          try {
            const guild = client.guilds.cache.get(server.id);
            await guild.leave();
            console.log(`✅ Successfully left server: ${server.name}`);

            // Show delay message if there are more servers to leave
            if (i < selectedServers.length - 1) {
              process.stdout.write("Waiting for next leave");
              const delaySteps = LEAVE_DELAY / 1000; // Convert to seconds
              for (let j = 0; j < delaySteps; j++) {
                await delay(1000);
                process.stdout.write(".");
              }
              console.log("\n");
            }
          } catch (error) {
            console.error(`❌ Failed to leave server ${server.name}:`, error);
          }
        }
      } else {
        console.log("Operation cancelled.");
      }
    } else {
      console.log("No servers selected.");
    }

    console.log("\nFinished.");
    rl.close();
    process.exit();
  }
});

client.login(process.env.TOKEN);
