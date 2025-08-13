import { useEffect, useState } from 'react'
import { createProject, deleteProject, fetchProjects, updateProject } from '../../lib/projects'
import type { Project } from '../../lib/projects'
import { Link } from 'react-router-dom'

const ProjectsListPage = () => {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const load = async () => {
    try {
      setLoading(true)
      const data = await fetchProjects()
      setProjects(data)
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Failed to load projects')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const onCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const p = await createProject({ title, description })
      setProjects(prev => [p, ...prev])
      setTitle('')
      setDescription('')
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Failed to create project')
    }
  }

  const onToggleStatus = async (p: Project) => {
    const newStatus = p.status === 'completed' ? 'active' : 'completed'
    const updated = await updateProject(p._id, { status: newStatus })
    setProjects(prev => prev.map(x => x._id === p._id ? updated : x))
  }

  const onDelete = async (id: string) => {
    await deleteProject(id)
    setProjects(prev => prev.filter(x => x._id !== id))
  }

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Projects</h1>

      <form onSubmit={onCreate} className="mb-6 space-y-2">
        <input className="w-full border rounded px-3 py-2" placeholder="Project title" value={title} onChange={e => setTitle(e.target.value)} />
        <input className="w-full border rounded px-3 py-2" placeholder="Description (optional)" value={description} onChange={e => setDescription(e.target.value)} />
        <button className="bg-blue-600 text-white px-4 py-2 rounded">Add Project</button>
      </form>

      {loading && <div>Loading…</div>}
      {error && <div className="text-red-600 mb-4">{error}</div>}

      {projects.length === 0 && !loading ? (
        <div className="text-sm text-gray-600">No projects yet. Create your first project above.</div>
      ) : (
        <ul className="space-y-3">
          {projects.map(p => (
            <li key={p._id} className="border rounded p-3 flex items-center justify-between">
              <div>
                <Link to={`/projects/${p._id}`} className="font-medium underline">{p.title}</Link>
                {p.description && <div className="text-sm text-gray-600">{p.description}</div>}
                <div className="text-xs mt-1">Status: {p.status}</div>
              </div>
              <div className="space-x-2">
                <button onClick={() => onToggleStatus(p)} className="px-3 py-1 border rounded">
                  {p.status === 'completed' ? 'Mark Active' : 'Mark Done'}
                </button>
                <button onClick={() => onDelete(p._id)} className="px-3 py-1 border rounded text-red-600">Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default ProjectsListPage


