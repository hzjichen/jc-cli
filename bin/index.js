#! /usr/bin/env node

const chalk = require("chalk"); // 命令行输出美化
const figlet = require("figlet");
const path = require("path");
const fs = require("fs-extra");
const inquirer = require("inquirer");
// 命令行工具
const { Command } = require("commander"); 
const program = new Command();

// 创建项目
const createProject = async (name) => {
  // 当前命令行执行的目录
  const cwd = process.cwd();
  // 需要创建的目录
  const targetPath = path.join(cwd, name);
  // 目录是否存在
  if (fs.existsSync(targetPath)) {
    let { action } = await inquirer.prompt([
      {
        name: "action",
        type: "list",
        message: "目录已存在，请选择:",
        choices: [
          {
            name: "覆盖",
            value: "overwrite",
          },
          {
            name: "取消",
            value: false,
          },
        ],
      },
    ]);

    if (!action) {
      return;
    } else if (action === "overwrite") {
      // 移除已存在的目录
      await fs.remove(targetPath);
      await fs.mkdir(targetPath);
    }
  } else {
    // 目录不存在正常创建
    fs.mkdir(targetPath);
  }
};

// 输出样式
program.on("--help", () => {
  console.log(
    "\r\n" +
      chalk.white.bgBlueBright.bold(
        figlet.textSync("JCAE", {
          font: "Blocks",
          horizontalLayout: "default",
          verticalLayout: "default",
        })
      )
  );
  console.log(
    `\r\nRun ${chalk.cyan(
      `jc-cli <command> --help`
    )} for detailed usage of given command\r\n`
  );
});

program.name("jc-cli").description("这里是描述文案").version("1.0.0");

program
  .command("create <name>")
  .description("创建一个新工程")
  .action((name) => {
    createProject(name);
  });

program.parse(process.argv);
