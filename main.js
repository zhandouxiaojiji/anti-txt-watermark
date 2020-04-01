const fs = require("fs");
const path = require("path");
const iconv = require("iconv-lite");
var pinyinlite = require('pinyinlite');

const INPUT = "./input";
const OUTPUT = "./output";

const checkPinyin = (arr, pinyin) => {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] == pinyin) {
      return true;
    }
  }
  return false;
}

const exportFile = (dir, filename) => {
  const newname = filename.replace("_再痕中文", '');
  console.log(`export file ${dir}/${filename} => ${newname}`);
  const fileStr = fs.readFileSync(path.join(INPUT, dir, filename), { encoding: 'binary' });
  var buf = Buffer.from(fileStr, 'binary');
  var str = iconv.decode(buf, 'gbk');
  // console.log("##", str);
  strs = str.split("\n"); //字符分割

  var lines = [];
  for (i = 0; i < strs.length; i++) {
    let line = strs[i];
    let s = line.substr(1, 3);
    let arr = pinyinlite(s);
    let match = false;
    if (arr.length >= 2) {
      if (checkPinyin(arr[0], "hen") && checkPinyin(arr[1], "zhong")) {
        match = true;
      }
    }
    if (match || i > strs.length - 8) {
      console.log("##", line);
    } else {
      lines.push(line);
    }
  }

  fs.writeFileSync(path.join(OUTPUT, dir, newname), lines.join("\n"));
}

const exportDir = (dir) => {
  console.log("export dir", path.join(INPUT, dir))
  const filenames = fs.readdirSync(path.join(INPUT, dir));
  filenames.forEach((filename) => {
    const stat = fs.statSync(path.join(INPUT, dir, filename))
    if (stat.isDirectory()) {
      fs.mkdirSync(path.join(OUTPUT, dir, filename));
      exportDir(filename);
    } else {
      exportFile(dir, filename);
    }
  })
}

exportDir("./");

