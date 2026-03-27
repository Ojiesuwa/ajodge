const CLIENT_ID = "IKIA6C05FC6BEFFA6300DB809C2CBAD4B457F1592218";
const SECRET_KEY = "1A0C59766BEC8C04A40F2B9052D1E1C1AF2AEA6C";

const BASE_URL = "https://ajodge-server.onrender.com/api/session"; 
let tokenCache = {
  accessToken: null,
  expiresAt: null,
};

const getToken = async () => {
  const now = Date.now();

  if (tokenCache.accessToken && tokenCache.expiresAt > now) {
    console.log("Using cached token");
    return tokenCache.accessToken;
  }

  const credentials = btoa(`${CLIENT_ID}:${SECRET_KEY}`);

  // ✅ Now goes through Vite proxy — no CORS issue
  const response = await fetch("/passport/oauth/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "scope=profile&grant_type=client_credentials",
  });

  if (!response.ok) throw new Error(`Failed to get token: ${response.status}`);

  const data = await response.json();

  tokenCache = {
    accessToken: data.access_token,
    expiresAt: now + (data.expires_in - 300) * 1000,
  };

  return tokenCache.accessToken;
};


export const apiService = {
  // =========================================================
  //                    PAYMENT FORM API'S
  // =========================================================
  
  /* Fetches session members by ssid */
  getSessionMembers: async (ssid) => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ssid })
    };

    const response = await fetch(`${BASE_URL}/members`, requestOptions);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error(`Error fetching session members: ${errorData.message || response.status}`);
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  },

  /* Verifies payment */
  verifyPayment: async (data) => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    };

    const response = await fetch(`${BASE_URL}/payment-verification`, requestOptions);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  },

  // =========================================================
  //                    AJO CREATION API'S
  // =========================================================
  
  /* Creates a new Ajo session */
  createAjoSession: async (data) => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    };

    const response = await fetch(`${BASE_URL}/create`, requestOptions);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error(errorData.message)
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    return await response.json();
  },

  // =========================================================
  //                    REGISTRATION FORM API'S
  // =========================================================
  
  /* Submits the registration form data to the server. */
  registerUser: async (formData) => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    };

    const response = await fetch(`${BASE_URL}/register`, requestOptions);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  },

    /* Fetches the list of banks (paystack implementation) */

  // getBanks: async () => {
  //   const response = await fetch('https://api.paystack.co/bank?country=nigeria');
  //   if (!response.ok) {
  //     throw new Error('Network response was not ok');
  //   }
  //   const data = await response.json();
  //   if (data && data.data) {
  //     return data.data.map(bank => ({
  //       id: bank.code || String(bank.id),
  //       name: bank.name
  //     }));
  //   }
  //   return [];
  // },


  /* Fetches the list of banks utilizing Interswitch API */
  getBanks: async () => {
    const token = await getToken();

    const response = await fetch(
      "https://api-marketplace-routing.k8.isw.la/marketplace-routing/api/v1/verify/identity/account-number/bank-list",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch bank list: ${response.status}`);
    }

    const data = await response.json();
     if (data && data.data) {
      return data.data.map(bank => ({
        id: bank.code || String(bank.id),
        name: bank.name
      }));
    }
    return [];
  },

  verifyNin: async ({ firstName, lastName, nin }) => {
    const token = await getToken();
    const requestOptions = {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ firstName, lastName, nin })
    };

    const response = await fetch('https://api-marketplace-routing.k8.isw.la/marketplace-routing/api/v1/verify/identity/nin', requestOptions);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  },

  verifyAccountNumber: async ({ accountNumber, bankCode }) => {
    const token = await getToken();
    const requestOptions = {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ accountNumber, bankCode })
    };

    const response = await fetch('https://api-marketplace-routing.k8.isw.la/marketplace-routing/api/v1/verify/identity/account-number/resolve', requestOptions);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }

};
