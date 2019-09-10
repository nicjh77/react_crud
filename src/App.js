import React, { Component } from 'react';
import { Table, Button, Modal, ModalHeader, ModalBody, ModalFooter, InputGroup, InputGroupAddon, Input } from 'reactstrap';
import axios from 'axios';

class App extends Component{
  state = {
    books: [],
    newBookModal: false,
    editBookModal: false,
    deleteBook: false,
    deleteBookId: '',
    newBookData: {
      title: '',
      rating: ''
    },
    editBookData: {
      id: '',
      title: '',
      rating: ''
    }
  }
  componentDidMount = () => {
    this.getList();
  }
  getList = () => {
    axios.get('http://localhost:5000/api/books').then(res => {
      this.setState({
        books: res.data.books
      })
    })
  }
  stateRefresh = () => {
    this.getList();
    this.setState({
      newBookModal: false,
      newBookData: {
        title: '',
        rating: ''
      }
    })
  }
  bookModalOpen = () => {
    this.setState({
      newBookModal: true
    })
  }
  bookModalClose = () => {
    this.setState({
      newBookModal: false,
      newBookData: {
        title: '',
        rating: ''
      }
    })
  }
  editBookModalClose = () => [
    this.setState({
      editBookModal: false,
      editBookData: {
        id: '',
        title: '',
        rating: ''
      }
    })
  ]
  valueChange = (e) => {
    let { newBookData } = {...this.state};
    let nextState = newBookData;
    nextState[e.target.name] = e.target.value;
    
    // const { newBookData } = {...this.state };
    // const currentState = newBookData;
    // const {name, value} = e.target;
    // currentState[name] = value;
    // this.setState({newBookData: currentState});
    
    this.setState({newBookData : nextState});
  }
  valueUpdateChange = (e) => {
    let { editBookData } = {...this.state};
    let nextState = editBookData;
    nextState[e.target.name] = e.target.value;
    
    // const { newBookData } = {...this.state };
    // const currentState = newBookData;
    // const {name, value} = e.target;
    // currentState[name] = value;
    // this.setState({newBookData: currentState});
    
    this.setState({newBookData : nextState});
  }
  addBook = () => {
    //const config={headers:{'content-type':'application/json'}}
    axios.post('http://localhost:5000/api/books', this.state.newBookData).then(response => {
      this.bookModalClose();
      this.stateRefresh();
      
    })
  }
  editBook = (book) => {
    this.setState({
      editBookModal: true
    });
    axios.get('http://localhost:5000/api/books/' + book.id).then(res => {
      let { editBookData } = {...this.state};
      editBookData.id = res.data.book[0].id; 
      editBookData.title = res.data.book[0].title;
      editBookData.rating = res.data.book[0].rating; 
      this.setState({
        editBookData
      })

      // this.setState(prevState => {
      //   let editBookData = Object.assign({}, prevState.editBookData);  
      //   editBookData.id = res.data.book[0].id; 
      //   editBookData.title = res.data.book[0].title;
      //   editBookData.rating = res.data.book[0].rating;                                    
      //   return { editBookData };                                
      // })
    })
  }

  updateBook = () => {
    axios.put('http://localhost:5000/api/books/' + this.state.editBookData.id, this.state.editBookData).then(response => {
      this.editBookModalClose();
      this.stateRefresh();
      
    })
  }
  editbookModalCloseRightNow = () => {
    this.editBookModalClose();
  }
  goDeleteBook = (book) => {
    this.setState({
      deleteBook: true,
      deleteBookId: book.id
    })
  }
  deleteModalClose = () => {
    this.setState({
      deleteBook: false
    })
  }
  deleteBook = () => {
    axios.delete('http://localhost:5000/api/books/' + this.state.deleteBookId).then(response => {
      this.stateRefresh();  
      this.deleteModalClose();
    })
  }

  render(){
    let books = this.state.books.map(book => {
      return(
        <tr key={book.id}>
          <td>{book.id}</td>
          <td>{book.title}</td>
          <td>{book.rating}</td>
          <td>
            <Button color="success" size="sm" className="mr-2" onClick={this.editBook.bind(this, book)}>Edit</Button>
            <Button color="danger" size="sm" onClick={this.goDeleteBook.bind(this, book)}>Delete</Button>
          </td>
        </tr>
      )
    });
    return(
      <div className="App container">
        <Button color="danger" onClick={this.bookModalOpen}>Add Book</Button>
        <Modal isOpen={this.state.newBookModal}>
          <ModalHeader toggle={this.bookModalClose}>Add a New Book</ModalHeader>
          <ModalBody>
            <InputGroup className="mb-2">
              <InputGroupAddon addonType="prepend">Title</InputGroupAddon>
              <Input type="text" name="title" value={this.state.newBookData.title} onChange={this.valueChange} />
            </InputGroup>
            <InputGroup>
              <InputGroupAddon addonType="prepend">Rate</InputGroupAddon>
              <Input type="text" name="rating" value={this.state.newBookData.rating} onChange={this.valueChange} />
            </InputGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.addBook}>Add Book</Button>
            <Button color="secondary" onClick={this.bookModalClose}>Cancel</Button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={this.state.editBookModal}>
          <ModalHeader toggle={this.editbookModalCloseRightNow}>Edit a Book</ModalHeader>
          <ModalBody>
            <InputGroup className="mb-2">
              <InputGroupAddon addonType="prepend">Title</InputGroupAddon>
              <Input type="text" name="title" value={this.state.editBookData.title} onChange={this.valueUpdateChange} />
            </InputGroup>
            <InputGroup>
              <InputGroupAddon addonType="prepend">Rate</InputGroupAddon>
              <Input type="text" name="rating" value={this.state.editBookData.rating} onChange={this.valueUpdateChange} />
            </InputGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.updateBook}>Update Book</Button>
            <Button color="secondary" onClick={this.editbookModalCloseRightNow}>Cancel</Button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={this.state.deleteBook}>
          <ModalHeader toggle={this.deleteModalClose}>Delete a book</ModalHeader>
          <ModalBody>
            Are you sure to Remove this book?
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.deleteBook}>Remove Book</Button>
            <Button color="secondary" onClick={this.deleteModalClose}>Cancel</Button>
          </ModalFooter>
        </Modal>

        <Table>
          <thead>
            <tr>
              <th>#</th>
              <th>Title</th>
              <th>Rating</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {books}
          </tbody>
        </Table>

      </div>
    )
  }
}

export default App;
