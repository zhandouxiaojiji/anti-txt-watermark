const fs = require("fs");
const path = require("path");
const iconv = require("iconv-lite");
const pinyinUtil = require("ipinyinjs");

console.log(pinyinUtil)

const INPUT = "./input";
const OUTPUT = "./output";

const exportFile = (dir, filename) => {
  const newname = filename.replace("_再痕中文", '');
  console.log(`export file ${dir}/${filename} => ${newname}`);
  const fileStr = fs.readFileSync(path.join(INPUT, dir, filename), { encoding: 'binary' });
  var buf = Buffer.from(fileStr, 'binary');
  var str = iconv.decode(buf, 'gbk');
  // console.log("##", str);
  strs = str.split("\n"); //字符分割

  for (i = 0; i < strs.length; i++) {
    let s = strs[i];
    console.log("##", pinyinUtil.getPinyin(s[0]), pinyinUtil.getPinyin(s[1]), s);
  }
}

const exportDir = (dir) => {
  console.log("export dir", path.join(INPUT, dir))
  const filenames = fs.readdirSync(path.join(INPUT, dir));
  filenames.forEach((filename) => {
    const stat = fs.statSync(path.join(INPUT, dir, filename))
    if (stat.isDirectory()) {
      exportDir(filename);
    } else {
      exportFile(dir, filename);
    }
  })
}

exportDir("./");

