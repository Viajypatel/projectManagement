import api from './api'

export type Task = {
  _id: string
  project: string
  title: string
  description?: string
  status?: 'todo' | 'in-progress' | 'done'
  dueDate?: string
}

export async function fetchTasks(projectId: string, status?: Task['status']): Promise<Task[]> {
  const params = status ? { status } : undefined
  const { data } = await api.get(`/api/tasks/${projectId}`, { params })
  return data
}

export async function createTask(input: { project: string; title: string; description?: string; dueDate?: string }): Promise<Task> {
  const { data } = await api.post('/api/tasks', input)
  return data
}

export async function updateTask(taskId: string, input: Partial<Pick<Task, 'title' | 'description' | 'status' | 'dueDate'>>): Promise<Task> {
  const { data } = await api.put(`/api/tasks/${taskId}`, input)
  return data
}

export async function deleteTask(taskId: string): Promise<{ message: string }> {
  const { data } = await api.delete(`/api/tasks/${taskId}`)
  return data
}


