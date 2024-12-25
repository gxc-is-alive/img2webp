// 读取images/4399的所有文件
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const sharp = require("sharp");

const IMG_PATH = "./images";
const EXPORT_PATH = "./webp-images";

// 把所有图片转换成webp（使用cwebp）

const convertToWebp = async (file, commonPath, output) => {
  console.log(output);
  try {
    await sharp(file)
      .toFormat("webp")
      .webp({ quality: 80, effort: 6 })
      .toFile(output);
  } catch (e) {
    console.error(e);
  }
};

// 删除webp-images文件夹(第一次可能不存在)
if (fs.existsSync(EXPORT_PATH)) {
  fs.rmSync(EXPORT_PATH, { recursive: true });
}
// 创建webp-images文件夹
fs.mkdirSync(EXPORT_PATH);

const imagesPath = path.join(__dirname, IMG_PATH);
const webpImagesPath = path.join(__dirname, EXPORT_PATH);

// 遍历images文件夹
const traverseAndConvert = (currentPath, outputPath) => {
  const items = fs.readdirSync(currentPath);

  items.forEach((item) => {
    const itemPath = path.join(currentPath, item);
    const outputItemPath = path.join(outputPath, item);

    if (fs.statSync(itemPath).isDirectory()) {
      // 如果是文件夹，递归遍历
      fs.mkdirSync(outputItemPath, { recursive: true });
      traverseAndConvert(itemPath, outputItemPath);
    } else {
      // 如果是文件，检查是否为图片
      if (item.includes(".webp") || item.includes(".gif")) {
        return;
      }

      fs.readFile(itemPath, (err, data) => {
        if (err) {
          console.error(err);
          return;
        }

        const output = outputItemPath.replace(/\.[^.]+$/, ".webp");
        convertToWebp(data, currentPath, output);
      });
    }
  });
};

traverseAndConvert(imagesPath, webpImagesPath);
