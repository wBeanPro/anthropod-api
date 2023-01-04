const router = require("express").Router();
const { UploadVideo } = require("../middleware/file_middleware");
const { verifyToken } = require("../middleware/auth.js");
const VideoController = require("../controllers/video");

router.post(
  "/upload",
  [
    verifyToken,
    UploadVideo.fields([
      { name: "video", maxCount: 1 },
      { name: "thumbnail", maxCount: 1 },
    ]),
  ],
  VideoController.CREATE_VIDEO
);
router.post("/like_video", [verifyToken], VideoController.LIKE_VIDEO);
router.put(
  "/:id/edit",
  UploadVideo.fields([
    { name: "video", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  VideoController.UPDATE_VIDEO
);
router.get("/all_videos", VideoController.GET_ALL_VIDEOS);
router.get("/:id", VideoController.GET_VIDEO_BY_ID);
router.delete("/:id", VideoController.DELETE_VIDEO);
router.post("/add_comment", [verifyToken], VideoController.UPDATE_COMMENT);

module.exports = router;
