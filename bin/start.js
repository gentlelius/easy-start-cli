#!/usr/bin/env node
const inquirer = require("inquirer");
// const download = require('download-git-repo');
const Mustache = require('mustache');
const fs = require("fs");
const path = require("path");
const childProcess = require("child_process");
const fsExtra = require("fs-extra");
const chalk = require('chalk');

function replaceVariablesInFile(filePath, variables) {
  // 递归替换文件中的变量
  if (fs.statSync(filePath).isDirectory()) {
    fs.readdirSync(filePath).forEach((file) => {
      replaceVariablesInFile(path.join(filePath, file), variables);
    });
    return;
  }

  if (isNeedCompile(filePath)) {
    const content = fs.readFileSync(filePath, "utf8");
    const result = Mustache.render(content, variables);
    // 输出到目标文件夹
    fs.writeFileSync(filePath, result, "utf8");
  }
}

function isNeedCompile(file) {
  // 文件名为下列的才需要编译
  const list = [
    "config/libs/env.ts",
    "config/config.ts",
    "src/app.tsx",
    "package.json",
    'README.md'
  ];
  if (list.some((item) => file.endsWith(item))) {
    return true;
  }
  return false;
}

function download(arg1, arg2, arg3, fn) {
  fn();
}

function run() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "projectName",
        message: "Enter your project name:",
        default: "my-umi-project",
      },
      // {
      //   type: "list",
      //   name: "template",
      //   _message: "Choose a template:",
      //   get message() {
      //     return this._message;
      //   },
      //   set message(value) {
      //     this._message = value;
      //   },
      //   choices: [
      //     "github:username/template-repo",
      //     // Add more template options as needed
      //   ],
      // },
    ])
    .then((answers) => {
      const { projectName, template } = answers;

      console.log("Downloading template...");

      download(template, projectName, { clone: true }, (err) => {
        if (err) {
          console.error("Failed to download template:", err);
        } else {
          console.log("Template downloaded successfully!");

          // 在当前执行目录创建一个目录
          fs.mkdirSync(projectName);
          const templatePath = path.join(__dirname, "../template");
          // 复制 template 到当前 cli 执行目录
          const targetPath = path.join(process.cwd(), projectName);
          fsExtra.copySync(templatePath, targetPath);

          // 替换模板中的变量
          const templateVariables = { projectName: projectName };

          // 遍历 targetPath 目录，替换变量
          fs.readdirSync(targetPath).forEach((file) => {
            const filePath = path.join(targetPath, file);
            replaceVariablesInFile(filePath, templateVariables);
          });

          console.log("Template variables replaced successfully!");

          // 进入目标目录
          process.chdir(targetPath);

          // git init
          console.log("Initializing git repository...");
          childProcess.execSync("git init", { stdio: "inherit" });
          // 创建 .gitignore
          fs.writeFileSync(path.join(targetPath, ".gitignore"), `/node_modules
/.env.local
/.umirc.local.ts
/config/config.local.ts
/src/.umi
/src/.umi-production
/src/.DS_Store
/dist
/.idea`, "utf8");
          // git add
          childProcess.execSync("git add .", { stdio: "inherit" });
          // 根据 cli 中的参数判断是否执行 npm start
          const args = process.argv.slice(2);
          if (args.includes("--quick")) {

            // 执行 npm i
            console.log("Installing dependencies...");
            childProcess.execSync("npm i -f", { stdio: "inherit" });

            console.log("Dependencies installed successfully!");
            console.log("Project setup complete!");

            console.log("Starting project...");
            childProcess.execSync("npm start", { stdio: "inherit" });
          } else {
            console.log("\n✨ Project setup complete!\n");
            console.log('🚀 To get started: \n')
            console.log(chalk.cyan(` cd ${projectName}`));
            console.log(chalk.green(' npm i -f'));
            console.log(chalk.yellow(' npm start'));
          }
        }
      });
    });
}

function runBefore() {
  Mustache.tags = ['%%', '%%'];
}

runBefore();
run();
