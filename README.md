# Fresno Gaming Community Ladder

This project is my effort to create a site that fighting game players in the Fresno area can use to have a consistent method of challenging each other. I always wanted to build a ladder site for that purpose and here it is.

The site is deployed using firebase here: https://fgc-ladder-1261d.firebaseapp.com/

## Features

Users can sign up to one of the games either anonymously or by linking a Google account. After they are approved by an admin, they can place challenges. If they linked their google account, they will have access to a user dashboard that displays their info for each game and any outstanding challenges they have.

The list of players, player info, standings, recent matches, and everything pending are all stored on a Firebase backend using their Realtime Database.

There is also an admin section allowing admins to approve applications to join a ladder, approve anonymous challenges and approve score postings. The admin can also post news onto the front page as well as manually add/edit/remove any player from the ladder.

## Credits

This is created in Angular2, using a Firebase backend. 99% of the code was created by me, J.R. Ruggiero. Some other credits include:

ELO calcluator was mostly taken from the JS file posted by github user Moroshko here:
https://github.com/moroshko/elo.js


This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.4.3.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
