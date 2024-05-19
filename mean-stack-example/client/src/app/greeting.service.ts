import {Injectable, signal} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Greeting} from "./greeting";

@Injectable({
  providedIn: 'root'
})
export class GreetingService {
  private url = 'http://localhost:5200';
  greetings$ = signal<Greeting[]>([]);
  greeting$ = signal<Greeting>({} as Greeting);

  constructor(private httpClient: HttpClient) { }

  private refreshGreetings() {
    this.httpClient.get<Greeting[]>(`${this.url}/greeting`)
      .subscribe(greetings => {
        this.greetings$.set(greetings);
      });
  }

  getGreetings() {
    this.refreshGreetings();
    return this.greetings$();
  }

  getGreeting(id: string) {
    this.httpClient.get<Greeting>(`${this.url}/greeting/${id}`).subscribe(greeting => {
      this.greeting$.set(greeting);
      return this.greeting$();
    });
  }

  createGreeting(greeting: Greeting) {
    return this.httpClient.post(`${this.url}/greeting`, greeting, { responseType: 'text' });
  }

  updateGreeting(id: string, greeting: Greeting) {
    return this.httpClient.put(`${this.url}/greeting/${id}`, greeting, { responseType: 'text' });
  }

  deleteGreeting(id: string) {
    return this.httpClient.delete(`${this.url}/greeting/${id}`, { responseType: 'text' });
  }
}
