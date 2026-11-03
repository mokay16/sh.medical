import * as migration_20261006_232404_initial from './20261006_232404_initial';
import * as migration_20261007_002532_blob_object_key from './20261007_002532_blob_object_key';
import * as migration_20261026_110459_department_original_images from './20261026_110459_department_original_images';
import * as migration_20261026_111313_department_merge_pages from './20261026_111313_department_merge_pages';
import * as migration_20261026_120323_reviews from './20261026_120323_reviews';
import * as migration_20261026_121607_department_office_street from './20261026_121607_department_office_street';
import * as migration_20261026_125247_condition_categories from './20261026_125247_condition_categories';
import * as migration_20261026_222539_department_fax from './20261026_222539_department_fax';
import * as migration_20261101_224759_review_date_optional from './20261101_224759_review_date_optional';
import * as migration_20261101_230407_department_gallery_banners from './20261101_230407_department_gallery_banners';
import * as migration_20261103_020145_department_photo_optional from './20261103_020145_department_photo_optional';
import * as migration_20261103_024101_fp_results_team_treatment_images from './20261103_024101_fp_results_team_treatment_images';

export const migrations = [
  {
    up: migration_20261006_232404_initial.up,
    down: migration_20261006_232404_initial.down,
    name: '20261006_232404_initial',
  },
  {
    up: migration_20261007_002532_blob_object_key.up,
    down: migration_20261007_002532_blob_object_key.down,
    name: '20261007_002532_blob_object_key',
  },
  {
    up: migration_20261026_110459_department_original_images.up,
    down: migration_20261026_110459_department_original_images.down,
    name: '20261026_110459_department_original_images',
  },
  {
    up: migration_20261026_111313_department_merge_pages.up,
    down: migration_20261026_111313_department_merge_pages.down,
    name: '20261026_111313_department_merge_pages',
  },
  {
    up: migration_20261026_120323_reviews.up,
    down: migration_20261026_120323_reviews.down,
    name: '20261026_120323_reviews',
  },
  {
    up: migration_20261026_121607_department_office_street.up,
    down: migration_20261026_121607_department_office_street.down,
    name: '20261026_121607_department_office_street',
  },
  {
    up: migration_20261026_125247_condition_categories.up,
    down: migration_20261026_125247_condition_categories.down,
    name: '20261026_125247_condition_categories',
  },
  {
    up: migration_20261026_222539_department_fax.up,
    down: migration_20261026_222539_department_fax.down,
    name: '20261026_222539_department_fax',
  },
  {
    up: migration_20261101_224759_review_date_optional.up,
    down: migration_20261101_224759_review_date_optional.down,
    name: '20261101_224759_review_date_optional',
  },
  {
    up: migration_20261101_230407_department_gallery_banners.up,
    down: migration_20261101_230407_department_gallery_banners.down,
    name: '20261101_230407_department_gallery_banners',
  },
  {
    up: migration_20261103_020145_department_photo_optional.up,
    down: migration_20261103_020145_department_photo_optional.down,
    name: '20261103_020145_department_photo_optional',
  },
  {
    up: migration_20261103_024101_fp_results_team_treatment_images.up,
    down: migration_20261103_024101_fp_results_team_treatment_images.down,
    name: '20261103_024101_fp_results_team_treatment_images'
  },
];
