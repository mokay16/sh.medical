import * as migration_20261006_232404_initial from './20261006_232404_initial';

export const migrations = [
  {
    up: migration_20261006_232404_initial.up,
    down: migration_20261006_232404_initial.down,
    name: '20261006_232404_initial'
  },
];
