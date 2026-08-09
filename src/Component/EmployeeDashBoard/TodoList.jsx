import { useEffect, useState } from "react"

const TodoList = () => {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("tasks")
    return saved ? JSON.parse(saved) : []
  })
  const [input, setInput] = useState("")
  const [showInput, setShowInput] = useState(false)

  // save to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks))
  }, [tasks])

  const addTask = () => {
    if (!input.trim()) return
    setTasks([...tasks, { id: Date.now(), text: input.trim(), completed: false }])
    setInput("")
    setShowInput(false)
  }

  const toggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t))
  }

  const deleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id))
  }

  return (
    <div className="bg-white p-4 w-full h-full rounded-xl shadow">
      <div className="flex justify-between">
        <p className="font-semibold">My to-do list</p>
        <button
          onClick={() => setShowInput(!showInput)}
          className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
        >
          {showInput ? "Cancel" : "Add"}
        </button>
      </div>

      {showInput && (
        <div className="flex gap-2 mt-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTask()}
            placeholder="Enter task..."
            className="border rounded px-2 py-1 text-sm flex-1 outline-none focus:border-blue-400"
          />
          <button
            onClick={addTask}
            className="bg-green-500 text-white px-3 py-1 rounded text-sm"
          >
            Save
          </button>
        </div>
      )}

      <div className="mt-4 space-y-2 max-h-48 overflow-y-auto pr-1 mb-8 text-sm">
        {tasks.map((t) => (
          <div key={t.id} className="flex items-center justify-between gap-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={t.completed}
                onChange={() => toggleTask(t.id)}
              />
              <span className={t.completed ? "line-through text-gray-400" : ""}>
                {t.text}
              </span>
            </label>
            <button
              onClick={() => deleteTask(t.id)}
              className="text-red-400 hover:text-red-600 text-xs"
            >
              ✕
            </button>
          </div>
        ))}

        {tasks.length === 0 && (
          <p className="text-gray-400 text-center mt-4">No tasks yet</p>
        )}
      </div>

      <p className="text-xs text-gray-400 mt-4">
        {tasks.filter(t => t.completed).length}/{tasks.length} completed
      </p>
    </div>
  )
}

export default TodoList