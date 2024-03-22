import { Injectable, signal } from '@angular/core';
import { Todo } from '../models/models/Todo.model';
import { TodoKeyLocalStorage } from '../models/enums/TodoKeyLocalStorage';

@Injectable({
  providedIn: 'root'
})
export class TodoSignalsService {

  public todosStateSignal = signal<Array<Todo>>([])

  constructor() { }

  public updateTodo(todo: Todo):void {
    if(todo && todo.isValid()) {

      /*
        Um mutate altera um valor de um signal com base em um valor já existente.
        Nesse caso o signal foi inicalizado com um arry vazio. Logo já temos
        acesso a esse valor, podendo assim efetuar operações a partir dele.

        OBS: Era pra ser feito usando o método 'mutate' mas o mesmo foi removido na versão
        17 do Angular
      */
      this.todosStateSignal.update(todos => [...todos, todo])
    }
    this.saveTodoOnLocalStorage()
  }

  public saveTodoOnLocalStorage():void {
    const json = JSON.stringify(this.todosStateSignal().filter(i => i))
    json && localStorage.setItem(TodoKeyLocalStorage.TODO_LIST, json)
  }

  public getTodosFromLocalStorage(): void {
    const json = localStorage.getItem(TodoKeyLocalStorage.TODO_LIST) as string;
    json && this.todosStateSignal.set(JSON.parse(json))
  }
}
