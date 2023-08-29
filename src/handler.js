/* eslint-disable no-unused-vars */
const { nanoid } = require('nanoid')
const books = require('./books')

const addBookHandler = (request, h) => {
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload
  const id = nanoid(16)
  const insertedAt = new Date().toISOString()
  const updatedAt = insertedAt

  let finished = false

  if (pageCount === readPage) {
    finished = true
  };

  const newBooks = {
    name, year, author, summary, publisher, pageCount, readPage, id, insertedAt, updatedAt, finished, reading
  }

  if (name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku'
    })
    response.code(400)
    return response
  } else if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
    })
    response.code(400)
    return response
  } else {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id
      }
    })
    response.code(201)
    books.push(newBooks)
    return response
  }
}

const getAllBooksHandler = (request, h) => {
  const { reading, finished, name } = request.query

  if (reading === '1') {
    return {
      message: 'success',
      data: {
        books: books.filter((b) => b.reading === true)
      }
    }
  }

  if (reading === '0') {
    return {
      status: 'success',
      data: {
        books: books.filter((b) => b.reading === false)
      }
    }
  }

  if (finished === '1') {
    return {
      status: 'success',
      data: {
        books: books.filter((b) => b.pageCount === b.readPage)
      }
    }
  }

  if (finished === '0') {
    return {
      status: 'success',
      data: {
        books: books.filter((b) => b.pageCount > b.readPage)
      }
    }
  }

  if (name !== undefined) {
    return {
      status: 'success',
      data: {
        books: books.filter((b) => b.name.toLowerCase().includes(name.toLowerCase()))
      }
    }
  }

  if (books !== undefined) {
    return {
      status: 'success',
      data: {
        books: books.map(book => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher
        }))
      }
    }
  }
}

const getBookByIdHandler = (request, h) => {
  const { id } = request.params
  const book = books.filter((b) => b.id === id)[0]

  if (book !== undefined) {
    return {
      status: 'success',
      data: {
        book
      }
    }
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan'
  })
  response.code(404)
  return response
}

const editBookByIdHandler = (request, h) => {
  const { id } = request.params

  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload

  const index = books.findIndex((b) => b.id === id)

  if (name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku'
    })
    response.code(400)
    return response
  } else if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
    })
    response.code(400)
    return response
  }

  if (index === -1) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan'
    })
    response.code(404)
    return response
  } else {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      finished: (pageCount === readPage),
      reading,
      updatedAt: new Date().toISOString()
    }
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui'
    })
    response.code(200)
    return response
  }
}

const deleteBookByIdHandler = (request, h) => {
  const { id } = request.params

  const index = books.findIndex((b) => b.id === id)
  if (index !== -1) {
    books.splice(index, 1)
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus'
    })
    response.code(200)
    return response
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan'
  })
  response.code(404)
  return response
}

module.exports = { addBookHandler, getAllBooksHandler, getBookByIdHandler, editBookByIdHandler, deleteBookByIdHandler }
