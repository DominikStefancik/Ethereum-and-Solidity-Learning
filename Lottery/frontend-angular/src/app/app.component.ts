import { Component } from "@angular/core";
import { web3 } from "../web3";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  title = "frontend-angular";

  constructor() {
    console.log(web3.version);
  }
}
