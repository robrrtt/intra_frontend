import axios from 'axios'

const API_URL = '/api/items'

export default {
  getItems() {
    return axios.get(API_URL) // Must be authenticated!
  },
  createItem(data) {
    return axios.post(API_URL, data)
  },
  updateItem(id, data) {
    return axios.put(`${API_URL}/${id}`, data)
  },
  deleteItem(id) {
    return axios.delete(`${API_URL}/${id}`)
  }
}
