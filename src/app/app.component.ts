import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component } from '@angular/core';
import { FilesService } from './services/files.service';

import { UsersService } from './services/users.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  imgParent = '';
  showImg = true;
  token: string = '';
  imgRta: string = ''

  constructor(
    private usersService: UsersService,
    private filesService: FilesService
  ){}

  onLoaded(img: string) {
    console.log('log padre', img);
  }

  toggleImg() {
    this.showImg = !this.showImg;
  }

  createUser(){
    this.usersService.create({
      name: 'Sebas',
      email: 'sebas@gmail.com',
      password: '123342'
    }).subscribe(
      rta => {
        console.log(rta);
      }
    )
  }

  dowloadPDF(){
    this.filesService.getFile('mypdf', 'https://young-sands-07814.herokuapp.com/api/files/dummy.pdf','application/pdf')
    .subscribe(

    )
  }

  onUpload(event: Event){
    const element = event.target as HTMLInputElement;
    const file = element.files?.item(0);

    if (file){
      this.filesService.uploadFile(file)
        .subscribe(
          rta => {
            this.imgRta = rta.location;
          }
        )
    }
  }


}
