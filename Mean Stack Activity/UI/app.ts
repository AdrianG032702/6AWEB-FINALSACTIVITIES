import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms'; // Import Reactive tools

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule], // Use ReactiveFormsModule
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent implements OnInit {
  readonly APIUrl = "http://localhost:5038/api/books/";
  books: any = [];
  isEditMode = false;
  currentBookId: any = null;

  // Define the Reactive Form Group
  bookForm = new FormGroup({
    title: new FormControl('', Validators.required),
    desc: new FormControl('', Validators.required),
    price: new FormControl('', [Validators.required, Validators.min(0)]),
    author: new FormControl('', Validators.required),
    genre: new FormControl('', Validators.required)
  });

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.refreshBooks();
  }

  refreshBooks() {
    this.http.get(this.APIUrl + 'GetBooks').subscribe(data => {
      this.books = data;
    });
  }

  submitBook() {
    if (this.bookForm.invalid) {
      alert("Please fill all fields correctly.");
      return;
    }

    const formData = new FormData();
    // Access values using this.bookForm.value
    formData.append("title", this.bookForm.value.title!);
    formData.append("description", this.bookForm.value.desc!);
    formData.append("price", this.bookForm.value.price!.toString());
    formData.append("author", this.bookForm.value.author!);
    formData.append("genre", this.bookForm.value.genre!);

    if (this.isEditMode) {
      this.http.put(this.APIUrl + 'UpdateBook?id=' + this.currentBookId, formData).subscribe(res => {
        alert(res);
        this.resetForm();
        this.refreshBooks();
      });
    } else {
      this.http.post(this.APIUrl + 'AddBook', formData).subscribe(res => {
        alert(res);
        this.resetForm();
        this.refreshBooks();
      });
    }
  }

  editBook(book: any) {
    this.isEditMode = true;
    this.currentBookId = book.id;
    // Use patchValue to fill the reactive form
    this.bookForm.patchValue({
      title: book.title,
      desc: book.desc,
      price: book.price,
      author: book.author,
      genre: book.genre
    });
  }

  deleteBook(id: any) {
    this.http.delete(this.APIUrl + 'DeleteBook?id=' + id).subscribe(res => {
      alert(res);
      this.refreshBooks();
    });
  }

  resetForm() {
    this.isEditMode = false;
    this.currentBookId = null;
    this.bookForm.reset();
  }
}
