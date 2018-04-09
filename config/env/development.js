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
     * environment (see config/connections.js and config/models.js )           *
     ***************************************************************************/

    // models: {
    //   connection: 'someMongodbServer'
    // }
    hostname: "kingscasino.uat1.evo-test.com",
    casinokey: "kingscasino00001",
    apitoken: "test123",
    authToken:"stage1234",
    evoURL:"https://kingscasino.uat1.evo-test.com/ua/v1/kingscasino00001/stage1234 ",

    port: 1337,
    realHost: "http://wohlig.io:1337",
    emails: ["chintan@wohlig.com", "jagruti@wohlig.com", "tushar@wohlig.com", "chirag@wohlig.com", "harsh@wohlig.com", "sohan@wohlig.com"]
};