import { ErrorHandler, Injectable } from "@angular/core";
import { Router } from "@angular/router";

@Injectable()
export class ErrorHandlerService implements ErrorHandler {
    constructor(private router: Router) { }

    handleError(error: any): void {
        console.error('Message d\'erreur : ', error.message);
        console.error('Erreur suivante : ', error);
        this.router.navigateByUrl('**');
    }
}