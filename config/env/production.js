/**
 * Production environment settings
 *
 * This file can include shared settings for a production environment,
 * such as API keys or remote database passwords.  If you're using
 * a version control solution for your Sails app, this file will
 * be committed to your repository unless you add it to your .gitignore
 * file.  If your repository will be publicly viewable, don't add
 * any private information to this file!
 *
 */

module.exports = {

  /***************************************************************************
   * Set the default database connection for models in the production        *
   * environment (see config/connections.image-upload and config/models.image-upload )           *
   ***************************************************************************/

  // models: {
  //   connection: 'someMysqlServer'
  // },

  /***************************************************************************
   * Set the port in the production environment to 80                        *
   ***************************************************************************/

  // port: 80,

  /***************************************************************************
   * Set the log level in production environment to "silent"                 *
   ***************************************************************************/

  // log: {
  //   level: "silent"
  // }
  memcache: {
    enabled: true,
    host: 'memcache',
    port: process.env.MEMCACHE_PORT || 11290
  },
  caching: {
    host: '43.252.89.194',
    port: 11290
  },
  memcacheKeyPrefix: 'jabong',
  pdpregex: /.html$/i,
  staticBaseUrl: process.env.STATIC_BASE_URL,
  //Path should be from base directory -- Shenron folder
  imageDirPath : process.env.IMAGE_DIR_PATH,
};
