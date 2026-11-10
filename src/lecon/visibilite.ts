import type { Lecon } from './schema';

export function estVisible(statut: Lecon['statut'], apercu: boolean): boolean {
  return statut === 'publie' || apercu;
}

export function modeApercu(): boolean {
  return Boolean(import.meta.env.DEV) || process.env['APERCU'] === '1';
}
