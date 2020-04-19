#! /usr/bin/env node
const program = require('commander');
const chalk = require('chalk');
const logSymbols = require('log-symbols');
const tplList = require('./lib/tplList');
const tplInit = require('./lib/tplInit');
const version = require('./package.json').version;

/***  mj -V | --version ***/
program
    .version(version)

/*** mj init <template> <project> ***/
program
    .command('init <template> <project>')
    .description('初始化项目模版')
    .action((template, project) => {
        // 根据模版名下载对应模版，并以project为本地项目名
        const { downloadUrl } = tplList[template];
        tplInit.downloadFun(downloadUrl, project).then(() => {
            tplInit.inquirerFun(project)
                .then(() => {
                    console.log(logSymbols.success, chalk.yellow('项目初始化成功'));
                })
                .catch(err => {
                    console.log(logSymbols.error, chalk.red('项目初始化失败'));
                })
        }).catch(err => {})
    });

/*** mj list ***/
program
    .command('list')
    .description('查看所有模版')
    .action(() => {
        // 打印所有模版
        for (let i in tplList) {
            console.log(logSymbols.info, chalk.blue(`${i} ${tplList[i].description}`));
        }
    });

program.parse(process.argv);
