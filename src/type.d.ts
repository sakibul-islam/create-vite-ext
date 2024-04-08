import { Answers } from "prompts";

export type PromptAnswers = Answers<'projectName' | 'overwrite' | 'packageName' | 'authorName' | 'framework' | 'variant'>;