import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, timeout } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-city',
  templateUrl: './city.component.html',
  styleUrls: ['./city.component.scss']
})

export class CityComponent implements OnInit {
  weather_data: any;
  unit_data: object;
  update_interval: number;
  interval: number;
  unit_type: string;
  latlon: {
    lat: number,
    lon: number
  };
  uri: string;

  @Input() city_item: string;
  @Input() config: any;

  constructor(private http: HttpClient) { }

  ngOnChanges() {
    if (this.config) {
      if (this.city_item === 'Current City') {
        this.location()
        // this.getCites()
      } else {
        this.getCites()
      }
      clearInterval(this.update_interval)
      this.update_interval = window.setInterval(
        () => { this.getData() },
        this.config.update.interval < 5000 ? 5000 : this.config.update.interval
      )
    }
  }
  ngOnInit() {
    if (!this.config) {
      this.config = {
        update: { interval: 1000 * 3600 },
        unit_type: 'none',
        unit: {
          none: {
            temp: '',
            wind: '',
            pressure: '',
            humidity: '',
            visibility: ''
          }
        }
      }
    }

    this.weather_data = {
      main: {
        feels_like: '--',
        humidity: '--',
        pressure: '--',
        temp: '--'
      },
      name: 'Current City',
      visibility: '--',
      weather: [{ main: '--' }],
      wind: {
        speed: '--'
      }
    }
  }

  ngOnDestroy() {
    clearInterval(this.update_interval)
  }

  getData() {
    return this.http.get(this.uri)
      .pipe(
        timeout(1000),
        catchError((error) => {
          console.log("err")
          return throwError(error);
        })
      )
      .subscribe((data) => {
        this.weather_data = data
        this.weather_data.main.temp = Math.round(this.weather_data.main.temp)
        this.weather_data.main.feels_like = Math.round(this.weather_data.main.feels_like)
      });
  }

  location() {
    navigator.geolocation.getCurrentPosition((position) => {
      this.latlon = {
        lat: position.coords.latitude,
        lon: position.coords.longitude
      }
      this.uri = `https://${this.config.sources.url}?lat=${this.latlon.lat}&lon=${this.latlon.lon}&units=${this.config.unit_type}&appid=${this.config.sources.api_key}`
      this.getData()
    })
  }

  getCites() {
    this.uri = `https://${this.config.sources.url}?q=${this.city_item}&units=${this.config.unit_type}&appid=${this.config.sources.api_key}`
    this.getData()
  }
}
