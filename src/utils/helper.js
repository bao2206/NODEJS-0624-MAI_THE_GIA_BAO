const fs = require("node:fs/promises");

const readFile = async () => {
  try {
    const data = await fs.readFile("data.txt", "utf-8");
    // console.log("show", JSON.parse(data));
    return JSON.parse(data || "[]");
  } catch (err) {
    return [];
  }
};
const writeFile = async (data) => {
  console.log(data);
  try {
    //không cần phải await các giá trị không cần trả về liền
    await fs.writeFile("data.txt", JSON.stringify(data, null, 2), "utf-8");
    console.log("Thanh cong");
  } catch (error) {
    console.log("That bai");
  }
};

module.exports = { writeFile, readFile };
