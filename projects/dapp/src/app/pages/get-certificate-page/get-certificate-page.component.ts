import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Subject} from 'rxjs';
import {debounceTime, takeUntil} from 'rxjs/operators';


interface ChooseFormStatus {
  type: 'success' | 'error' | 'default';
  value: string;
  category: {
    isActive: boolean;
  }
  field: {
    isActive: boolean;
  }
};
@Component({
  selector: 'app-get-certificate-page',
  templateUrl: './get-certificate-page.component.html',
  styleUrls: ['./get-certificate-page.component.scss']
})
export class GetCertificatePageComponent implements OnInit, OnDestroy {
  private destroyed$ = new Subject();
  selectedCategory!: string;
  public chooseForm: FormGroup;
  chooseFormStatus: ChooseFormStatus;
  public chooseFormIsLoading = false;
  categories: string[] = [
    '🚑 Medicine',
    '🔥 Firefighting',
    '🔧 Repairing',
    '📷 Photography',
    '💼 Law',
    '🥊 Fighting',
  ];
  constructor (
    private readonly fb: FormBuilder,
  ) {
    this.chooseForm = fb.group({
      category: [null],
      field: [''],
    }, { validator: this.chooseFormValidator.bind(this) });
    this.chooseFormStatus = {
      value: '',
      type: 'default',
      category: {
        isActive: true
      },
      field: {
        isActive: true
      }
    };

    this.chooseForm?.controls?.field?.valueChanges
      .pipe(takeUntil(this.destroyed$))
      .subscribe(() => {
        this.chooseFormFieldChange();
      });

    this.chooseForm?.controls?.category?.valueChanges
      .pipe(takeUntil(this.destroyed$))
      .subscribe(() => {
        this.chooseFormCategoryChange();
      });
  }
  chooseFormCategoryChange (){
    const val = this.chooseForm?.controls?.category.value;
    this.chooseFormStatus.category.isActive = true;
    if (val && this.chooseFormStatus.field.isActive) {
      this.chooseFormStatus.field.isActive = false;
    }
    else if (!val) {
      this.chooseFormStatus.field.isActive = true;
    }
  }
  chooseFormFieldChange (){
    const val = this.chooseForm?.controls?.field.value;
    this.chooseFormStatus.field.isActive = true;
    if (val && this.chooseFormStatus.category.isActive) {
      // this.chooseForm?.controls?.category.reset();
      // this.chooseForm?.controls?.category.disable();
      this.chooseFormStatus.category.isActive = false;
    }
    else if ( !val ) {
      // this.chooseForm?.controls?.category.disable();
      this.chooseFormStatus.category.isActive = true;
    }
  }
  chooseFormFieldChangeBlur (){
    const fieldVal = this.chooseForm?.controls?.field.value;
    // const categoryVal = this.chooseForm?.controls?.category.value;
    if (!fieldVal) {
      this.chooseFormStatus.field.isActive = false;
    }else{
      this.chooseFormStatus.category.isActive = false;
    }
  }

  chooseFormValidator (group: FormGroup, formStatus: ChooseFormStatus = this.chooseFormStatus): {[s: string ]: boolean} | null {
    if (group) {
      if (
        group.controls.category.value && formStatus.category.isActive
        || group.controls.field.value && formStatus.field.isActive
      ) {
        return null;
      }
    }
    return {error: true};
  }

  chooseFormSubmitHandler () {
    if (this.chooseForm.invalid || this.chooseFormIsLoading) {
      return;
    }
    this.chooseForm.disable();
    this.chooseFormIsLoading = true;
  }

  ngOnInit (): void {

  }
  ngOnDestroy () {
    this.destroyed$.next();
  }

}
