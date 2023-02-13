const initialState = {
  requests: [],
};

const mutations = {
  addRequest(state, payload) {
    state.requests.push(payload);
  },
  setRequests(state, payload) {
    state.requests = payload;
  },
};

const actions = {
  async addRequest(context, payload) {
    const newRequest = {
      userEmail: payload.email,
      message: payload.message,
    };

    const response = await fetch(
      `https://vue-pj1-6ca7d-default-rtdb.asia-southeast1.firebasedatabase.app/requests/${payload.coachId}.json`,
      {
        method: 'POST',
        body: JSON.stringify(newRequest),
      }
    );

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message || 'Failed to send request.');
    }

    console.log({ responseData });
    newRequest.id = responseData.name;
    newRequest.coachId = payload.coachId;

    context.commit('addRequest', newRequest);
  },
  async fetchRequests(context) {
    const coachId = context.rootGetters.userId;
    const response = await fetch(
      `https://vue-pj1-6ca7d-default-rtdb.asia-southeast1.firebasedatabase.app/requests/${coachId}.json`
    );
    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message || 'Failed to fetch requests.');
    }

    const requests = [];

    for (const key in responseData) {
      // const request = {
      //   id: key,
      //   coachId,
      //   userEmail: responseData[key].userEmail,
      //   message: responseData[key].message,
      // };
      // requests.push(request);
      const request = {
        id: key,
        coachId: coachId,
        userEmail: responseData[key].userEmail,
        message: responseData[key].message,
      };
      requests.push(request);
    }

    context.commit('setRequests', requests);
  },
};

const getters = {
  requests(state, getters, rootState, rootGetters) {
    const coachId = rootGetters.userId;
    return state.requests.filter((req) => req.coachId === coachId);
  },
  hasRequests(state, getters) {
    return getters.requests && getters.requests.length > 0;
  },
};

export default {
  namespaced: true,
  state() {
    return initialState;
  },
  mutations,
  actions,
  getters,
};
