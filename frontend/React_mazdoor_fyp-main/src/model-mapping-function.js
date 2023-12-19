const mapApiDataToUser = (apiData,userType) => {
    return {
      _id: apiData._id || '',
      firstName: apiData.firstName || '',
      lastName: apiData.lastName || '',
      email: apiData.email || '',
      password: apiData.password || '',
      dob: apiData.dob ? new Date(apiData.dob) : new Date(),
      isPro: apiData.isPro || false,
      loginAsPro: userType === 'labour' || false,
      feesPerHour: apiData.feesPerHour || 0,
      category: apiData.category || null,
      location: apiData.location || null,
      createdAt: apiData.createdAt ? new Date(apiData.createdAt) : new Date(),
      updatedAt: apiData.updatedAt ? new Date(apiData.updatedAt) : new Date(),
      __v: apiData.__v || 0,
    };
  };
  
  export default mapApiDataToUser;
  