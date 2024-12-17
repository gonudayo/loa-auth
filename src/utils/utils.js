const extractMemberNo = async (profileUrl) => {
  try {
    // `ko/` 뒤의 값을 추출
    const match = profileUrl.match(/\/ko\/([^/]+)$/);
    if (!match || !match[1]) {
      console.error("Invalid profile URL format");
      throw new Error("Invalid profile URL");
    }
    const memberNo = match[1];

    return memberNo;
  } catch (error) {
    console.error("Failed to extract MemberNo:", error);
    throw new Error("Invalid profile URL");
  }
};

const extractOgUrl = async (profileData) => {
  try {
    const html = profileData.data;

    // `og:url` 추출
    const match = html.match(/<meta property="og:url" content="([^"]+)"/);
    if (!match || !match[1]) {
      console.error("Failed to find og:url tag");
      throw new Error("Invalid profile data");
    }
    const ogUrl = match[1];

    return ogUrl;
  } catch (error) {
    console.error("Failed to extract url:", error);
    throw new Error("Invalid profile data");
  }
};

const extractCharacterName = async (profileUrl) => {
  try {
    // `Character/` 뒤의 값을 추출
    const match = profileUrl.match(/\/Character\/([^/]+)$/);
    if (!match || !match[1]) {
      console.error("Invalid profile URL format");
      throw new Error("Invalid profile URL");
    }
    const CharacterName = decodeURIComponent(match[1]);

    return CharacterName;
  } catch (error) {
    console.error("Failed to extract CharacterName:", error);
    throw new Error("Invalid profile URL");
  }
};

module.exports = {
  extractMemberNo,
  extractOgUrl,
  extractCharacterName,
};
