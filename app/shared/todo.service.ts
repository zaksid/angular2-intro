import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { Todo } from './todo';

@Injectable()
export class TodoService {
    private apiUrl = 'api/todos';
    todos: Todo[] = [];

    constructor(private http: Http) { }

    getTodos(): Promise<Todo[]> {
        return this.http.get(this.apiUrl)
            .toPromise()
            .then(res => res.json().data)
            .then(todos => this.todos = todos)
            .catch(this.handleErrorerror);
    }

    createTodo(title: string) {
        let headers = new Headers({ 'Content-Type': 'application/json' }),
            options = new RequestOptions({ headers }),
            todo = new Todo(title);

        this.http.post(this.apiUrl, todo, options)
            .toPromise()
            .then(res => res.json().data)
            .then(todo => this.todos.push(todo))
            .catch(this.handleErrorerror);
    }

    deleteTodo(todo: Todo) {
        let headers = new Headers({ 'Content-Type': 'application/json' }),
            options = new RequestOptions({ headers }),
            url = `${this.apiUrl}/${todo.id}`;

        this.http.delete(url, options)
            .toPromise()
            .then(res => {
                let index = this.todos.indexOf(todo);

                if (index > -1) {
                    this.todos.splice(index, 1);
                }
            })
            .catch(this.handleErrorerror);
    }

    toggleTodo(todo: Todo) {
        let headers = new Headers({ 'Content-Type': 'application/json' }),
            options = new RequestOptions({ headers }),
            url = `${this.apiUrl}/${todo.id}`;

        this.http.put(url, todo, options)
            .toPromise()
            .then(res => {
                todo.completed = !todo.completed;
            })
            .catch(this.handleErrorerror);
    }

    private handleErrorerror(error: any) {
        console.error('An error occured', error);
        return Promise.reject(error.message || error);
    }
}