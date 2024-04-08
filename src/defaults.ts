import * as path from 'path';

export const templateDirName = 'boilerplate';
export const defaultProjectName = 'Vite Powered Browser Extension';

export const ignoreCopyingFiles = [
  'build',
  'node_modules'
].map(file => path.resolve(__dirname, '..', templateDirName, file));

// console.log({ ignoreCopyingFiles });