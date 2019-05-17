import { Injectable } from '@angular/core';

/*
  Generated class for the CollectionsProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class CollectionsProvider {
  requestCollection = "requests";
  usersCollection = "users";
  friendsCollection = "friends"
  chatsCollection ="chat";
  constructor() {
   
  }

}
