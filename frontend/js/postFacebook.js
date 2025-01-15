const publishPost = async (accessToken, message) => {
    try {
      const response = await axios.post(
        `https://graph.facebook.com/v12.0/me/feed`,
        {
          message: message,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log("Post opublikowany:", response.data);
    } catch (error) {
      console.error("Błąd podczas publikowania posta:", error.message);
    }
  };
  

  const getProfilePicture = async (accessToken) => {
    const response = await axios.get(
      `https://graph.facebook.com/me/picture?redirect=false&type=large&access_token=${accessToken}`
    );
    console.log("Zdjęcie profilowe:", response.data);
  };
  