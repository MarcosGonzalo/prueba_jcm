import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClienteCrud } from './cliente-crud';

describe('ClienteCrud', () => {
  let component: ClienteCrud;
  let fixture: ComponentFixture<ClienteCrud>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClienteCrud],
    }).compileComponents();

    fixture = TestBed.createComponent(ClienteCrud);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
