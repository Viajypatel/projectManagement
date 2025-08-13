import { useEffect, useMemo, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { fetchTasks, createTask, deleteTask, updateTask } from '../../lib/tasks'
import type { Task } from '../../lib/tasks'
import { updateProject } from '../../lib/projects'

const ProjectDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [filter, setFilter] = useState<Task['status'] | ''>('')

  const projectId = id as string

  const filteredTasks = useMemo(() => {
    if (!filter) return tasks
    return tasks.filter(t => t.status === filter)
  }, [tasks, filter])

  const load = async () => {
    try {
      setLoading(true)
      const data = await fetchTasks(projectId)
      setTasks(data)
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Failed to load tasks')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (projectId) load()
  }, [projectId])

  const onCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    const payload: any = { project: projectId, title, description }
    if (dueDate) payload.dueDate = new Date(dueDate).toISOString()
    const t = await createTask(payload)
    setTasks(prev => [t, ...prev])
    setTitle('')
    setDescription('')
    setDueDate('')
  }

  const onToggleStatus = async (t: Task) => {
    const next: Task['status'] = t.status === 'done' ? 'todo' : 'done'
    const updated = await updateTask(t._id, { status: next })
    setTasks(prev => prev.map(x => x._id === t._id ? updated : x))
  }

  const onDelete = async (id: string) => {
    await deleteTask(id)
    setTasks(prev => prev.filter(x => x._id !== id))
  }

  const markProjectCompleted = async () => {
    await updateProject(projectId, { status: 'completed' })
    // no-op UI; could redirect back
  }

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Project</h1>
        <Link to="/projects" className="underline">Back</Link>
      </div>

      <div className="mb-6">
        <button onClick={markProjectCompleted} className="px-3 py-1 border rounded">Mark Project Completed</button>
      </div>

      <form onSubmit={onCreate} className="mb-6 space-y-2">
        <input className="w-full border rounded px-3 py-2" placeholder="Task title" value={title} onChange={e => setTitle(e.target.value)} />
        <input className="w-full border rounded px-3 py-2" placeholder="Description (optional)" value={description} onChange={e => setDescription(e.target.value)} />
        <input type="date" className="w-full border rounded px-3 py-2" value={dueDate} onChange={e => setDueDate(e.target.value)} />
        <button className="bg-blue-600 text-white px-4 py-2 rounded">Add Task</button>
      </form>

      <div className="mb-4 space-x-2">
        <span className="text-sm">Filter:</span>
        <select className="border rounded px-2 py-1" value={filter} onChange={e => setFilter(e.target.value as any)}>
          <option value="">All</option>
          <option value="todo">Todo</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </select>
      </div>

      {loading && <div>Loading…</div>}
      {error && <div className="text-red-600 mb-4">{error}</div>}

      <ul className="space-y-3">
        {filteredTasks.map(t => (
          <li key={t._id} className="border rounded p-3 flex items-center justify-between">
            <div>
              <div className="font-medium">{t.title}</div>
              {t.description && <div className="text-sm text-gray-600">{t.description}</div>}
              <div className="text-xs mt-1">Status: {t.status || 'todo'}</div>
              {t.dueDate && <div className="text-xs">Due: {new Date(t.dueDate).toLocaleDateString()}</div>}
            </div>
            <div className="space-x-2">
              <button onClick={() => onToggleStatus(t)} className="px-3 py-1 border rounded">
                {t.status === 'done' ? 'Mark Todo' : 'Mark Done'}
              </button>
              <button onClick={() => onDelete(t._id)} className="px-3 py-1 border rounded text-red-600">Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ProjectDetailPage


