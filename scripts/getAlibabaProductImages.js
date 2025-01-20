import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import fs from "fs";
import path from "path";

puppeteer.use(StealthPlugin());

const url = "https://www.alibaba.com/product-detail/IP66-30X-optical-zoom-icsee-HD_1600930630253.html?spm=a2756.trade-list-buyer.0.0.2bce76e98ELDA7";
const downloadDirectory = path.join(process.cwd(), "downloaded-images");

(async () => {
  try {
    console.log("Launching browser...");
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();

    console.log("Setting user-agent...");
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    );

    console.log("Navigating to page...");
    await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });

    console.log("Extracting image URLs...");
    const imageUrls = await page.evaluate(() => {
      const slides = document.querySelectorAll('div[data-testid="media-image"] img');
      return Array.from(slides).map((img) => img.src.startsWith("//") ? `https:${img.src}` : img.src);
    });

    console.log(`Found ${imageUrls.length} images in the carousel.`);
    if (!fs.existsSync(downloadDirectory)) {
      fs.mkdirSync(downloadDirectory, { recursive: true });
    }

    for (const [index, imageUrl] of imageUrls.entries()) {
      console.log(`Downloading image ${index + 1}...`);
      const view = await page.goto(imageUrl, { timeout: 0 });
      const buffer = await view.buffer();
      const filePath = path.join(downloadDirectory, `image-${index + 1}.jpg`);

      fs.writeFileSync(filePath, buffer);
      console.log(`Saved image ${index + 1} to ${filePath}`);
    }

    console.log("All images downloaded successfully!");
    await browser.close();
  } catch (error) {
    console.error("An error occurred:", error);
  }
})();
