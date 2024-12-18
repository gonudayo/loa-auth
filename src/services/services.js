const api = require("../api/api.js");
const util = require("../utils/utils.js");
const testSecureCode = require("../testSecureCode/secureCodeStore.js");

const authProfile = async (profileUrl) => {
  try {
    // MemberNo 추출
    const memberNo = await util.extractMemberNo(profileUrl);

    // API에서 사용자 소개 정보 가져오기
    const apiResponse = await api.getMemberNo(memberNo);
    const profileIntroduce = await apiResponse?.data?.data?.introduce;

    // 테스트용
    // return authCharacter(memberNo);

    // 검증 필요 임시 처리
    if (testSecureCode.getSecureCode() === profileIntroduce) {
      console.log("프로필 소개글 검증 완료");
      return authCharacter(memberNo);
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
};
