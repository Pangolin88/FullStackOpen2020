// import axios from 'axios'
// const baseUrl = '/api/notes'
//
// let token = null
//
// const setToken = newToken => {
//   token = `bearer ${newToken}`
// }
//
// const getAll = () => {
//   const request = axios.get(baseUrl)
//   return request.then(response => response.data)
// }
//
// const create = newObject => {
//   const config = {
//     headers: { Authorization: token },
//   }
//   const request = axios.post(baseUrl, newObject, config)
//   return request.then(response => response.data)
// }
//
//
// const update = (id, newObject) => {
//   const request = axios.put(`${baseUrl}/${id}`, newObject)
//   return request.then(response => response.data)
// }
//
// export default { getAll, create, update, setToken }

import axios from 'axios'

const baseUrl = 'http://localhost:3001/notes'

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const createNew = async (content) => {
  const object = { content, important: false }
  const response = await axios.post(baseUrl, object)
  return response.data
}

export default { getAll, createNew }