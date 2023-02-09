import fs from 'node:fs/promises'

const databasePath = new URL('database.json', import.meta.url)

export class Database {
  #database = {}

  constructor() {
    fs.readFile(databasePath, 'utf-8').then((data) => { 
      this.#database = JSON.parse(data)
    }).catch(() => {
      this.#persist()
    })
  }

  #persist() {
    try {
      fs.writeFile(databasePath, JSON.stringify(this.#database))
    } catch {
      console.error('Error writing to database')
    }
  }

  select(table) {
    const data = this.#database[table] ?? []
    return data
  }

  insert(table, data) {
    if (Array.isArray(this.#database[table])) {
      this.#database[table].push(data)
    } else {
      this.#database[table] = [data]
    }
    
    this.#persist()
    return data;
  }

  update(table, { id, data }) {
    return this.#database[table].find((row, index) => {
      if (row.id === id) {
        this.#database[table][index] = {
          ...row,
          ...data
        }
        this.#persist()
        return true
      }
    })
  }

  delete(table, { id }) { 
    return this.#database[table].find((row, index) => {
      if (row.id === id) {
        this.#database[table].splice(index, 1)
        this.#persist()
        return true
      }
    })
  }
}