/**
 * Development environment settings
 *
 * This file can include shared settings for a development team,
 * such as API keys or remote database passwords.  If you're using
 * a version control solution for your Sails app, this file will
 * be committed to your repository unless you add it to your .gitignore
 * file.  If your repository will be publicly viewable, don't add
 * any private information to this file!
 *
 */

module.exports = {

  /***************************************************************************
   * Set the default database connection for models in the development       *
   * environment (see config/connections.image-upload and config/models.image-upload )           *
   ***************************************************************************/

  // models: {
  //   connection: 'someMongodbServer'
  // }
  memcache: {
    enabled: true,
    host: '43.252.89.194',
    port: 11290
  },
  caching: {
    adaptor: 'MEMCACHE',
    host: '43.252.89.194',
    port: 11290
  },
  mysql : {
    host     : 'localhost',
    user     : 'user',
    password : 'password',
    database : 'database'
  },
  memcacheKeyPrefix: 'jabong',
  pdpregex: /.html$/i,
  staticBaseUrl: 'static1.jabong.com',
  //Path should be from base directory -- Shenron folder
  imageDirPath : '.tmp/public/images',
  css : [

  ]
};
