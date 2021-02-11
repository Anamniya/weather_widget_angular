import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss']
})

export class SettingComponent implements OnInit {

  city_list: Array<string>;
  selected_city: Array<string>;
  city: string;

  @Input() cities: Array<string>;
  @Input() available_cities: Array<string>;
  @Output() sentSelectedCity = new EventEmitter<string[]>();

  constructor() { }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.selected_city, event.previousIndex, event.currentIndex);
  }

  ngOnChanges() {
    this.city_list = this.available_cities
    this.selected_city = this.cities
  }

  ngOnInit() { }

  done() {
    if (!this.selected_city.length) { this.selected_city = ['Current City'] }
    this.sentSelectedCity.emit(
      this.selected_city
    );
    this.city = ''
  }

  select() {
    this.find()
    if (
      this.city !== '' &&
      !this.selected_city.includes(this.city) &&
      this.city_list.includes(this.city)
    ) {
      this.selected_city.push(this.city)
      this.city = ''
    }
  }

  find() {
    const city = this.city_list.filter(
      (city) => { return city.toLocaleLowerCase().includes(this.city.toLocaleLowerCase()) }
    )
    if (city[0]) {
      this.city = city[0]
    }
  }

  remove(i) {
    this.selected_city.splice(i, 1)
  }
}
