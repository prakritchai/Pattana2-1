import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, ToastController } from 'ionic-angular';
import { UsernameValidator } from '../../providers/username/username';
import { Storage } from '@ionic/storage';

import { RegisterPage } from '../register/register';
import { TabsPage } from '../tabs/tabs';

//REST
import { from } from 'rxjs/observable/from'
import { TestapiProvider } from '../../providers/testapi/testapi';




/**
 * 
 * 
 * 
 * 
 * Generated class for the Login2Page page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {


  @ViewChild('signupSlider') signupSlider: any;

  slideOneForm: FormGroup;
  SendLogin: any;
  username: string;
  password: string;
  Stu_ID: any;

  FailToast:any;
  EmptyToast:any;
  
  submitAttempt: boolean = false;

  constructor(public navCtrl: NavController, public formBuilder: FormBuilder,
     public testapiProvider: TestapiProvider,public storage:Storage,public toastCtrl:ToastController) {

    this.slideOneForm = formBuilder.group({
      userName: ['', Validators.compose([Validators.required, Validators.pattern('[a-zA-Z]*')]), UsernameValidator.checkUsername],
      firstName: ['', Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
      lastName: ['', Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
      password: [''],
      age: ['']
    });
    
  }
  

  registcomplete() {
    this.navCtrl.push(LoginPage)
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad Login2Page');
    this.storage.clear();
  }

  Login(){
    console.log("username",this.username);
    console.log("password",this.password);
    if(this.username||this.password){
      this.SendLogin = from(this.testapiProvider.CheckLogin(this.username,this.password))
      this.SendLogin.subscribe(val =>{
        this.Stu_ID = val["Stu_ID"];
        console.log("Stu_ID: ",this.Stu_ID)
        if(val["exist"]==true){
          //Need to think about the page that should send data to
          this.storage.set('stuid', this.Stu_ID);
          this.navCtrl.setRoot(TabsPage,{"tempStu_ID":this.Stu_ID.valueOf()})
        }
        else
        {
          console.log("Login fail// need to add alert in html")
          if(!this.FailToast){
            this.FailToast = this.toastCtrl.create({
              message: 'Login failed',
              duration: 3000
            }); 
            this.FailToast.present()

          }
        }
      })
  
    }
    else{
      console.log("Empty input")
      if(!this.EmptyToast){
        this.EmptyToast = this.toastCtrl.create({
          message: 'Login failed',
          duration: 3000
        }); 
        this.EmptyToast.present();
      }
    }
    if(this.FailToast){
      this.FailToast.dismiss();
      this.FailToast=null;
  
    }
    if(this.EmptyToast){
      this.EmptyToast.dismiss();
      this.EmptyToast=null;
      
  
    }
  }

 
  register() {
    this.navCtrl.push(RegisterPage)
  }

}
