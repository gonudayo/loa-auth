const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const api = require("../api/api.js");

let tempSecureCodeSave;

// 보안 코드 생성
router.get("/genSecureCode", async (req, res) => {
  try {
    const SecureCode = crypto.randomBytes(32).toString("base64").slice(0, 42);
    tempSecureCodeSave = SecureCode; // 임시 저장 테스트용
    return res.status(200).json({ success: true, SecureCode });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "Failed to generate SecureCode" });
  }
});

// 프로필 검증
router.post("/verifyProfile", async (req, res) => {
  try {
    const { profileUrl } = req.body; // 프로필 URL 받기
    if (!profileUrl) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid profileUrl" });
    }

    // `ko/` 뒤에 있는 memberNo 추출
    const match = profileUrl.match(/\/ko\/([^/]+)$/); // `ko/` 뒤의 값을 추출
    if (!match || !match[1]) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid profile URL format" });
    }
    const extractedValue = match[1];

    // API에서 사용자 소개 정보 가져오기
    const apiResponse = await api.getMemberNo(extractedValue);
    const profileIntroduce = apiResponse?.data?.data?.introduce;

    if (tempSecureCodeSave === profileIntroduce) {
      return res
        .status(200)
        .json({ success: true, SecureCode: tempSecureCodeSave });
    } else {
      return res
        .status(400)
        .json({ success: false, error: "Profile verification failed" });
    }
  } catch (error) {
    console.error("Error during verification:", error);
    return res
      .status(500)
      .json({ success: false, error: "Internal Server Error" });
  }
});

module.exports = router;
