import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Route } from '@angular/compiler/src/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { ApiService } from '../api/api.service';
const API_URL = environment.apiURL;

@Injectable({
  providedIn: 'root',
})
export class PaymentsService {
  constructor(
    private http: HttpClient,
    private router: Router,
    private apiService: ApiService
  ) {}

  public processMembershipPayment(registration: any): Observable<any> {
    return this.http.post(API_URL + '/createMemberSubscription', {
      registration,
    });
  }

  public getMembersPaymentMethods(membersStripeId: string): Observable<any> {
    return this.http.get(API_URL + '/listpaymentmethods', {
      params: { customer: membersStripeId, type: 'card' },
    });
  }

  public retrievePaymentMethod(id: string): Observable<any> {
    return this.http.get(API_URL + '/retrievepaymentmethod', {
      params: { id: id },
    });
  }

  public addPaymentMethod(paymentMethod: any): Observable<any> {
    return this.http.post(API_URL + '/createpaymentmethod', { paymentMethod });
  }

  public updatePaymentMethod(paymentMethod: any): Observable<any> {
    return this.http.post(API_URL + '/updatepaymentmethod', { paymentMethod });
  }

  public completeRegistrationPayment(data: any): Observable<any> {
    return this.http.post(API_URL + '/completeregistrationpayment', { data });
  }

  public getMembersInvoices(memberId: any): Observable<any> {
    const params = new HttpParams().set('_id', memberId);
    return this.http.get(API_URL + '/getmembersinvoices', { params: params });
  }
}
