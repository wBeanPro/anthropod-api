const router = require("express").Router();
const ArtController = require("../controllers/art");
const { UploadImage } = require("../middleware/file_middleware");
const { verifyToken } = require("../middleware/auth");

router.get("/", ArtController.GET_ALL_ART);
router.post(
  "/upload",
  [verifyToken, UploadImage.single("image")],
  ArtController.CREATE_ART
);
router.put(
  "/:id/edit",
  [verifyToken, UploadImage.single("image")],
  ArtController.UPDATE_ART
);
router.get("/user/:id", ArtController.GET_ARTS_BY_USER);
router.delete("/:id", [verifyToken], ArtController.DELETE_ART);
router.post("/update", [verifyToken], ArtController.UPDATE_ART);
router.post("/like_art", [verifyToken], ArtController.LIKE_ART);
router.post("/add_comment", [verifyToken], ArtController.UPDATE_COMMENT);

module.exports = router;
