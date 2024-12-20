const api = require("../api/api.js");
const util = require("../utils/utils.js");
const { User } = require("../models/User");

const findCharacter = async (body) => {
  try {
    const characterList = await api.getCharacterList(body.name);

    for (character of characterList.data) {
      if (character.CharacterName === body.name) {
        // 레벨 미달
        if (
          parseFloat(character.ItemMaxLevel.replace(/[^0-9.]/g, "")) <
          process.env.MIN_LEVEL
        ) {
          return "레벨이 최소조건 보다 낮습니다.";
        }
        // 서버 불일치
        if (character.ServerName !== body.server) {
          return "서버가 일치하지 않습니다.";
        }
        // 조건 만족
        return true;
      }
    }

    // 캐릭터 찾지 못한 경우
    return "존재하지 않는 캐릭터 입니다.";
  } catch (error) {
    console.error("Failed to find character data:", error);
    throw new Error("Invalid Character");
  }
};

const authProfile = async (profileUrl) => {
  try {
    // MemberNo 추출
    const memberNo = await util.extractMemberNo(profileUrl);

    // API에서 사용자 소개 정보 가져오기
    const apiResponse = await api.getMemberNo(memberNo);
    const profileIntroduce = await apiResponse?.data?.data?.introduce;

    // 테스트용
    // return authCharacter(memberNo);

    // 코드찾기에서 이름으로 찾기로 변경필요
    const user = await User.findOne({ secureCode: profileIntroduce });

    // 코드인증 완료
    if (user) {
      await User.updateOne(
        { secureCode: profileIntroduce },
        { secureCode: "", status: true }
      );
      return authCharacter(memberNo);
    } else {
      // 실패시
    }
  } catch (error) {
    console.error("Failed to auth profile data:", error);
    throw new Error("Invalid EncryptMemberNo");
  }
};

const authCharacter = async (memberNo) => {
  try {
    // 캐릭터 정보 가져오기
    const encryptMemberResponse = await api.getEncryptMemberNo(memberNo);
    const EncryptMemberNo = await encryptMemberResponse?.data?.encryptMemberNo;
    if (!EncryptMemberNo) {
      console.error("EncryptMemberNo not found");
      throw new Error("Invalid EncryptMemberNo");
    }
    const profileData = await api.getCharacterProfile(EncryptMemberNo);
    const characterName = await crawlerService(profileData);

    return characterName;
  } catch (error) {
    console.error("Failed to auth character data:", error);
    throw new Error("Invalid Character");
  }
};

const crawlerService = async (profileData) => {
  try {
    const ogUrl = await util.extractOgUrl(profileData);
    if (!ogUrl) {
      throw new Error("ogUrl not found in profile data");
    }
    const characterName = await util.extractCharacterName(ogUrl);
    if (!characterName) {
      throw new Error("CharacterName not found in ogUrl");
    }

    return checkCharacter(characterName);
  } catch (error) {
    console.error("Failed to fetch profile data:", error);
    throw new Error("Invalid Profile");
  }
};

const checkCharacter = async (characterName) => {
  try {
    const characterList = await api.getCharacterList(characterName);

    for (character of characterList.data) {
      if (
        character.ServerName === "루페온" &&
        parseFloat(character.ItemMaxLevel.replace(/[^0-9.]/g, "")) >= 1640
      ) {
        return { level: character.ItemMaxLevel, name: character.CharacterName };
      }
    }
  } catch (error) {
    console.error("Failed to fetch profile data:", error);
    throw new Error("Invalid Profile");
  }
};

module.exports = {
  authProfile,
  findCharacter,
};
