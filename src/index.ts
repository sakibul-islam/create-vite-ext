import * as fs from 'fs';
import * as path from 'path';
import prompts = require('prompts');
import {
  green,
  red,
  reset,
} from 'kolorist';
import { copyDir, emptyDir, formatTargetDir, isDev, isEmpty, isValidPackageName, toValidPackageName } from './functions';
import { defaultProjectName, templateDirName } from './common';
import { PromptAnswers } from './type';
import { AVAILABLE_FRAMEWORKS, FRAMEWORKS, Framework } from './frameworks';

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
        {
          type: 'select',
          name: 'framework',
          message: reset('Select a framework:'),
          initial: 0,
          choices: AVAILABLE_FRAMEWORKS.map((framework) => {
            const frameworkColor = framework.color;
            return {
              title: frameworkColor(framework.display || framework.name),
              value: framework,
            };
          }),
        },
        {
          type: (framework: Framework) =>
            framework && framework.variants ? 'select' : null,
          name: 'variant',
          message: reset('Select a variant:'),
          choices: (framework: Framework) =>
            framework.variants.map((variant) => {
              const variantColor = variant.color;
              return {
                title: variantColor(variant.display || variant.name),
                value: variant.name,
              };
            }),
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
  const { projectName, overwrite, variant, packageName, authorName } = response;

  const targetPath = path.join(process.cwd(), projectName);
  // console.log({ targetPath });

  if (overwrite === 'yes') {
    emptyDir(targetPath);
  } else if (!fs.existsSync(targetPath)) {
    fs.mkdirSync(targetPath, { recursive: true });
  }

  console.log(`\nScaffolding extension in ${targetPath}...`);

  copyDir(path.resolve(__dirname, "..", templateDirName, variant), targetPath, response);

  console.log(green(`\nCreated "${projectName}"`));
}

init()
  .catch(err => {
    console.log(err);
  }).finally(() => {
    if (!isDev) process.exit();
  });