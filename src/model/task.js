import { randomUUID } from 'node:crypto'

export class Task {
  constructor(props) {
    Object.assign(this, props)
  }

  create({
    id = undefined,
    title,
    description = null
  }) {
    return new Task({
      id: id ?? randomUUID(),
      title,
      description,
      completed_at: null,
      created_at: Date.now(),
      updated_at: null
    })
  }

  update({
    title = undefined,
    description = undefined,
    completed_at = undefined
  }) {
    return new Task({
      ...(title && { title }),
      ...(description && { description }),
      ...(completed_at && { completed_at }),
      updated_at: Date.now()
    })
  }
}