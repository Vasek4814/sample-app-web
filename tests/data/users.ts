export interface TestUser {
  username: string;
  password: string;
}

export const USERS = {
  valid: { username: 'standard_user', password: 'secret_sauce' },
  locked: { username: 'locked_out_user', password: 'secret_sauce' },
  wrongPassword: { username: 'standard_user', password: 'secretsauce' },
  empty: { username: '', password: '' },
  problem: { username: 'problem_user', password: 'secret_sauce' },
  performanceGlitch: { username: 'performance_glitch_user', password: 'secret_sauce' },
} satisfies Record<string, TestUser>;
