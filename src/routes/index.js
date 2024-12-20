const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const service = require("../services/services.js");
const { User } = require("../models/User");

// 보안 코드 생성
router.get("/genSecureCode", async (req, res) => {
  try {
    const findCharacter = await service.findCharacter(req.body);

    if (findCharacter !== true) {
      return res.status(200).json({ success: false, message: findCharacter });
    }

    const SecureCode = await crypto
      .randomBytes(Math.ceil(16))
      .toString("hex")
      .slice(0, 32);

    // 이미 인증이 완료된 캐릭터인지 확인
    const existingUser = await User.findOne({ name: req.body.name });

    // 이전에 인증 시도 정보가 있는 경우
    if (existingUser) {
      if (existingUser.status === true) {
        return res.status(200).json({
          success: false,
          message: "This character has already been authenticated",
        });
      } else if (existingUser.status === false) {
        await User.updateOne(
          { name: req.body.name },
          { secureCode: SecureCode }
        );

        return res.status(200).json({ success: true, SecureCode });
      }
    }

    // 최초 시도의 경우
    const userData = {
      name: req.body.name,
      server: req.body.server,
      status: false,
      secureCode: SecureCode,
    };

    const user = await new User(userData);
    console.log(user);

    await user.save();

    return res.status(200).json({ success: true, SecureCode });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, error: "Failed to generate SecureCode" });
  }
});

// 프로필 검증
router.post("/verifyProfile", async (req, res) => {
  try {
    const { profileUrl } = req.body;
    const result = await service.authProfile(profileUrl);

    if (result !== undefined) {
      return res.status(200).json({ success: true, result: result });
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
