const axios = require("axios");

const getMemberNo = async (profileNo) => {
  try {
    const response = await axios.get(
      encodeURI(`https://api.onstove.com/tm/v1/preferences/${profileNo}`)
    );

    if (!response || !response.data) {
      console.error("Invalid response for MemberNo");
      throw new Error("Failed to fetch MemberNo data");
    }

    return response;
  } catch (error) {
    console.error("Failed to fetch MemberNo data:", error);
    throw new Error("Invalid profile URL");
  }
};

const getEncryptMemberNo = async (memberNo) => {
  try {
    const params = { memberNo: memberNo };
    const response = await axios.post(
      "https://lostark.game.onstove.com/board/IsCharacterList",
      params
    );

    return response;
  } catch (error) {
    console.error("Failed to fetch EncryptMemberNo data:", error);
    throw new Error("Invalid memberNo");
  }
};

const getCharacterProfile = async (EncryptMemberNo) => {
  try {
    const response = await axios.get(
      encodeURI(
        `https://lostark.game.onstove.com/Profile/Member?id=${EncryptMemberNo}`
      )
    );

    return response;
  } catch (error) {
    console.error("Failed to fetch Character Profile data:", error);
    throw new Error("Invalid EncryptMemberNo");
  }
};

const getCharacterList = async (characterName) => {
  try {
    return await axios.get(
      encodeURI(
        "https://developer-lostark.game.onstove.com/characters/" +
          characterName +
          "/siblings"
      ),
      {
        headers: { authorization: process.env.TOKEN },
      }
    );
  } catch (error) {
    console.error("Failed to fetch Character List:", error);
    throw new Error("Invalid characterName");
  }
};

module.exports = {
  getMemberNo,
  getEncryptMemberNo,
  getCharacterProfile,
  getCharacterList,
};
