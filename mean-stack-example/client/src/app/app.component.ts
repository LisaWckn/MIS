import {Component, OnInit} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {GreetingService} from "./greeting.service";
import {FormsModule} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {Greeting} from "./greeting";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,
    FormsModule,
    MatFormFieldModule,
    MatInputModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  title = 'Greetings!';
  name = "";

  greeting = "";

  constructor(private greetingService: GreetingService) {}

  ngOnInit(){
    this.greetingService.getGreetings();
  }

  setName(){
    var greetings = this.greetingService.getGreetings();
    console.log(greetings);
    var index = Math.random() * greetings.length;
    var greet = greetings.at(index) as Greeting;
    this.greeting =greet.greeting + ", " + this.name;
  }
}
