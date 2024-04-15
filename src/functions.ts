import * as fs from 'fs';
import * as path from 'path';
import { templateDirName } from './common';
import { PromptAnswers } from './type';

export const isDev = process.env.NODE_ENV === 'development';

export function formatTargetDir(targetDir: string | undefined) {
  return targetDir?.trim().replace(/\/+$/g, '');
}

export function isEmpty(path: string) {
  const files = fs.readdirSync(path);
  return files.length === 0 || (files.length === 1 && files[0] === '.git');
}

export function isValidPackageName(projectName: string) {
  return /^(?:@[a-z\d\-*~][a-z\d\-*._~]*\/)?[a-z\d\-~][a-z\d\-._~]*$/.test(
    projectName,
  );
}

export function toValidPackageName(projectName: string) {
  return projectName
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/^[._]/, '')
    .replace(/[^a-z\d\-~]+/g, '-');
}

export function emptyDir(dir: string) {
  if (!fs.existsSync(dir)) return;
  for (const file of fs.readdirSync(dir)) {
    if (file === '.git') continue;
    fs.rmSync(path.resolve(dir, file), { recursive: true, force: true });
  }
}

function copyFileContent(srcFilePath: string, destFilePath: string, promptAnswers: PromptAnswers) {
  const content = fs.readFileSync(srcFilePath, 'utf8');
  let replacedContent = content;
  if (srcFilePath.endsWith('package.json')) {
    replacedContent = content
      .replace(/"name": ".*"/g, `"name": "${promptAnswers.packageName}"`)
      .replace(/"displayName": ".+"/g, `"displayName": "${promptAnswers.projectName}"`)
      .replace(/__AUTHOR_NAME__/g, promptAnswers.authorName);
  } else {
    replacedContent = content
      .replace(/__PROJECT_NAME__/g, promptAnswers.projectName)
      .replace(/__AUTHOR_NAME__/g, promptAnswers.authorName);
  }

  fs.writeFileSync(destFilePath, replacedContent);
}

export function copy(src: string, dest: string, promptAnswers: PromptAnswers) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    copyDir(src, dest, promptAnswers);
  } else {
    // fs.copyFileSync(src, dest);
    copyFileContent(src, dest, promptAnswers);
  }
}

/**
 * This function will ignore copying files includes in `ignoreFiles` array
 */
export function copyDir(srcDir: string, destDir: string, promptAnswers: PromptAnswers) {
  const ignoreFiles = [
    'build',
    'node_modules',
    'todos.md',
  ];
  fs.mkdirSync(destDir, { recursive: true });
  for (const file of fs.readdirSync(srcDir)) {
    const srcFile = path.resolve(srcDir, file);
    const destFile = path.resolve(destDir, file);

    if (ignoreFiles.includes(file)) continue;

    copy(srcFile, destFile, promptAnswers);
  }
}