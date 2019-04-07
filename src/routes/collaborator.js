const express = require("express")
const router = express.Router()
const User = require("../../src/db/models").User
const collaboratorController = require("../constrollers/collaboratorController")

router.post("/wikis/:wikiId/collaborators/add", collaboratorController.add);
router.get("/wikis/:wikiId/collaborators", collaboratorController.edit);
router.post("/wikis/:wikiId/collaborators/remove", collaboratorController.remove);

module.exports = router;
