#!/usr/bin/env node

import * as fs from 'fs'
import * as path from 'path'
import { Answers, PromptObject } from 'prompts';
const prompts = require('prompts');

const isDev = process.env.NODE_ENV === 'development';
const templateDirName = 'boilerplate';

const questions: PromptObject[] = [
  {
    type: 'text',
    name: 'projectName',
    message: 'Enter your project name:',
  },
  {
    type: 'text',
    name: 'authorName',
    message: 'Enter your name or author name:',
  },
];

async function getResponse() {
  let response: Answers<string>;
  if (isDev) {
    const projectName = 'Test Project';
    response = { projectName, authorName: 'Sakibul Islam' };
    const projectDir = path.join(process.cwd(), projectName);
    fs.rmSync(projectDir, { recursive: true });
  } else {
    response = await prompts(questions);
  }
  return response;
}

const ignoreFiles = [
  'build',
  'node_modules'
].map(file => path.join(__dirname, templateDirName, file));

// console.log({ ignoreFiles });

async function init() {
  const response = await getResponse();
  console.log(response);
  const { authorName, projectName } = response;

  const destDir = path.join(process.cwd(), projectName);
  // console.log({ destDir });

  fs.mkdirSync(destDir);

  function copyFilesToDir(srcDir: string, destDir: string) {
    const filePaths = fs.readdirSync(srcDir);
    // console.log({ srcDir, filePaths, destDir });

    filePaths.forEach(async (file) => {
      const srcFilePath = path.join(srcDir, file);
      const destFilePath = path.join(destDir, file);

      if (ignoreFiles.includes(srcFilePath)) return;

      const isDir = fs.lstatSync(srcFilePath).isDirectory();
      if (isDir) {
        fs.mkdirSync(destFilePath);
        copyFilesToDir(srcFilePath, destFilePath);
      } else {
        const content = fs.readFileSync(srcFilePath, 'utf8');

        // Replace placeholders in content
        const replacedContent = content
          .replace(/__PROJECT_NAME__/g, projectName)
          .replace(/__AUTHOR_NAME__/g, authorName);

        fs.writeFileSync(destFilePath, replacedContent);
      }
    });
  }

  copyFilesToDir(path.join(__dirname, templateDirName), destDir);

  console.log(`Project ${projectName} created successfully at ${destDir}`);
}

init();