import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, timeout } from 'rxjs/operators';
import { throwError } from 'rxjs';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  title = 'weather-widget';
  config: object
  setting_visible: boolean
  arrow_top_visible: boolean
  arrow_bottom_visible: boolean
  city_list: Array<string>
  available_cities: Array<string>

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.setting_visible = false
    this.arrow_top_visible = false
    this.arrow_bottom_visible = false
    const selectedCity = localStorage.getItem('selected_city')
    this.city_list = selectedCity ? selectedCity.split(',') : ['Current City']
    this.getConfig()
  }

  openSetting() {
    this.setting_visible = true
    this.arrow_bottom_visible = false
    this.arrow_top_visible = false
  }

  updateCities(selectedCity: Array<string>) {
    this.setting_visible = false
    this.city_list = selectedCity
    localStorage.setItem('selected_city', selectedCity.join(','))
  }

  getConfig() {
    return this.http.get('assets/config.json')
      .pipe(
        timeout(1000),
        catchError((error) => {
          console.log("err")
          return throwError(error);
        })
      )
      .subscribe((data) => {
        this.config = data
        this.available_cities = this.config['city_list']
      });
  }

  arrowShow(event) {
    if (this.setting_visible) { return }

    if (event.target.scrollHeight === event.target.scrollTop + event.target.clientHeight) {
      this.arrow_bottom_visible = false
    } else {
      this.arrow_bottom_visible = true
    }
    
    if (event.target.scrollTop === 0) {
      this.arrow_top_visible = false
    } else {
      this.arrow_top_visible = true
    }
  }

  arrowHide() {
    this.arrow_bottom_visible = false
    this.arrow_top_visible = false
  }
}

