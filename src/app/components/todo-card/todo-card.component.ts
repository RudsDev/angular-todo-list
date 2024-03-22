import { NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
import { Component, OnInit, computed, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { MatTabsModule } from '@angular/material/tabs'
import { TodoSignalsService } from '../../services/todo-signals.service';
import { Todo } from '../../models/models/Todo.model';
import { TodoKeyLocalStorage } from '../../models/enums/TodoKeyLocalStorage';

@Component({
  selector: 'app-todo-card',
  standalone: true,
  imports: [
    NgFor,
    NgIf,
    NgTemplateOutlet,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule
  ],
  templateUrl: './todo-card.component.html',
  styleUrl: './todo-card.component.scss'
})
export class TodoCardComponent implements OnInit {
  private todoSignalService = inject(TodoSignalsService)
  private todosSignal = this.todoSignalService.todosStateSignal;

  /*
  Computed: Maneira simplificada de lidar com valores computados.
  Valores computados são aqueles que dependem da valor de outros signals.

  Por exemplo, no contexto a seguir a propriedade 'todoList' do valor do
  signal 'todoSignal' (que aponta para TodoSignalsService.todosStateSignal).
  Toda vez que o signal original for atualizado, a computed prop (todoList)
  será atualizada.
  */
  public todosList = computed(() => this.todosSignal());


  ngOnInit(): void {
    this.getTodosFromLocalStorage()
    this.getTodosInLocalStorage()
  }

  public handleTodoDone(id: number):void {
    if(!id) return
    this.todosSignal.update(todos => {
      const found = this.todosList().filter(t => t?.id === id)[0]
      found.done = true
      const index = this.todosList().indexOf(found)
      todos.splice(index, 1)
      return [...todos, found].map(i => i)
    })
    this.todoSignalService.saveTodoOnLocalStorage()
  }

  public handleTodoDelete(todo: Todo):void {
    if(!todo) return
    const index = this.todosList().indexOf(todo)
    if(index < 0) return
    this.todosSignal.update(todos => {
      todos.splice(index, 1)
      return todos.map(i => i)
    })
    this.todoSignalService.saveTodoOnLocalStorage()
  }

  private getTodosFromLocalStorage() :void {
    this.todoSignalService.getTodosFromLocalStorage()
  }

  private getTodosInLocalStorage(): void {
    const todosDatas = localStorage.getItem(
      TodoKeyLocalStorage.TODO_LIST
    ) as string;
    todosDatas && this.todosSignal.set(JSON.parse(todosDatas));
  }

  private updateTodosInLocalStorage():void {
    this.todoSignalService.saveTodoOnLocalStorage()
  }

}
