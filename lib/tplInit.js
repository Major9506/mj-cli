const download = require('download-git-repo');
const ora = require('ora');
const handlebars = require('handlebars');
const fs = require('fs');
const inquirer = require('inquirer');

const tplInit = {
    // 下载远端模版
    downloadFun(downloadUrl, project) {
        return new Promise((resolve, reject) => {
            const spinner = ora('正在下载模版...').start();
            download(downloadUrl, project, { clone: true }, function (err) {
                if (err) {
                    spinner.fail(); // 下载失败提示
                    reject(err);
                    return;
                }
                spinner.succeed(); // 下载成功提示
                resolve();
            })
        })

    },

    // 处理用户交互
    inquirerFun(project) {
        return inquirer
            .prompt([
                {
                    type: "input",
                    name: "name",
                    message: "请输入项目名称:"
                },
                {
                    type: "input",
                    name: "description",
                    message: "请输入项目简介:"
                },
                {
                    type: "input",
                    name: "author",
                    message: "请输入项目作者:"
                }
            ])
            .then(answers => {
                const packagePath = `${project}/package.json`;
                const packageContent = fs.readFileSync(packagePath, 'utf8');
                const packageResult = handlebars.compile(packageContent)(answers);
                fs.writeFileSync(packagePath, packageResult);
            })
    }
}

module.exports = tplInit;