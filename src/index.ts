import * as fs from 'fs';
import * as path from 'path';
import prompts = require('prompts');
import {
  green,
  red,
  reset,
} from 'kolorist';
import { copyDir, emptyDir, formatTargetDir, isDev, isEmpty, isValidPackageName, toValidPackageName } from './functions';
import { defaultProjectName, templateDirName } from './defaults';
import { PromptAnswers } from './type';

let projectName = defaultProjectName;

async function getResponse() {
  let response: PromptAnswers;

  function getProjectName() {
    return projectName === '.' ? path.basename(path.resolve()) : projectName;
  };

  try {
    response = await prompts(
      [
        {
          type: 'text',
          name: 'projectName',
          message: reset('Extension name:'),
          initial: defaultProjectName,
          onState: (state) => {
            projectName = formatTargetDir(state.value) || defaultProjectName;
          },
        },
        {
          type: () =>
            !fs.existsSync(projectName) || isEmpty(projectName) ? null : 'select',
          name: 'overwrite',
          message: () =>
            (projectName === '.'
              ? `Current directory "${getProjectName()}"`
              : `Target directory "${projectName}"`) +
            ` is not empty. Please choose how to proceed:`,
          initial: 0,
          choices: [
            {
              title: 'Remove existing files and continue',
              value: 'yes',
            },
            {
              title: 'Cancel operation',
              value: 'no',
            },
            {
              title: 'Ignore files and continue',
              value: 'ignore',
            },
          ],
        },
        {
          type: (_, { overwrite }: { overwrite?: string; }) => {
            if (overwrite === 'no') {
              throw new Error(red('✖') + ' Operation cancelled');
            }
            return null;
          },
          name: 'overwriteChecker',
        },
        {
          type: () => (isValidPackageName(getProjectName()) ? null : 'text'),
          name: 'packageName',
          message: reset('Package name:'),
          initial: () => toValidPackageName(getProjectName()),
          validate: (dir) =>
            isValidPackageName(dir) || 'Invalid package.json name',
        },
        {
          type: 'text',
          name: 'authorName',
          message: 'Author name:',
        },
      ],
      {
        onCancel: () => {
          throw new Error(red('✖') + ' Operation cancelled');
        },
      },
    );
  } catch (cancelled: any) {
    console.log(cancelled.message);
    return;
  }
  return response;
}

async function init() {
  const response = await getResponse();
  if (isDev) console.log(response);
  if (!response) return;
  const { projectName, overwrite, packageName, authorName } = response;

  const targetPath = path.join(process.cwd(), projectName);
  // console.log({ targetPath });

  if (overwrite === 'yes') {
    emptyDir(targetPath);
  } else if (!fs.existsSync(targetPath)) {
    fs.mkdirSync(targetPath, { recursive: true });
  }

  console.log(`\nScaffolding extension in ${targetPath}...`);

  copyDir(path.join(templateDirName), targetPath, response);

  console.log(green(`\nCreated "${projectName}"`));
}

init();