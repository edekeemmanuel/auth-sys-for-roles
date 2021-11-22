const AccessControl = require("accesscontrol");
const ac = new AccessControl();

module.exports.roles = (function() {
    ac.grant("user")
      .updateAny("assignment")
      .deleteAny("assignment")
      .readOwn("profile")
      .updateOwn("profile")

    ac.grant("teacher")
      .updateAny("user")
      .updateAny("user", ["profile"])
      .createOwn("profile")
      .readAny("user")
      // .denyAny("user")
      .createAny("assignment")  

    ac.grant("admin")
      .createAny("admin")
      .extend("user")
      .extend("user", ["teacher"])
      .deleteAny("user")
      .updateAny("user", ["teacher"])
      .createOwn("profile")
      .updateAny("profile")

    ac.grant("superAdmin")
      .extend("admin")
      .createOwn("profile")
   

    return ac;  
})()

