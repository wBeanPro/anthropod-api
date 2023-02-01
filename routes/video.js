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

router.post("/played", VideoController.video_played);
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
router.get("/user/:id",VideoController.GET_VIDEOS_BY_USER)
router.delete("/:id", VideoController.DELETE_VIDEO);
router.post("/update", [verifyToken], VideoController.UPDATE_VIDEO);
router.post("/add_comment", [verifyToken], VideoController.UPDATE_COMMENT);

module.exports = router;
