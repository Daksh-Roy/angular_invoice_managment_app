import { Inject, Injectable, InjectionToken } from '@angular/core';

export const STORAGE = new InjectionToken<Storage>('Browser Storage', {
    providedIn: 'root',
    factory: () => localStorage,
  })

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor(@Inject(STORAGE) private storage:Storage) { }

  public get(key:string):string{
      return `${this.storage.getItem(key)}`;
  }

  public set(key:string,value:{}){    
    this.storage.setItem(key,JSON.stringify(value));
  }

  public remove(key:string){
    this.storage.removeItem(key);
  }

  public clear(){
    this.storage.clear();
  }
  
}
