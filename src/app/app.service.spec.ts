import { TestBed, inject } from '@angular/core/testing';

import { AppService } from './app.service';
import {HttpClient} from '@angular/common/http';
import {CookieService} from 'ngx-cookie-service';
import {Store} from '@ngrx/store';
import {of} from 'rxjs';
import {SAVE_PRINCIPAL} from './shared/save.principal.action';

const createSpy = jasmine.createSpy;

fdescribe('AppService', () => {
  let service: AppService;
  let cookieServiceStub;
  let httpClientStub;
  let storeStub;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AppService,
        { provide: CookieService, useValue: {}},
        { provide: Store, useValue: {}},
        { provide: HttpClient, useValue: {}}
      ]
    })
      .compileComponents() ;
    initStubs();
  });

  function initStubs(){
    cookieServiceStub = TestBed.get(CookieService);
    cookieServiceStub.set = createSpy('set');

    httpClientStub = TestBed.get(HttpClient);
    httpClientStub.get = createSpy('get').and.returnValue(of({}));

    storeStub = TestBed.get(Store);
    storeStub.dispatch = createSpy('dispatch');
  }

  beforeEach(inject([AppService], (_service: AppService) => {
    service = _service;
  }));

  it('should create the service', () => {
    expect(service).toBeDefined();
  });

  describe('authenticate', () => {
    it('should set token in cookies and call http get method', () => {
      // Given
      const credentials = {
        username: 'myUserName',
        password: 'myPassword'
      };

      // When
      service.authenticate(credentials, () => {});

      // Then
      const token = btoa(credentials.username + ':' + credentials.password);
      expect(cookieServiceStub.set).toHaveBeenCalledWith('token', token);
      expect(httpClientStub.get).toHaveBeenCalled();

    });

    it('should be authenticated', async() => {
      // Given
      const credentials = {
        username: 'myUserName',
        password: 'myPassword'
      };

      service.authenticated = false;

      const response = {name: 'a name'};

      httpClientStub.get.and.returnValue(of(response));

      // When
      await service.authenticate(credentials, () => {});

      // Then
      const principalAction = {
        type: SAVE_PRINCIPAL,
        payload: response
      };

      expect(storeStub.dispatch).toHaveBeenCalledWith(principalAction);
      expect(service.authenticated).toEqual(true);
    });

    it("shouldn't be authenticated", async() => {
      // Given
      const credentials = {
        username: 'myUserName',
        password: 'myPassword'
      };

      service.authenticated = false;

      const response = {name: 'a name'};

      httpClientStub.get.and.returnValue(of(null));

      // When
      await service.authenticate(credentials, () => {});

      // Then
      expect(service.authenticated).toEqual(false);
    });
  });

  describe('logout', () => {
    it('should unauthenticate and call the callback', () => {
      // Given
      service.authenticated = true;
      let nb = 0;
      const myCallback = () => { nb = 10;};

      // When
      service.logout(myCallback);

      // Then
      expect(service.authenticated).toEqual(false);
      expect(nb).toEqual(10);
    });
  });




});
