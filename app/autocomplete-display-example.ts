import { Component, OnInit } from '@angular/core';
import { FormControl, FormArray, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

export interface User {
  name: string;
}

/**
 * @title Display value autocomplete
 */
@Component({
  selector: 'autocomplete-display-example',
  templateUrl: 'autocomplete-display-example.html',
  styleUrls: ['autocomplete-display-example.css'],
})
export class AutocompleteDisplayExample implements OnInit {
  isReady:boolean = false;
  options: User[] = [
    { name: 'Mary' },
    { name: 'Shelley' },
    { name: 'Igor' }
  ];
  filteredOptions: Observable<User[]>[] = [];
  myForm: FormGroup;
  constructor(private fb: FormBuilder) {
    this.createForm();
  }
  createForm() {
    this.myForm = this.fb.group({
      date: [{ value: '', disabled: true }, [Validators.required]],
      notes: [''],
      items: this.initItems()
    });
    this.ManageNameControl(0);
    this.ManageNameControl(1);
    this.isReady = true;
    console.log('form created',this.myForm);
  }
  initItems() {
    var formArray = this.fb.array([]);
    
    for (let i = 0; i < 2; i++) {
      formArray.push(this.fb.group({
        product: ['', [Validators.required]],
        price: ['', [Validators.required]],
      }));
    }
    return formArray;
  }
  ManageNameControl(index: number) {
    var arrayControl = this.myForm.get('items') as FormArray;
    this.filteredOptions[index] = arrayControl.at(index).get('product').valueChanges
      .pipe(
      startWith<string | User>(''),
      map(value => typeof value === 'string' ? value : value.name),
      map(name => name ? this._filter(name) : this.options.slice())
      );

  }
  addNewItem() {
    const controls = <FormArray>this.myForm.controls['items'];
    let formGroup = this.fb.group({
      name: ['', [Validators.required]],
      age: ['', [Validators.required]],
    });
    controls.push(formGroup);
    // Build the account Auto Complete values
    this.ManageNameControl(controls.length - 1);

  }
   removeItem(i: number) {
    const controls = <FormArray>this.myForm.controls['items'];
    controls.removeAt(i);
    // remove from filteredOptions too.
    this.filteredOptions.splice(i, 1);

  }

  ngOnInit() {

  }

  displayFn(user?: User): string | undefined {
    return user ? user.name : undefined;
  }

  private _filter(name: string): User[] {
    const filterValue = name.toLowerCase();

    return this.options.filter(option => option.name.toLowerCase().indexOf(filterValue) === 0);
  }
}


/**  Copyright 2018 Google Inc. All Rights Reserved.
    Use of this source code is governed by an MIT-style license that
    can be found in the LICENSE file at http://angular.io/license */