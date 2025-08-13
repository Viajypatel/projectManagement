import api from './api'

export type Project = {
  _id: string
  title: string
  description?: string
  status?: 'active' | 'completed'
  createdAt?: string
  updatedAt?: string
}

export async function fetchProjects(): Promise<Project[]> {
  const { data } = await api.get('/api/projects')
  return data
}

export async function createProject(input: { title: string; description?: string }): Promise<Project> {
  const { data } = await api.post('/api/projects', input)
  return data
}

export async function updateProject(projectId: string, input: Partial<Pick<Project, 'title' | 'description' | 'status'>>): Promise<Project> {
  const { data } = await api.put(`/api/projects/${projectId}`, input)
  return data
}

export async function deleteProject(projectId: string): Promise<{ message: string }> {
  const { data } = await api.delete(`/api/projects/${projectId}`)
  return data
}


