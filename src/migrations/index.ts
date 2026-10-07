import * as migration_20261006_232404_initial from './20261006_232404_initial';
import * as migration_20261007_002532_blob_object_key from './20261007_002532_blob_object_key';

export const migrations = [
  {
    up: migration_20261006_232404_initial.up,
    down: migration_20261006_232404_initial.down,
    name: '20261006_232404_initial',
  },
  {
    up: migration_20261007_002532_blob_object_key.up,
    down: migration_20261007_002532_blob_object_key.down,
    name: '20261007_002532_blob_object_key'
  },
];
