# Valence
A full circle data management solution for Angular.js Apps.

## Version 1.1.0

 ### Version 1 Updates
  * The model layer now uses the strategy pattern to move through sequences.
  * Valence now includes access control with identity management.
  * Consistent API across modules.
  * Consolidated route hook system.
  * Stronger auth integration when fetching/persisting data in the cloud.

 ### Version 1.1.0 Updates
  * Valence now supports custom redirects based on HTTP status codes when a model fails in the cloud layer. For example, say with route: blog/:post_id, blog/1234 would return a valid post object, however blog/12345 would not as well as return 404. Through setting a redirect option in the HTTP action in question, the user will be navigated to the specified page.
 * Strtegy.fail assigns args.data just like strategy.pass does to be more consistent.

 ### Patches

  1.0.2
   * Adding an enabled check to valence.loader.wrapUp to prevent errors from being thrown when the loader is disabled.
 
  1.0.1
   * Updated normalize arguments to be more consistent with Auth and ACL.

### Installation

    bower install valence

### Development

You'll notice that master has no package.json, that is because master is not intended for development and is only meant for bower installations. To work with the code from a clone, please checkout the dev branch.

1. Clone
2. git checkout dev
3. cd valence/cloud-app
4. npm install
5. node app.js
6. cd ../data-app
7. npm install && bower install
8. grunt server

#### Dependencies

For step 3, you will need mongodb installed an running. You will also need to import the valence database found in /db.

### Issues

Please report them in the issues tab.

### The future

The future will contain lazy-loading and pagination integratations!

And other stuff I haven't thought of yet.


