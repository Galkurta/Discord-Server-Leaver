# Discord Server Leaver

An interactive CLI tool to help you leave multiple Discord servers easily. This tool provides a user-friendly interface to select and leave multiple servers at once.

## Features

- Interactive CLI interface with arrow key navigation
- Server list pagination (10 servers per page)
- Multiple server selection
- Shows server join dates
- Alphabetically sorted server list
- Confirmation before leaving servers
- Visual feedback for successful/failed operations

## Prerequisites

- Node.js
- npm

## Installation

1. Clone this repository

```bash
git clone https://github.com/Galkurta/Discord-Server-Leaver.git
cd Discord-Server-Leaver
```

2. Install dependencies

```bash
npm install
```

3. Get your Discord token:
   - Open Discord in your web browser (https://discord.com/app)
   - Press **[Ctrl + Shift + I]** to open Developer Tools
   - Go to the "Console" tab
   - Paste this code and press Enter:

```javascript
window.webpackChunkdiscord_app.push([
  [Math.random()],
  {},
  (req) => {
    if (!req.c) return;
    for (const m of Object.keys(req.c)
      .map((x) => req.c[x].exports)
      .filter((x) => x)) {
      if (m.default && m.default.getToken !== undefined) {
        return copy(m.default.getToken());
      }
      if (m.getToken !== undefined) {
        return copy(m.getToken());
      }
    }
  },
]);
console.log("%cWorked!", "font-size: 50px");
console.log(`%cYou now have your token in the clipboard!`, "font-size: 16px");
```

- Your token will be automatically copied to your clipboard

4. Edit `.env` file in the root directory and paste your token:

```env
TOKEN=your_discord_token_here
```

## Usage

1. Start the application:

```bash
node main.js
```

2. Navigate through the interface using:

   - ↑↓ Arrow keys to move up/down the server list
   - Space to select/deselect servers
   - Enter to confirm selection
   - Ctrl+C to exit

3. Confirm your selection when prompted with 'y' or 'n'

## Interface Elements

```
Logged in as YourUsername#0000!
Total Servers: 50
Servers to leave: 3

Server List (Use arrow keys ↑↓ to navigate, Space to select, Enter to confirm):
Page 1/5

> [✓] 1. Server Name     │ Joined: 24 Nov 2023 15:30
  [ ] 2. Another Server  │ Joined: 25 Nov 2023 10:45
```

- `>` indicates current cursor position
- `[✓]` indicates selected server
- `[ ]` indicates unselected server

## Dependencies

- discord.js-selfbot-v13
- dotenv
- readline (Node.js built-in)

## Important Notes

- Using selfbots is against Discord's Terms of Service. Use at your own risk.
- Never share your Discord token with anyone.
- Keep your token private and secure.
- If your token is compromised, change your password immediately to generate a new token.
- The tool will ask for confirmation before leaving any servers.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Feel free to submit issues and pull requests.

## Disclaimer

This tool is for educational purposes only. The authors are not responsible for any consequences that may arise from using this tool, including but not limited to account termination or other punitive actions from Discord.

## Security Warning

- Your Discord token grants full access to your account. Keep it secure!
- Never paste your token in public places or share it with anyone.
- Avoid running scripts from untrusted sources that request your token.
- If you suspect your token has been compromised:
  1. Change your Discord password immediately
  2. Enable 2FA if not already enabled
  3. Review your account activity
  4. Revoke any suspicious sessions
