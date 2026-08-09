import Task from "../model/Todo.js"

export const getTasks = async (req, res) => {
  const { userId } = req.query  
  const tasks = await Task.find({ userId })
  res.json({ success: true, tasks })
}

export const addTask = async (req, res) => {
  const { userId, text } = req.body
  const task = await Task.create({ userId, text })
  res.json({ success: true, task })
}

export const toggleTask = async (req, res) => {
  const task = await Task.findById(req.params.id)
  task.completed = !task.completed
  await task.save()
  res.json({ success: true, task })
}

export const deleteTask = async (req, res) => {
  await Task.findByIdAndDelete(req.params.id)
  res.json({ success: true })
}