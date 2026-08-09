import { api } from "../api/request"

export const fetchTasks = async (userId) => {
  const res = await api.get(`/todo/?userId=${userId}`)
  if (res.data.success) return res.data.tasks
}

export const createTask = async (userId, text) => {
  const res = await api.post("/todo/task/add", { userId, text })
  if (res.data.success) return res.data.task
}

export const updateTask = async (id) => {
  const res = await api.put(`/todo/task/${id}`)
  if (res.data.success) return res.data.task
}

export const removeTask = async (id) => {
  const res = await api.delete(`/todo/task/${id}`)
  if (res.data.success) return true
}