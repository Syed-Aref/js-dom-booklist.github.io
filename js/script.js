


/// UI Elements
let form = document.getElementById('book-form');
let bookList = document.getElementById('book-list');

/// OOP classes
//Book class=>To store all informations of
//a book inside a single class.
class Book{
    constructor(tittle,author,isbn){
        this.tittle = tittle;
        this.author = author;
        this.isbn = isbn;
    }
    bookName() {
        return this.tittle+"-"+this.author+"-"+this.isbn;
    }

}

//ui class=> To group all functions of ui
//in a single class
class ui{
    //Reseting form field
    static clearField(){
        document.getElementById('title').value = '';
        document.getElementById('author').value = '';
        document.getElementById('isbn').value = '';
    }
    //Showing alert(after deletion or error)
    static showAlert(message,className){
        //Creating element(alert) to view in DOM
        let ele = document.createElement('div');
        ele.classList.add("alert-class");
        ele.classList.add(className);
        ele.appendChild( document.createTextNode(message) );
        /// console.log(ele);

        form.parentNode.insertBefore(ele, form);
        //insertBefore() syntax: node.insertBefore(newnode, existingnode)

        //clear alert after sometime
        setTimeout(() => {
            ele = document.querySelector(".alert-class");
            ele.remove();
        }, 2000);
    }

    //Adding in DOM
    static add(book){
        //Creating elements and appending them
        let cross = document.createElement('a');
        cross.setAttribute("href" , "#");
        cross.setAttribute("cross" , "cross");
        cross.appendChild( document.createTextNode('X') );
        let tmp = document.createElement('td');
        tmp.appendChild(cross);

        let element = document.createElement('tr');
        element.innerHTML = 
        `<td>${book.tittle}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>`;
        element.appendChild(tmp);

        bookList.appendChild(element);
    }
}

//storage class=> to group all necessary functions
//involving local-storage in a class
class storage{
    //Retrunging local-storage values of'key named 'books'(As JS obect after parsing)
    static bookList_Function(){
        try{
            let books;
            if( localStorage.getItem('books') === null ) books = [];
            else books = JSON.parse( localStorage.getItem('books') );
            //console.log(books);
            //As it has been initialized as as array, 
            //the return type will also be an array.
            return books;
        }catch(err){
            console.log(err);
        }
        
    }

    static add(book){
        try{

            let books = storage.bookList_Function();
            //Value of key named 'books'(js object/array)
            books.push( book.bookName() );
            //pushing new element in array
            localStorage.setItem("books",JSON.stringify(books));
            //Replace/initialize 'books'(key) with new array('books)
        }
        catch(err){
            console.log(err.message);
        }
        
    }

    static reloadF(e){
        let books = storage.bookList_Function();
        //Value of key named 'books'(js object/array)
        books.forEach(
            (book) => {
                let lst = book.split("-");
                ui.add( new Book(lst[0] , lst[1] , lst[2]) );
                //Each book added in ui/DOM
            }
        );
    }

    static removeLS(bookname){
        let books = storage.bookList_Function();
        //Value of key named 'books'(js object/array)
        let i;
        books.forEach(
            (book , index) => {
                if(book == bookname) i = index;
                //Matching bookname
                //If matched store the index
            }
        );
        books.splice(i,1);
        //Remove the element at that index
        localStorage.setItem('books', JSON.stringify(books));
        //Replace/initialize 'books'(key) with new array('books)
    }
    
}

// Event listener
//Add function
form.addEventListener('submit',addFunction);
//Function when DOM is reloaded
document.addEventListener('DOMContentLoaded', storage.reloadF);
//Remove function
bookList.addEventListener('click' , removeBook);

function addFunction(e) {
    let tittle = document.getElementById('title').value;
    let author = document.getElementById('author').value;
    let isbn = document.getElementById('isbn').value;

    if( tittle==='' || author==='' || isbn==='' ){
        ui.showAlert("Error" , "error");
    }
    else{
        //new book object.
        let book = new Book(tittle,author,isbn);
        //console.log(book.bookName());
        //adding them in UI/DOM
        ui.add(book);
        ///console.log(book.bookName());
        //adding them in local-storage
        storage.add(book);
        //showing alert in DOM/UI
        ui.showAlert("Success" , "success");
    }
    
    ui.clearField();

    e.preventDefault();
}

function removeBook(e) {
    if(e.target.hasAttribute("cross")){
        //Only works for element taht has attribute "cross"
        //Sequentially targett the element to be removed
        let elem = e.target.parentNode;
        elem = elem.parentNode;

        //Fetching the necessary informaton.
        let lst = elem.children;
        ///console.log(lst);
        let a1 = (lst[0].textContent.trim());
        let a2 = (lst[1].textContent.trim());
        let a3 = (lst[2].textContent.trim());
        //Remove from local storage.
        storage.removeLS(a1+"-"+a2+"-"+a3);
        //Removing th element
        elem.remove();
    }
}