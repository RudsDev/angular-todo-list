import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TodoSignalsService } from '../../services/todo-signals.service';
import { Todo } from '../../models/models/Todo.model';

@Component({
  selector: 'app-todo-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './todo-form.component.html',
  styleUrl: './todo-form.component.scss',
})
export class TodoFormComponent implements OnInit {
  private todosSignalsServices = inject(TodoSignalsService);
  private allTodos!: Array<Todo>;

  todoForm = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.minLength(3)]),
    description: new FormControl('', [
      Validators.required,
      Validators.minLength(5),
    ]),
  });

  ngOnInit(): void {
    this.allTodos = this.todosSignalsServices.todosStateSignal();
  }

  public handleCreateTodo():void {
    if(!this.todoForm || this.todoForm.invalid) return
    const id = Number(this.allTodos.length++)
    const title = String(this.todoForm.controls['title'].value)
    const description = String(this.todoForm.controls['description'].value)
    const done = false
    this.todosSignalsServices.updateTodo(new Todo(id, title, description, done))

  }
}
