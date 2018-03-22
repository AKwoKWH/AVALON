import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule} from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule, NavParams } from 'ionic-angular';

import { QRCodeModule } from 'angular2-qrcode';

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
    apiKey: "AIzaSyDhPrYaymeIAeCCZEdwR3Zs5YYsjyTo_YA",
    authDomain: "avalon-905dd.firebaseapp.com",
    databaseURL: "https://avalon-905dd.firebaseio.com",
    projectId: "avalon-905dd",
    storageBucket: "avalon-905dd.appspot.com",
    messagingSenderId: "352103684706"
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
    AngularFirestoreModule,
    QRCodeModule
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
    // NavParams,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})

export class AppModule {}
