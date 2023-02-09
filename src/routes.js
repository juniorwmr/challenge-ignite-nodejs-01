import { buildRoutePath } from './utils/build-route-path.js'
import { Database } from './database/db.js'
import { httpResponse } from './utils/http-response.js'
import { Task } from './model/task.js'

const database = new Database()

export const routes = [
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (request, response) => {
      const tasks = database.select('tasks')
      return httpResponse(response)({
        statusCode: 200,
        body: tasks
      })
    }
  },
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (request, response) => {
      if (!request.body?.title) {
        return httpResponse(response)({
          statusCode: 400,
          body: {
            message: 'Title is required'
          }
        })
      } else if (!request.body?.description) { 
        return httpResponse(response)({
          statusCode: 400,
          body: {
            message: 'Description is required'
          }
        })
      }

      const task = new Task().create(request.body)
      const data = database.insert('tasks', task)
      return httpResponse(response)({
        statusCode: 201,
        body: data
      })
    }
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (request, response) => {
      const { id } = request.params

      const taskExists = database.select('tasks').find((task) => task.id === id)
      if (!taskExists) {
        return httpResponse(response)({
          statusCode: 404,
          body: {
            message: 'Task not found'
          }
        })
      }

      const task = new Task().update({
        title: request.body?.title,
        description: request.body?.description,
      })

      database.update('tasks', {
        id,
        data: task
      })
      return httpResponse(response)({
        statusCode: 204
      })
    }
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (request, response) => {
      const { id } = request.params
      database.delete('tasks', { id })
      return httpResponse(response)({
        statusCode: 204
      })
    }
  },
  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id/complete'),
    handler: (request, response) => {
      const { id } = request.params
      
      const taskExists = database.select('tasks').find((task) => task.id === id)
      if (!taskExists) {
        return httpResponse(response)({
          statusCode: 404,
          body: {
            message: 'Task not found'
          }
        })
      }

      const task = new Task().update({
        completed_at: Date.now()
      })
      
      database.update('tasks', {
        id,
        data: task
      })
      return httpResponse(response)({
        statusCode: 204
      })
    }
  }
]