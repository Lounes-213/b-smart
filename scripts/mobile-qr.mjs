import QRCode from "../node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/index.js";
import os from "node:os";

// Find local IPv4 address
function getLocalIp() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name] || []) {
      if (iface.family === "IPv4" && !iface.internal) {
        return iface.address;
      }
    }
  }
  return "127.0.0.1";
}

const localIp = getLocalIp();
const serverPort = 38886;
const directUrl = `http://${localIp}:${serverPort}`;
const vercelUrl = "https://b-smart-five.vercel.app";

console.log("==================================================");
console.log("       📱 BS (b smart) MOBILE PAIRING QR CODE     ");
console.log("==================================================");
console.log(`\n1. Direct LAN URL (Wi-Fi): ${directUrl}`);
console.log(`2. Cloud Vercel URL:      ${vercelUrl}`);
console.log("\nScan had l-code b l-caméra dyal l-portable bach t-connecta direct:\n");

QRCode.toString(directUrl, { type: "terminal", small: true }, (err, qr) => {
  if (err) {
    console.error("Error generating QR:", err);
  } else {
    console.log(qr);
  }
  console.log("==================================================");
});
