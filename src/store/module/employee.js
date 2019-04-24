import {
  getCount,
  getManNFemaleRate,
  getMonthEmployeeChangeData,
  getAgeRate,
  getWorkYearRate,
  getDepEmployeeCount,
  getEmployeeList
} from '_api/employee'

export default {
  state: {
    userCountObj: {},
    manNFemaleRateObj: [],
    ageRateObj: [],
    workYearRateObj: [],
    depEmployeeCountList: [],
    monthEmployeeChangeData: [],
    employeeData: {
      list: [],
      total: 0
    }
  },
  getters: {},
  mutations: {
    setUserCount (state, userCountObj) {
      state.userCountObj = userCountObj
    },
    setManNFemaleRate (state, manNFemaleRateObj) {
      state.manNFemaleRateObj = manNFemaleRateObj
    },
    setAgeRate (state, ageRateObj) {
      state.ageRateObj = ageRateObj
    },
    setWorkYearRate (state, workYearRateObj) {
      state.workYearRateObj = workYearRateObj
    },
    setDepEmployeeCount (state, depEmployeeCountList) {
      state.depEmployeeCountList = depEmployeeCountList
    },
    setMonthEmployeeChangeData (state, monthEmployeeChangeData) {
      state.monthEmployeeChangeData = monthEmployeeChangeData
    },
    setEmployeeData (state, employeeData) {
      state.employeeData = employeeData
    }
  },
  actions: {
    getUserCount ({ commit }) {
      return new Promise((resolve, reject) => {
        getCount()
          .then(res => {
            const data = res.data
            const obj = data.toObject()
            commit('setUserCount', obj)
            resolve()
          }).catch(err => {
            reject(err)
          })
      })
    },
    getManNFemaleRate ({ commit }) {
      return new Promise((resolve, reject) => {
        getManNFemaleRate()
          .then(res => {
            const data = res.data
            const { list } = data.toObject()
            commit('setManNFemaleRate', list)
            resolve()
          }).catch(err => {
            reject(err)
          })
      })
    },
    getAgeRate ({ commit }) {
      return new Promise((resolve, reject) => {
        getAgeRate()
          .then(res => {
            const data = res.data
            const { list } = data.toObject()
            commit('setAgeRate', list)
            resolve()
          }).catch(err => {
            reject(err)
          })
      })
    },
    getWorkYearRate ({ commit }) {
      return new Promise((resolve, reject) => {
        getWorkYearRate()
          .then(res => {
            const data = res.data
            const { list } = data.toObject()
            commit('setWorkYearRate', list)
            resolve()
          }).catch(err => {
            reject(err)
          })
      })
    },
    getDepEmployeeCount ({ commit }) {
      return new Promise((resolve, reject) => {
        getDepEmployeeCount()
          .then(res => {
            const data = res.data
            const { list } = data.toObject()
            commit('setDepEmployeeCount', list)
            resolve()
          }).catch(err => {
            reject(err)
          })
      })
    },
    getMonthEmployeeChangeData ({ commit }) {
      return new Promise((resolve, reject) => {
        getMonthEmployeeChangeData()
          .then(res => {
            const data = res.data
            const { list } = data.toObject()
            commit('setMonthEmployeeChangeData', list)
            resolve()
          }).catch(err => {
            reject(err)
          })
      })
    },
    getEmployeeData ({ commit }, params) {
      return new Promise((resolve, reject) => {
        getEmployeeList(params)
          .then(res => {
            const data = res.data.toObject()
            commit('setEmployeeData', data)
            resolve()
          }).catch(err => {
            reject(err)
          })
      })
    }
  }
}
