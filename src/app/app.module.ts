import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { LoginPage } from '../pages/login/login';
import { ProfilePage } from '../pages/profile/profile';
import { SubscriptionPage } from '../pages/subscription/subscription';


import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

//FIREBASE
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';

const firebaseConfig = {
    apiKey: "AIzaSyAKC1QBxrKsYVoROebkrDfh17XnAe_F-Js",
    authDomain: "avalon-991ac.firebaseapp.com",
    databaseURL: "https://avalon-991ac.firebaseio.com",
    projectId: "avalon-991ac",
    storageBucket: "avalon-991ac.appspot.com",
    messagingSenderId: "439691655002"
}

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    LoginPage,
    ProfilePage,
    SubscriptionPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule,
    AngularFirestoreModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
    LoginPage,
    ProfilePage,
    SubscriptionPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    AngularFireAuthModule,
    AngularFirestoreModule,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})

export class AppModule {}
